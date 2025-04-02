import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_address, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_address[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };

    await connectDB
    await User.create(userData)
  }
);

// Inngest function to update user data to a database
export const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updted" },
    async ({ event }) => {
      const { id, first_name, last_name, email_address, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_address[0].email_address,
        name: first_name + " " + last_name,
        imageUrl: image_url,
      };
  
      await connectDB
      await User.findByIdAndUpdate(id,userData)
    }
  );

  // Inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
      const { id } = event.data;
  
      await connectDB
      await User.findByIdAndDelete(id)
    }
  );
