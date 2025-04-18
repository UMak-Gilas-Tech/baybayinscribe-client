import { betterAuth } from "better-auth";
import db from "../../db/index";
import { drizzleAdapter } from "better-auth/adapters/drizzle";


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    
  }),
  emailAndPassword: {
    enabled: true,
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
});