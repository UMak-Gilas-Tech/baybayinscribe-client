import { betterAuth } from "better-auth";
import db from "../../db/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { schema } from "../../db/schema/auth-schema";
import { sendEmail } from "./email";
import { admin } from "better-auth/plugins";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  trustedOrigins: [process.env.NEXT_PUBLIC_SITE_URL as string,],
  customPaths: {
    resetPassword: "/auth/register/resetpassword",
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, token }) => {
      const resetPasswordUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/register/resetpassword?token=${token}`;
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${resetPasswordUrl}`,
      });
    },
  },
  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    // facebook: {
    //   clientId: process.env.FACEBOOK_CLIENT_ID as string,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    // },
    reddit: {
      clientId: process.env.REDDIT_CLIENT_ID as string,
      clientSecret: process.env.REDDIT_CLIENT_SECRET as string,
      scope: ["identity", "read", "email"],
      onAuth: async (user: { id: string; email: string; name: string; emailVerified: boolean; image?: string }, account: { id: string; accountId: string; providerId: string; userId: string; accessToken?: string; refreshToken?: string; idToken?: string; scope?: string }) => {
        console.log('Reddit auth callback - User:', user);
        console.log('Reddit auth callback - Account:', account);
        
        // Ensure email is verified for Reddit users
        user.emailVerified = true;
        
        return user;
      }
    },
  },
  plugins: [
    jwt(),
    admin(),
  ],
});