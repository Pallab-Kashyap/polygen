import mongoose from "mongoose";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }
  return uri;
}

// Slightly more explicit cache typing
type MongooseCache = {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
};

// Extend globalThis so we don't create multiple connections in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

const cached: MongooseCache = global._mongooseCache!;

export async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // <-- USING getMongoUri() here guarantees a `string` to the compiler
    cached.promise = mongoose.connect(getMongoUri()).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
