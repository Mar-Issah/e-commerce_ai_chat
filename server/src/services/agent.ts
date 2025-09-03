// Import required modules from LangChain ecosystem
import { ChatOpenAI } from '@langchain/openai';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages'; // Message types for conversations
import {
  ChatPromptTemplate, // For creating structured prompts with placeholders
  MessagesPlaceholder, // Placeholder for dynamic message history
} from '@langchain/core/prompts';
import { StateGraph, Annotation } from '@langchain/langgraph'; // State-based workflow orchestration and  Type annotations for state management
import { ToolNode } from '@langchain/langgraph/prebuilt'; // Pre-built node for executing tools
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb'; // For saving conversation state
import 'dotenv/config';
import database from '../config/database';
import { retryWithBackoff, itemLookupTool } from '../utils/helper';

//const client = new MongoClient(process.env.MONGODB_URI as string)

// Main function that creates and runs the AI agent
export async function callAgent(query: string, thread_id: string) {
  try {
    // Get database instance and collections
    const db = database.getDb();
    const client = database.getClient();
    // const db = client.db("e-commerce_chat_db")
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
    //Create a tool execution node for the workflow
    const toolNode = new ToolNode<typeof GraphState.State>(tools);

    // Initialize the AI model (Openai) and bind custom tools to the model
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini', //  Use Openai model
      temperature: 0, // Deterministic responses (no randomness)
      maxRetries: 0, // Disable built-in retries (we handle our own)
      apiKey: process.env.OPENAI_API_KEY, // OPENAI API key from environment
    }).bindTools(tools);

    // Tool - Decision function: determines next step in the workflow
    function shouldContinue(state: typeof GraphState.State) {
      const messages = state.messages; // Get all messages
      const lastMessage = messages[messages.length - 1] as AIMessage; // Get the most recent message

      // If the AI wants to use tools, go to tools node; otherwise end
      if (lastMessage.tool_calls?.length) {
        return 'tools'; // Route to tool execution
      }
      return '__end__'; // End the workflow
    }

    // Tool - Function that calls the AI model with retry logic
    async function callModel(state: typeof GraphState.State) {
      return retryWithBackoff(async () => {
        // Wrap in retry logic
        // Create a structured prompt template
        const prompt = ChatPromptTemplate.fromMessages([
          [
            'system', // System message defines the AI's role and behavior
            `You are a helpful E-commerce Chatbot Agent for a clothing store.

             IMPORTANT: You have access to an item_lookup tool that searches the clothing inventory database. ALWAYS use this tool when customers ask about clothing items, even if the tool returns errors or empty results.

            When using the item_lookup tool:
            - If it returns results, provide helpful details about the clothing items
            - If it returns an error or no results, acknowledge this and offer to help in other ways
            - If the database appears to be empty, let the customer know that inventory might be being updated

            Current time: {time}`,
          ],
          new MessagesPlaceholder('messages'), // Placeholder for conversation history
        ]);

        // Fill in the prompt template with actual values
        const formattedPrompt = await prompt.formatMessages({
          time: new Date().toISOString(), // Current timestamp
          messages: state.messages, // All previous messages
        });

        // Call the AI model with the formatted prompt
        const result = await model.invoke(formattedPrompt);
        // Return new state with the AI's response added
        return { messages: [result] };
      });
    }

    //Build the workflow graph
    const workflow = new StateGraph(GraphState)
      .addNode('agent', callModel) // Add AI model node
      .addNode('tools', toolNode) // Add tool execution node
      .addEdge('__start__', 'agent') // Start workflow at agent
      .addConditionalEdges('agent', shouldContinue) // Agent decides: tools or end
      .addEdge('tools', 'agent'); // After tools, go back to agent

    // Get the database name from the database instance
    const dbName = 'e-commerce_chat_db';

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
        recursionLimit: 15, // Prevent infinite loops
        configurable: { thread_id: thread_id }, // Conversation thread identifier
      }
    );

    // Extract the final response from the conversation
    const response = finalState.messages[finalState.messages.length - 1].content;
    console.log('Agent response:', response);

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
