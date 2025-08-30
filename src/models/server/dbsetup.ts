import { db } from "../name";
import createQuestionCollection from "./question.collection";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";
export default async function getOrCreateDb() {
  try {
    await databases.get(db);
    console.log("Database already exists");
  } catch (error) {
    console.log("Creating Database...");
    try {
      await databases.create(db, "Stack Overflow ");
      console.log("Database created");
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);
      console.log("All collections created");
      console.log("database connected");
    } catch (err) {
      console.log("Error creating database or collections", err);
    }
  }
  return databases;
}
