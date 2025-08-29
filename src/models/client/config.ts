import { Client, Databases, Storage, Avatars, Account } from "appwrite";
import env from "../../env";
const client = new Client()
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId);
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
export { client, account, databases, storage, avatars };
