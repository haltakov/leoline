import { Session } from "next-auth";
import { NextRequest } from "next/server";
import { AnonymousUser, ChatUser, User } from "@prisma/client";

export interface UserPublic {
  email?: string;
  name?: string;
  subscriptionStatus?: string;
  subscriptionPriceId?: string;
  storiesCount: number;
  storiesLenghtSeconds: number;
  isActive: boolean;
}

export interface GetCurrentUserResponse {
  user: UserPublic;
  chatUser: ChatUser;
}

export interface UserWithChatUser extends User {
  chatUser: ChatUser | null;
}

export interface AnonymousUserWithChatUser extends AnonymousUser {
  chatUser: ChatUser;
}

export interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}
