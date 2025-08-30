import { Client, Databases, Permission, IndexType } from "node-appwrite";

import { db, commentCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  //create collection
  await databases.createCollection(
    db,
    commentCollection,
    "Comment Collection",
    [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ],
  );
  console.log("Comment collection created");
  //creating attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      commentCollection,
      "content",
      10000,
      true,
    ),
    databases.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["question", "answer"],
      true,
    ),
    databases.createStringAttribute(db, commentCollection, "typeId", 100, true),
    databases.createStringAttribute(
      db,
      commentCollection,
      "authorId",
      100,
      true,
    ),
  ]);
  console.log("Comment attributes created");
}
