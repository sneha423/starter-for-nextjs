import { Client, Databases, Permission, IndexType } from "node-appwrite";

import { db, questionCollection } from "../name";
import { databases } from "./config";
export default async function createQuestionCollection() {
  //create collection
  await databases.createCollection(
    db,
    questionCollection,
    "Question Collection",
    [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ],
  );
  //creating attributes
  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(
      db,
      questionCollection,
      "body",
      10000,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "tags",
      100,
      true,
      undefined,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "authorId",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "attachmentId",
      100,
      false,
    ),
  ]);
  console.log("Question attributes created");
  /*
  //creating indexes
  await Promise.all([
    databases.createIndex(
      db,
      questionCollection,
      "titleIndex",
      IndexType.Fulltext,
      ["title"],
      ["asc"],
    ),
    databases.createIndex(
      db,
      questionCollection,
      "cotentIndex",
      IndexType.Fulltext,
      ["content"],
      ["asc"],
    ),
  ]);
*/
  console.log("Question indexes created");
}
