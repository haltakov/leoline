import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { NextAuthRequest } from "@/backend/user/types";
import { getCurrentUser } from "@/backend/user/service";
import pino from "pino";

const logger = pino();

export const GET = auth(async function GET(request: NextAuthRequest) {
  try {
    const { user } = await getCurrentUser(request, request.auth);
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    logger.error(error);
    return new NextResponse("Cannot get the current user", { status: 400 });
  }
});
