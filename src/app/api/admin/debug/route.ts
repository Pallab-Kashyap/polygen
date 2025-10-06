import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
    // Test environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
    };

    // Test database connection
    let dbStatus = "unknown";
    try {
      await connectDB();
      dbStatus = "connected";
    } catch (dbError) {
      dbStatus = `error: ${
        dbError instanceof Error ? dbError.message : "Unknown DB error"
      }`;
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: dbStatus,
      message: "Admin debug endpoint working",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
