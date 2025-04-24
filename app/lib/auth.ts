import { betterAuth } from "better-auth";
import db from "../../db/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { schema } from "../../db/schema/auth-schema";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
});