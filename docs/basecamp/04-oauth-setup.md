# Basecamp OAuth 2.0 Setup Guide

Complete guide for obtaining Basecamp API access tokens using OAuth 2.0.

## Overview

The Basecamp webhook system requires API authentication. This guide walks you through:
1. Registering your OAuth application
2. Obtaining access tokens
3. Configuring your environment
4. Testing the integration

## Prerequisites

- Basecamp 4 account
- Admin access to your Basecamp account
- Access to your project's `.env.local` file

## Step 1: OAuth Application Already Registered ✅

Your application is already registered with these credentials:

**Integration Details:**
- **Company:** Design Dream
- **Website:** https://designdream.is
- **Client ID:** `9193364e288b329638a2d1256d35e3279636b00b`
- **Client Secret:** `7597b1373480183565b9db9d112498341f5a4f06`
- **Redirect URI:** `https://designdream.is/api/auth/basecamp/callback`

These credentials are already configured in your `.env.local` file.

## Step 2: Obtain Access Token

### Option A: Production Flow (Recommended)

1. **Deploy your app to production** (designdream.is)

2. **Visit the OAuth endpoint:**
   ```
   https://designdream.is/api/auth/basecamp
   ```

3. **Authorize the application:**
   - You'll be redirected to Basecamp's authorization page
   - Click "Yes, I'll allow access" to authorize

4. **Copy the access token:**
   - After authorization, you'll be redirected to a success page
   - The page displays your access token and refresh token
   - Click the "Copy Access Token" button

5. **Update environment variables:**
   - In production (Vercel), add the token to environment variables
   - In local development, update `.env.local`:

   ```bash
   BASECAMP_ACCESS_TOKEN=<your_access_token_here>
   BASECAMP_REFRESH_TOKEN=<your_refresh_token_here>  # Optional but recommended
   ```

6. **Restart your application:**
   ```bash
   # Local development
   npm run dev

   # Production (Vercel)
   # Redeploy or restart from Vercel dashboard
   ```

### Option B: Local Development Flow

If you need to test OAuth locally:

1. **Temporarily update redirect URI in Basecamp:**
   - Go to: https://launchpad.37signals.com/integrations
   - Edit your "Design Dream Website" integration
   - Change redirect URI to: `http://localhost:3002/api/auth/basecamp/callback`
   - Save changes

2. **Update `.env.local`:**
   ```bash
   BASECAMP_REDIRECT_URI=http://localhost:3002/api/auth/basecamp/callback
   ```

3. **Start local server:**
   ```bash
   npm run dev
   ```

4. **Visit OAuth endpoint:**
   ```
   http://localhost:3002/api/auth/basecamp
   ```

5. **Complete authorization** (same as production flow)

6. **⚠️ Important: Restore production redirect URI:**
   - After testing, change redirect URI back to: `https://designdream.is/api/auth/basecamp/callback`
   - Update `.env.local` back to production URL

## Step 3: Verify Token Works

Test the API connection:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
     -H "User-Agent: Design Dream (hello@designdream.is)" \\
     https://3.basecampapi.com/5909943/projects.json
```

You should see a JSON response with your Basecamp projects.

## Step 4: Configure Webhook (Next Step)

Once you have a valid access token, you can register webhooks for client projects.

See: [05-webhook-registration.md](./05-webhook-registration.md)

## Token Management

### Access Token Expiration

- Access tokens expire after a certain period (shown on success page)
- When expired, you'll need to use the refresh token to get a new access token
- Or re-run the OAuth flow to get a new token

### Refresh Token (Optional)

If you saved the refresh token, you can exchange it for a new access token:

```bash
curl -X POST https://launchpad.37signals.com/authorization/token \\
  -d type=refresh \\
  -d refresh_token=YOUR_REFRESH_TOKEN \\
  -d client_id=9193364e288b329638a2d1256d35e3279636b00b \\
  -d client_secret=7597b1373480183565b9db9d112498341f5a4f06
```

### Security Best Practices

1. **Never commit tokens to git:**
   - `.env.local` is in `.gitignore` ✅
   - Keep tokens out of code and documentation

2. **Store tokens securely:**
   - Use environment variables
   - In production, use Vercel's encrypted environment variables
   - Consider using a secrets manager for production

3. **Rotate tokens periodically:**
   - Especially if they may have been exposed
   - Use refresh tokens to get new access tokens

4. **Monitor token usage:**
   - Check Basecamp API logs for unauthorized access
   - Set up alerts for API errors

## Troubleshooting

### "Invalid redirect URI" error

**Problem:** Redirect URI doesn't match what's registered in Basecamp.

**Solution:**
- Verify redirect URI in Basecamp matches your environment variable
- Production: `https://designdream.is/api/auth/basecamp/callback`
- Local: `http://localhost:3002/api/auth/basecamp/callback`

### "Invalid client credentials" error

**Problem:** Client ID or Client Secret is incorrect.

**Solution:**
- Verify credentials in `.env.local` match Linear issue HOW-204
- Check for typos or extra spaces
- Ensure environment variables are loaded (restart dev server)

### "Authorization code expired" error

**Problem:** The authorization code from Basecamp has expired (valid for ~10 minutes).

**Solution:**
- Start the OAuth flow again from step 1
- Complete authorization more quickly

### Token doesn't work for API calls

**Problem:** API returns 401 Unauthorized.

**Solution:**
- Verify token is correctly set in `BASECAMP_ACCESS_TOKEN`
- Check token hasn't expired (check expiration date from success page)
- Ensure User-Agent header is set: `Design Dream (hello@designdream.is)`
- Try re-running OAuth flow to get a fresh token

### Can't access /api/auth/basecamp

**Problem:** 404 error when visiting OAuth endpoint.

**Solution:**
- Ensure files are created in correct locations:
  - `src/app/api/auth/basecamp/route.ts`
  - `src/app/api/auth/basecamp/callback/route.ts`
- Restart dev server: `npm run dev`
- Clear `.next` cache: `rm -rf .next && npm run dev`

## Next Steps

Once you have a working access token:

1. ✅ Register webhooks for client projects
2. ✅ Test webhook receiver with sample tasks
3. ✅ Verify Claude analysis comments appear in Basecamp
4. ✅ Set up production monitoring

See the [Basecamp Documentation Index](./README.md) for next steps.

## References

- **Basecamp OAuth 2 Docs:** https://github.com/basecamp/api/blob/master/sections/authentication.md
- **Launchpad Integrations:** https://launchpad.37signals.com/integrations
- **Basecamp API Docs:** https://github.com/basecamp/bc3-api
- **Linear Issue:** HOW-204
