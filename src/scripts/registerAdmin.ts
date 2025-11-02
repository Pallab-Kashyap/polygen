import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { connectDB } from "../lib/mongoose";
import Admin from "../models/Admin";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function registerAdmin() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    const username = "poly-admin";
    const password = "bPbIx791OHiP1sdG";

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      console.log(
        `Admin user "${username}" already exists. Updating password...`
      );

      // Hash the new password
      const passwordHash = await bcrypt.hash(password, 10);

      // Update the existing admin
      existingAdmin.passwordHash = passwordHash;
      await existingAdmin.save();

      console.log(`Admin user "${username}" password updated successfully!`);
    } else {
      console.log(`Creating new admin user "${username}"...`);

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create new admin
      await Admin.create({
        username,
        passwordHash,
      });

      console.log(`Admin user "${username}" created successfully!`);
    }

    console.log("\nAdmin credentials:");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error("Error registering admin:", error);
    process.exit(1);
  }
}

// Run the registration
registerAdmin();
