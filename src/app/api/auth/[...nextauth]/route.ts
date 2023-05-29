import { authOptions } from "@/server/auth";
import NextAuth from "next-auth";
import { type NextResponse } from "next/server";

const handler = NextAuth(authOptions) as Promise<NextResponse>;

export { handler as GET, handler as POST };
