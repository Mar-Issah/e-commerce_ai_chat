import { ChatOpenAI } from '@langchain/openai';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import {
  ChatPromptTemplate, // For creating structured prompts with placeholders
  MessagesPlaceholder, // Placeholder for dynamic message history
} from '@langchain/core/prompts';
import { StateGraph, Annotation } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt'; // Pre-built node for executing tools
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb'; // For saving conversation state
import 'dotenv/config';
import database from '../config/database';
import { retryWithBackoff, itemLookupTool } from '../utils/helper';


// Main function that creates and runs the AI agent
export async function callAgent(query: string, thread_id: string) {
  try {
    // Get database instance and collections
    const dbName = 'e-commerce_chat_db';
    const db = await database.getDb();
    const client = database.getClient();
    const collection = db.collection('items');

    // Define the state structure for the agent workflow
    const GraphState = Annotation.Root({
      messages: Annotation<BaseMessage[]>({
        // Reducer func: how to combine old and new mgs - Simply concat old mgs (x) with new messags (y)
        reducer: (x, y) => x.concat(y),
      }),
    });

    // Array of all available tools (just one in this case)
    const tools = [itemLookupTool];

    const toolNode = new ToolNode<typeof GraphState.State>(tools);

    // Initialize the AI model (Openai) and bind custom tools to the model
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      maxRetries: 0,
      maxTokens: 200,
      apiKey: process.env.OPENAI_API_KEY,
    }).bindTools(tools);

    // Tool - Decision function: determines next step in the workflow
    function shouldContinue(state: typeof GraphState.State) {
      const messages = state.messages; // Get all messages
      const lastMessage = messages[messages.length - 1] as AIMessage;

      //console.log('Last message tool_calls:', lastMessage.tool_calls);

      // If the AI wants to use tools, go to tools node; otherwise end
      if (lastMessage.tool_calls?.length) {
        // console.log('Routing to tools node');
        return 'tools'; // Route to tool execution
      }
      //console.log('Ending workflow - no tool calls');
      return '__end__'; // End the workflow
    }

    // Tool - Function that calls the AI model with retry logic
    async function callModel(state: typeof GraphState.State) {
      return retryWithBackoff(async () => {
        // Wrap in retry logic
        const prompt = ChatPromptTemplate.fromMessages([
          ['system',
          `You are a helpful E-commerce Chatbot Agent for a clothing store.

          IMPORTANT: You have access to an item_lookup tool that searches the clothing inventory database.

          ALWAYS use the item_lookup tool when customers ask about:
          - Specific clothing items (shirts, pants, dresses, hat, wallet, belt, sweater, shoes, gloves, scarf, cardigan, bag, shorts etc.)
          - Brands or manufacturers
          - Categories of clothing
          - Product recommendations
          - Price inquiries
          - Any clothing-related questions

          RESPONSE FORMAT RULES:
          - Keep responses SHORT and conversational (2-4 sentences max)
          - Show only 2-3 most relevant items initially
          - Format: "Item Name by Brand - $Price"
          - NO bold/markdown formatting
          - NO bullet points or numbered lists
          - NO detailed descriptions unless specifically asked
          - Use natural conversation flow with line breaks for readability
          - If customer wants more details, ask what specifically they'd like to know
          - ALWAYS put each item starting with "- "or "1." on its own line with a line break before it.

          VARIED RESPONSE EXAMPLES:
          Enthusiastic: "Oh Sarah, I found some amazing winter pieces!
          1. The North Face Winter Coat is $159.99 and it's gorgeous.
          2. J.Crew Wool Peacoat for $199.99 is also stunning
          Which one catches your eye?"

          Casual: "Hey! So I found a couple solid options:
          1. North Face has this winter coat for $159.99, and
          2. J.Crew's got a wool peacoat at $199.99. Both pretty sweet deals.
          Want me to tell you more about either?"

          Professional: "Good afternoon, Michael. I've located two excellent winter coat options for you.
          1. The North Face Winter Coat is available for $159.99,
          2. J.Crew Wool Peacoat priced at $199.99.
          Would you prefer details on either of these items?"

          GREETING VARIATIONS - Mix these up:
          - "Hi there!" / "Hey!" / "Hello!" / "Good [time of day]!"
          - When they give name: "Nice to meet you, [Name]!" / "Hi [Name]!" / "Hey [Name]!"
          - Follow-up: "What can I help you find?" / "What are you shopping for?" / "How can I help?"

          Current time: {time}`,
          ],
          new MessagesPlaceholder('messages'), // Placeholder for conversation history
        ]);

        // Fill in the prompt template with actual values
        const formattedPrompt = await prompt.formatMessages({
          time: new Date().toISOString(),
          messages: state.messages,
        });

        // Call the AI model with the formatted prompt
        const result = await model.invoke(formattedPrompt);
        // Return new state with the AI's response added
        return { messages: [result] };
      });
    }

    //Build the workflow graph
    const workflow = new StateGraph(GraphState)
      .addNode('agent', callModel)
      .addNode('tools', toolNode)
      .addEdge('__start__', 'agent')
      .addConditionalEdges('agent', shouldContinue)
      .addEdge('tools', 'agent');

    // Initialize conversation state persistence
    const checkpointer = new MongoDBSaver({ client, dbName });
    // Compile the workflow with state saving
    const app = workflow.compile({ checkpointer });

    // Execute the workflow
    const finalState = await app.invoke(
      {
        messages: [new HumanMessage(query)], // Start with user's question
      },
      {
        recursionLimit: 10, // Prevent infinite loops
        configurable: { thread_id: thread_id }, // Conversation thread identifier
      }
    );

    // Extract the final response from the conversation
    const response = finalState.messages[finalState.messages.length - 1].content;
    // console.log('Agent response:', response);

    return response; // Return the AI's final response
  } catch (error: any) {
    // Handle different types of errors with user-friendly messages
    console.error('Error in callAgent:', error.message);

    if (error.status === 429) {
      // Rate limit error
      throw new Error('Service temporarily unavailable due to rate limits. Please try again in a minute.');
    } else if (error.status === 401) {
      // Authentication error
      throw new Error('Authentication failed. Please check your API configuration.');
    } else {
      // Generic error
      throw new Error(`Agent failed: ${error.message}`);
    }
  }
}
