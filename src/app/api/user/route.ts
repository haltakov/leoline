import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { NextAuthRequest } from "@/backend/user/types";
import { getCurrentUser } from "@/backend/user/service";
import pino from "pino";
import { createLog } from "@/backend/logging/service";

const logger = pino();

export const GET = auth(async function GET(request: NextAuthRequest) {
  try {
    const { user } = await getCurrentUser(request);
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    await createLog({ level: "error", message: `Cannot get current user: ${error}`, notify: true });
    return new NextResponse("Cannot get the current user", { status: 400 });
  }
});
