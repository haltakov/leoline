import { Session } from "next-auth";
import { NextRequest } from "next/server";
import { AnonymousUser, ChatUser } from "@prisma/client";

export interface UserPublic {
  email?: string;
  name?: string;
  isActive: boolean;
}

export interface AnonymousUserWithChatUser extends AnonymousUser {
  chatUser: ChatUser;
}

export interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}
