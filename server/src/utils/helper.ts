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
        //console.log(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

export async function performVectorSearch(query: string, n: number, collection: any): Promise<ItemLookupResult> {
try {
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

  const result = await vectorStore.similaritySearch(query, n);
  return { results: result, searchType: 'vector', query, count: result.length };
}  catch (error) {
    console.error("Vector search error:", error);
    // Return empty result instead of throwing, so text search can be attempted
    return { results: [], searchType: 'vector', query, count: 0 };
  }
}

export async function performTextSearch(query: string, n: number, collection: any): Promise<ItemLookupResult> {
  try {
  const textResults = await collection
    .find({
      $or: [
        { item_name: { $regex: query, $options: 'i' } },
        { item_description: { $regex: query, $options: 'i' } },
        { categories: { $regex: query, $options: 'i' } },
        { embedding_text: { $regex: query, $options: 'i' } },
      ]},
      {
      projection: {
          // Exclude the massive embedding field
          embedding: 0,
          image: 0,
          metadata:0
        }})
    .limit(n)
    .toArray();
    console.log('Text search completed..:', textResults)

  return { results: textResults, searchType: 'text', query, count: textResults.length };
}catch (error) {
    console.error("Text search error:", error);
    return { results: [], searchType: 'text', query, count: 0 };
  }
}

// Create the tool with proper JSON schema
export const itemLookupTool = tool(
  async (input: unknown) => {
    console.log('Tool received input:', JSON.stringify(input, null, 2));

    // Validate input using Zod
    try {
          const validatedInput = ItemLookupInputSchema.parse(input);
    const { query, n = 3} = validatedInput;

    // console.log('Validated input - query:', query, 'n:', n);
      const db = await database.getDb();
      const collection = db.collection('items');
      const totalCount = await collection.countDocuments();
      // console.log(totalCount)

      if (totalCount === 0) {
        return JSON.stringify({
          error: 'No items found in inventory',
          message: 'The inventory database appears to be empty',
          count: 0,
        } as ItemLookupError);
      }
  // Try vector search first
      const vectorResult = await performVectorSearch(query, n, collection);
      console.log('Vector search completed. Count:', vectorResult.count);

      if (vectorResult.count > 0) return JSON.stringify(vectorResult);
      // If the Mongodb search doesnt return anything, then perform a text search
      const textResult = await performTextSearch(query, n, collection);


      if (textResult.count > 0) {
        // console.log('Text search successful, returning results');
        return JSON.stringify(textResult);
      }
       //If  No results from either search
      const noResultsError = {
        error: 'No matching items found',
        message: `No items found matching "${query}". Please try a different search term.`,
        count: 0,
        query
      } as ItemLookupError;
      console.log('No results found, returning:', noResultsError);
      return JSON.stringify(noResultsError);
    }
    catch (error: any) {
      return JSON.stringify({
        error: 'Failed to search inventory',
        details: error.message,
        input,
      } as ItemLookupError);
    }
  },
  {
    name: 'item_lookup',
    description: 'Gathers clothing item details from the Inventory database',
    schema: itemLookupSchema, // Use the JSON schema directly
  }
);
