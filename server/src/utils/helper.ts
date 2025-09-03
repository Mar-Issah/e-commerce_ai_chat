import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { OpenAIEmbeddings } from '@langchain/openai';
import { tool } from '@langchain/core/tools';
import database from '../config/database';
import { z } from 'zod';

interface ItemLookupResult {
  results: any[];
  searchType: 'vector' | 'text';
  query: string;
  count: number;
}

interface ItemLookupError {
  error: string;
  message?: string;
  details?: string;
  count?: number;
  query?: string;
}

// Zod schema for validation
const ItemLookupInputSchema = z.object({
  query: z.string().describe('The search query'),
  n: z.number().optional().default(10).describe('Number of results to return'),
});

type ItemLookupInput = z.infer<typeof ItemLookupInputSchema>;

// JSON Schema for LangChain tool (without Zod conversion)
const itemLookupSchema = {
  type: 'object' as const,
  properties: {
    query: {
      type: 'string' as const,
      description: 'The search query',
    },
    n: {
      type: 'number' as const,
      description: 'Number of results to return',
      default: 10,
    },
  },
  required: ['query'] as const,
  additionalProperties: false as const,
} as const;

export async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.status === 429 && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

export async function performVectorSearch(query: string, n: number, collection: any): Promise<ItemLookupResult> {
  const vectorStore = new MongoDBAtlasVectorSearch(
    new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-3-large',
    }),
    {
      collection,
      indexName: 'vector_index',
      textKey: 'embedding_text',
      embeddingKey: 'embedding',
    }
  );

  const result = await vectorStore.similaritySearchWithScore(query, n);
  return { results: result, searchType: 'vector', query, count: result.length };
}

export async function performTextSearch(query: string, n: number, collection: any): Promise<ItemLookupResult> {
  const textResults = await collection
    .find({
      $or: [
        { item_name: { $regex: query, $options: 'i' } },
        { item_description: { $regex: query, $options: 'i' } },
        { categories: { $regex: query, $options: 'i' } },
        { embedding_text: { $regex: query, $options: 'i' } },
      ],
    })
    .limit(n)
    .toArray();

  return { results: textResults, searchType: 'text', query, count: textResults.length };
}

// Create the tool with proper JSON schema
export const itemLookupTool = tool(
  async (input: unknown) => {
    console.log('Tool received input:', JSON.stringify(input, null, 2));

    // Validate input using Zod
    const validatedInput = ItemLookupInputSchema.parse(input);
    const { query, n = 10 } = validatedInput;

    console.log('Validated input - query:', query, 'n:', n);

    try {
      const collection = database.getDb().collection('items');
      const totalCount = await collection.countDocuments();

      if (totalCount === 0) {
        return JSON.stringify({
          error: 'No items found in inventory',
          message: 'The inventory database appears to be empty',
          count: 0,
        } as ItemLookupError);
      }

      const vectorResult = await performVectorSearch(query, n, collection);
      console.log(vectorResult);
      if (vectorResult.count > 0) return JSON.stringify(vectorResult);

      const textResult = await performTextSearch(query, n, collection);
      console.log(textResult);
      return JSON.stringify(textResult);
    } catch (error: any) {
      return JSON.stringify({
        error: 'Failed to search inventory',
        details: error.message,
        query,
      } as ItemLookupError);
    }
  },
  {
    name: 'item_lookup',
    description: 'Gathers clothing item details from the Inventory database',
    schema: itemLookupSchema, // Use the JSON schema directly
  }
);
