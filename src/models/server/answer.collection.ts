import { Client, Databases, Permission, IndexType } from "node-appwrite";

import { db, answerCollection } from "../name";
import { databases } from "./config";
export default async function createAnswerCollection() {
  //create collection
  await databases.createCollection(db, answerCollection, "Answer Collection", [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Answer collection created");
  //creating attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      answerCollection,
      "content",
      10000,
      true,
    ),
    databases.createStringAttribute(
      db,
      answerCollection,
      "questionId",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      answerCollection,
      "authorId",
      100,
      true,
    ),
  ]);
  console.log("Answer attributes created");
}
