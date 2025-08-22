import connectToDatabase from "@/lib/mongoose";
import Article from "@/models/Article";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("Starting article migration via API...");
    
    await connectToDatabase();
    
    // Update all articles that don't have the new device fields
    const result = await Article.updateMany(
      {
        $or: [
          { deviceLikes: { $exists: false } },
          { deviceDislikes: { $exists: false } },
          { deviceHearts: { $exists: false } }
        ]
      },
      {
        $set: {
          deviceLikes: [],
          deviceDislikes: [],
          deviceHearts: []
        }
      }
    );
    
    console.log(`Migration completed! Updated ${result.modifiedCount} articles.`);
    
    return NextResponse.json({
      success: true,
      message: `Migration completed! Updated ${result.modifiedCount} articles.`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });
    
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json({
      success: false,
      message: "Migration failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
