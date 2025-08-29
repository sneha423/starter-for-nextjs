import { IndexType, Permission } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  // 1️⃣ Create collection if it doesn't exist
  try {
    await databases.createCollection(
      db,
      questionCollection,
      questionCollection,
      [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
      ],
    );
    console.log("Collection created:", questionCollection);
  } catch (error) {
    if (error.code === 409)
      console.log("Collection already exists:", questionCollection);
    else throw error;
  }

  // 2️⃣ Create attributes safely
  const attributes = [
    { key: "title", size: 100, required: true },
    { key: "content", size: 1000, required: true },
    { key: "authorId", size: 100, required: true },
    { key: "attachmentId", size: 100, required: true },
    { key: "tags", size: 200, required: true, array: true },
  ];

  for (const attr of attributes) {
    try {
      await databases.createStringAttribute(
        db,
        questionCollection,
        attr.key,
        attr.size,
        attr.required,
        undefined,
        attr.array || false,
      );
      console.log(`Attribute created: ${attr.key}`);
    } catch (error) {
      if (error.code === 409)
        console.log(`Attribute already exists: ${attr.key}`);
      else throw error;
    }
  }

  // 3️⃣ Create indexes safely
  const indexes = [
    { key: "title_index", attributes: ["title"] },
    { key: "content_index", attributes: ["content"] },
  ];

  for (const idx of indexes) {
    try {
      await databases.createIndex(
        db,
        questionCollection,
        idx.key,
        IndexType.Fulltext,
        idx.attributes,
        ["asc"],
      );
      console.log(`Index created: ${idx.key}`);
    } catch (error) {
      if (error.code === 409) console.log(`Index already exists: ${idx.key}`);
      else throw error;
    }
  }

  console.log("Collection setup complete!");
}
