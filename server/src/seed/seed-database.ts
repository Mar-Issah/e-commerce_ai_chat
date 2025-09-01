import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
// Import MongoDB Atlas vector search for storing and searching embeddings
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import 'dotenv/config';
import { itemSchema, Item } from '../models/Message';
import { MongoClient } from 'mongodb';
import sampleData from './sample-data.json';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

const client = new MongoClient(process.env.MONGODB_URI as string); // create client instance
const db = client.db('e-commerce_chat_db');

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to create database and collection before seeding
async function setupDatabaseAndCollection(): Promise<void> {
  // Create the items collection if it doesn't exist
  const collections = await db.listCollections({ name: 'items' }).toArray();

  if (collections?.length === 0) {
    await db.createCollection('items');
    console.log("Created 'items' collection in 'e-commerce_chat_db' database");
  } else {
    console.log("'items' collection already exists in 'e-commerce_chat_db' database");
  }
}

async function createVectorSearchIndex(): Promise<void> {
  // Create the index on the items collection
  try {
    const collection = db.collection('items');
    await collection.dropIndexes();
    const vectorSearchIdx = {
      name: 'vector_index',
      type: 'vectorSearch',
      definition: {
        fields: [
          {
            type: 'vector',
            path: 'embedding',
            numDimensions: 1024,
            similarity: 'cosine',
          },
        ],
      },
    };
    console.log('Creating vector search index...');
    await collection.createSearchIndex(vectorSearchIdx);

    console.log('Successfully created vector search index');
  } catch (e) {
    console.error('Failed to create vector search index:', e);
  }
}

async function generateSampleData(): Promise<Item[]> {
  // Create parser that ensures AI output matches our item schema
  const parser = StructuredOutputParser.fromZodSchema(z.array(itemSchema));

  // Create detailed prompt instructing AI to generate clothing store data
  const prompt = `You are a helpful assistant that generates clothing store item data. Generate 10 clothing store items. Each record should include the following fields: item_id, item_name, item_description, brand, manufacturer_address, prices, categories, user_reviews, notes. Ensure variety in the data and realistic values.

  ${parser.getFormatInstructions()}`; // Add format instructions from parser

  // Log progress to console
  console.log('Generating Sample data...');

  // Send prompt to AI and get response
  const response = await llm.invoke(prompt);
  // Parse AI response into structured array of Item objects
  return parser.parse(response.content as string);
}

// Function to get sample data from JSON file
function getSampleData(): Item[] {
  console.log('Loading sample data from JSON file...');
  return sampleData as Item[];
}

// Function to create a searchable text summary from clothing item data this is the actual data we are embedding.
async function createItemFormat(item: Item): Promise<string> {
  return new Promise((resolve) => {
    // Extract all data fields
    const manufacturerDetails = `Made in ${item.manufacturer_address.country}`;
    const categories = item.categories.join(', ');
    const userReviews = item.user_reviews
      .map((review) => `Rated ${review.rating} on ${review.review_date}: ${review.comment}`)
      .join(' ');

    const basicInfo = `${item.item_name} ${item.item_description} from the brand ${item.brand}`;

    const price = `At full price it costs: ${item.prices.full_price} USD, On sale it costs: ${item.prices.sale_price} USD`;

    const notes = item.notes;

    // Combine all information into comprehensive summary for vector search
    const summary = `${basicInfo}. Manufacturer: ${manufacturerDetails}. Categories: ${categories}. Reviews: ${userReviews}. Price: ${price}. Notes: ${notes}`;

    // Resolve promise with complete summary
    resolve(summary);
  });
}

async function seedDatabase(): Promise<void> {
  try {
    await setupDatabaseAndCollection();

    // Create vector search index
    await createVectorSearchIndex();

    // Clear existing data from collection (fresh start)
    const collection = db.collection('items');
    await collection.deleteMany({});
    console.log('Cleared existing data from items collection');

    // Load sample data from JSON file
    const sampleData = getSampleData();
    console.log(`Loaded ${sampleData.length} items from sample data`);

    // Process each item: create summary and prepare for vector storage
    // we are mapping the array each map calls the async func tion which return a promise so we use Promise.all to resolve/reject all the promises
    const recordsWithSummaries = await Promise.all(
      sampleData.map(async (record) => ({
        pageContent: await createItemFormat(record), // Create searchable summary
        metadata: { ...record }, // Preserve original item data
      }))
    );

    // Store each summary record with vector embeddings in MongoDB
    for (const record of recordsWithSummaries) {
      // Create vector embeddings and store in MongoDB Atlas using Gemini
      await MongoDBAtlasVectorSearch.fromDocuments(
        [record], // Array containing single record
        new OpenAIEmbeddings({ model: 'text-embedding-3-large', apiKey: process.env.OPENAI_API_KEY }),
        {
          collection, // MongoDB collection reference
          indexName: 'vector_index', // Name of vector search index
          textKey: 'embedding_text', // Field name for searchable text
          embeddingKey: 'embedding', // Field name for vector embeddings
        }
      );

      // Log progress for each successfully processed item
      console.log('Successfully processed & saved record:', record.metadata.item_id);
    }

    console.log('Database seeding completed');
  } catch (error) {
    // Log any errors that occur during database seeding
    console.error('Error seeding database:', error);
  } finally {
    // Always close database connection when finished (cleanup)
    await client.close();
  }
}

// Execute the database seeding function and handle any errors
seedDatabase().catch(console.error);
