import { Client, Databases, Permission, IndexType } from "node-appwrite";

import { db, voteollection } from "../name";
import { databases } from "./config";
export default async function createVoteCollection() {
  //create collection
  await databases.createCollection(db, voteollection, "Vote Collection", [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Vote collection created");
  //creating attributes
  await Promise.all([
    databases.createEnumAttribute(
      db,
      voteollection,
      "voteStatus",
      ["upvoted", "downvoted"],
      true,
    ),
    databases.createEnumAttribute(
      db,
      voteollection,
      "type",
      ["question", "answer"],
      true,
    ),
    databases.createStringAttribute(db, voteollection, "typeId", 100, true),
    databases.createStringAttribute(db, voteollection, "votedById", 100, true),
  ]);
  console.log("Vote attributes created");
}
