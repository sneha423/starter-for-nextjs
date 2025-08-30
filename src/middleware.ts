import { NextRequest, NextResponse } from "next/server";
import getOrCreateDb from "./models/server/dbsetup";
import getOrCreateStorage from "./models/server/storageSetup";
export async function middleware(request: NextRequest) {
  await Promise.all([getOrCreateDb(), getOrCreateStorage()]);
  return NextResponse.next();
}
//whereever the matcher matches, the middleware will not run there
/*match all paths except for the ones specified in the matcher
-api
- _next/static
- _next/image
- favicon.com
*/
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
