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
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
  },
  plugins: [
    jwt(),
    admin(),
  ],
});