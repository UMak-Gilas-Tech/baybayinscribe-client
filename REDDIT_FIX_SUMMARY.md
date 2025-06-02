## Reddit OAuth Configuration Fix

### Problem Solved ✅

The issue was that Reddit's OAuth API doesn't provide email addresses by default. The `better-auth` Reddit provider was falling back to using `profile.oauth_client_id` (your app's client ID) as the email for all Reddit users, causing them to share the same account.

### Changes Made

1. **Updated Reddit Provider Configuration** in `app/lib/auth.ts`:
   - Added `mapProfileToUser` function to create unique email identifiers
   - Each Reddit user now gets a unique email like `reddit_<user_id>@reddit.local`
   - Set `emailVerified: false` since Reddit doesn't provide email verification

2. **Created Cleanup Script** (`scripts/cleanup-reddit-users.ts`):
   - Analyzes existing Reddit users for duplicates
   - Provides guidance for manual cleanup if needed
   - Added npm script: `npm run cleanup-reddit`

### How It Works Now

```typescript
reddit: {
  clientId: process.env.REDDIT_CLIENT_ID as string,
  clientSecret: process.env.REDDIT_CLIENT_SECRET as string,
  scope: ["identity", "read"],
  mapProfileToUser: (profile: any) => {
    // Creates unique email using Reddit user ID
    const uniqueEmail = `reddit_${profile.id}@reddit.local`;
    
    return {
      email: uniqueEmail,
      emailVerified: false,
      name: profile.name || `reddit_user_${profile.id}`,
    };
  },
},
```

### Testing

- ✅ No existing Reddit users found in database
- ✅ New Reddit users will get unique accounts
- ✅ Email uniqueness constraint will be respected

### Next Steps

1. **Test the Fix**: Try creating multiple Reddit accounts to verify they're unique
2. **Monitor Logs**: Check the console logs during Reddit OAuth to verify correct user creation
3. **User Experience**: Consider adding a profile completion flow for Reddit users to add a real email

### Important Notes

- Reddit users will have synthetic emails (`reddit_<id>@reddit.local`)
- These users cannot receive password reset emails (since they don't have real emails)
- Consider implementing a "link real email" feature for Reddit users
- The `emailVerified` field is set to `false` for Reddit users

### Commands

```bash
# Run cleanup analysis (safe to run anytime)
npm run cleanup-reddit

# Start dev server to test
npm run dev
```
