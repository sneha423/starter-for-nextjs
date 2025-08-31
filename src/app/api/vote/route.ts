import { databases, users } from "../../../models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { answerCollection, db, questionCollection } from "../../../models/name";
import { votecollection } from "../../../models/name";
import { Query, ID } from "node-appwrite";
import { UserPrefs } from "../../../store/auth";

export async function POST(request: NextRequest) {
  try {
    //garb the data
    const { votedById, voteStatus, type, typeId } = await request.json();
    //list-document
    const response = await databases.listDocuments(db, votecollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ]);
    if (response.documents.length > 0) {
      await databases.deleteDocument(
        db,
        votecollection,
        response.documents[0].$id,
      );
      //decrease the reputation
      const QuestionOrAnswer = await databases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId,
      );
      //grab the preference
      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionOrAnswer.authotId,
      );

      await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
        reputation:
          response.documents[0].voteStatus === "upvoted"
            ? Number(authorPrefs.reputation) - 1
            : Number(authorPrefs.reputation) + 1,
      });
    }
    //that means prev vote does not exist or vote status changes
    if (response.documents[0]?.voteStatus !== voteStatus) {
      //create a new vote document
      const doc = await databases.createDocument(
        db,
        votecollection,
        ID.unique(),
        { type, typeId, voteStatus, votedById },
      );
      //increase or decrease reputation
      const QuestionOrAnswer = await databases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId,
      );
      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionOrAnswer.authotId,
      );
      //if vote was present
      if (response.documents[0]) {
        await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
          reputation:
            //means prev vote was upvoted and new value is downvoted so we have to decrease the reputaion
            response.documents[0].voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) - 1
              : Number(authorPrefs.reputation) + 1,
        });
      } else {
        await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
          reputation:
            //means prev vote was upvoted and new value is downvoted so we have to decrease the reputaion
            response.documents[0].voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) + 1
              : Number(authorPrefs.reputation) - 1,
        });
      }
    }

    //send back the count of upvote and downvote
    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, votecollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),

      databases.listDocuments(db, votecollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),
    ]);
    return NextResponse.json(
      {
        data: {
          document: null,
          voteResult: (upvotes.total = downvotes.total),
        },
        message: "vote handled",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error?.message || "error creating answer",
      },
      {
        status: error?.status || error?.code || 500,
      },
    );
  }
}
