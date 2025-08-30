import { Client, Databases, Permission, IndexType } from "node-appwrite";

import { db, questionAttachmentBucket } from "../name";
import { storage } from "./config";
export default async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage bucket already exists");
  } catch (error) {
    try {
      await storage.createBucket(
        questionAttachmentBucket,
        "Question Attachment Bucket",
        [
          Permission.read("any"),
          Permission.read("users"),
          Permission.create("users"),
          Permission.update("users"),
          Permission.delete("users"),
        ],
        false,
        undefined,
        undefined,
        ["jpg", "png", "jpeg", "gif", "pdf", "doc", "docx", "xls", "xlsx"],
      );
      console.log("Storage bucket created");
      console.log("bucket created");
    } catch (err) {
      console.log("Error creating storage bucket", err);
    }
  }
}
