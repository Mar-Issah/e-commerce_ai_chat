import { MongoClient } from 'mongodb';
import 'dotenv/config';
import sampleData from './sample-data.json';

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db('e-commerce_chat_db');

interface ProductImage {
  item_id: string;
  image: string;
}

async function migrateImages(): Promise<void> {
  try {
    console.log('🔄 Starting image migration...');

    // Connect to database
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const collection = db.collection('items');

    // Get all existing items from the database
    const existingItems = await collection.find({}).toArray();
    console.log(`📊 Found ${existingItems.length} existing items in database`);

    if (existingItems.length === 0) {
      console.log('⚠️  No existing items found. Run the seed script first.');
      return;
    }

    // Create a map of item_id to image from the updated sample data
    const imageMap = new Map<string, string>();
    (sampleData as any[]).forEach((item) => {
      if (item.image) {
        imageMap.set(item.item_id, item.image);
      }
    });

    console.log(`🖼️  Found ${imageMap.size} items with images in sample data`);

    // Update each existing item with the image field
    let updatedCount = 0;
    let skippedCount = 0;

    for (const item of existingItems) {
      const itemId = item.metadata?.item_id || item.item_id;
      const imageUrl = imageMap.get(itemId);

      if (imageUrl) {
        // Update the item with the image field
        // Use $set to only add/update the image field without affecting other fields
        await collection.updateOne(
          { _id: item._id },
          {
            $set: {
              'metadata.image': imageUrl,
              image: imageUrl, // Also add to root level if needed
            },
          }
        );
        updatedCount++;
        console.log(`✅ Updated ${itemId} with image`);
      } else {
        skippedCount++;
        console.log(`⚠️  No image found for ${itemId}`);
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`✅ Updated: ${updatedCount} items`);
    console.log(`⚠️  Skipped: ${skippedCount} items`);
    console.log(`📊 Total processed: ${existingItems.length} items`);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Execute the migration
migrateImages().catch(console.error);
