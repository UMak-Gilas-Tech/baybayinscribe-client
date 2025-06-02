import db from "../db/drizzle";
import { user, account } from "../db/schema/auth-schema";
import { eq } from "drizzle-orm";

/**
 * This script cleans up Reddit users that may have been created with duplicate emails
 * due to the previous Reddit OAuth configuration issue.
 * 
 * Run this script after updating your Reddit OAuth configuration to use unique emails.
 */

async function cleanupRedditUsers() {
  console.log("🔍 Starting Reddit users cleanup...");

  try {
    // Find all Reddit accounts
    const redditAccounts = await db
      .select({
        accountId: account.accountId,
        userId: account.userId,
        id: account.id,
      })
      .from(account)
      .where(eq(account.providerId, "reddit"));

    console.log(`📊 Found ${redditAccounts.length} Reddit accounts`);

    if (redditAccounts.length === 0) {
      console.log("✅ No Reddit accounts found. Nothing to clean up.");
      return;
    }

    // Get all users associated with Reddit accounts
    const redditUserIds = redditAccounts.map(acc => acc.userId);
    
    // Query users one by one to avoid complex IN queries
    const redditUsers = [];
    for (const userId of redditUserIds) {
      const userResult = await db
        .select()
        .from(user)
        .where(eq(user.id, userId));
      if (userResult.length > 0) {
        redditUsers.push(userResult[0]);
      }
    }

    console.log(`👥 Found ${redditUsers.length} Reddit users`);

    // Check for users with the problematic email pattern (likely using oauth_client_id)
    const problematicUsers = redditUsers.filter(u => 
      u.email && !u.email.startsWith('reddit_') && !u.email.includes('@')
    );

    if (problematicUsers.length > 0) {
      console.log(`⚠️  Found ${problematicUsers.length} users with problematic email patterns:`);
      problematicUsers.forEach(u => {
        console.log(`   - User ID: ${u.id}, Email: ${u.email}`);
      });

      console.log("\n🚨 MANUAL ACTION REQUIRED:");
      console.log("These users likely have the same email (your app's client ID).");
      console.log("You should:");
      console.log("1. Delete these duplicate users manually after backing up any important data");
      console.log("2. Or update their emails to unique values");
      console.log("3. Ask affected users to re-register with Reddit OAuth");
    }

    // Check for users with duplicate emails
    const emailCounts: Record<string, typeof redditUsers> = {};
    redditUsers.forEach(u => {
      if (u.email) {
        if (!emailCounts[u.email]) emailCounts[u.email] = [];
        emailCounts[u.email].push(u);
      }
    });

    const duplicateEmails = Object.entries(emailCounts).filter(([email, users]) => users.length > 1);

    if (duplicateEmails.length > 0) {
      console.log(`🔄 Found duplicate emails affecting ${duplicateEmails.length} email addresses`);
      
      console.log("\n📋 Duplicate email groups:");
      duplicateEmails.forEach(([email, users]) => {
        console.log(`   Email: ${email} (${users.length} users)`);
        users.forEach(u => console.log(`     - User ID: ${u.id}, Name: ${u.name}`));
      });
    } else {
      console.log("✅ No duplicate emails found among Reddit users");
    }

    console.log("\n✅ Cleanup analysis complete!");
    console.log("\n📝 Next steps:");
    console.log("1. The Reddit OAuth configuration has been updated to create unique emails");
    console.log("2. New Reddit users will get unique emails like 'reddit_<user_id>@reddit.local'");
    console.log("3. Manual cleanup of existing duplicate users may be required");

  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }
}

// Run the cleanup
cleanupRedditUsers()
  .then(() => {
    console.log("🎉 Cleanup script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Cleanup script failed:", error);
    process.exit(1);
  });
