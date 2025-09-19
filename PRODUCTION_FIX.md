# Production Authentication Fix

## Problem Identified

The admin authentication was failing in production due to several critical issues:

### 1. **Security Vulnerability**

- Using `NEXT_PUBLIC_JWT_SECRET` exposed the JWT secret to client-side code
- Anyone could inspect the frontend and see the JWT secret
- This is a major security risk

### 2. **Production Environment Issues**

- Client-side environment variables behave differently in Vercel
- The JWT secret wasn't properly accessible server-side in production

### 3. **Cookie Configuration Issues**

- Missing proper `maxAge` configuration for auth cookies
- Inadequate error handling for invalid tokens

## Solutions Implemented

### 1. **Fixed JWT Secret Configuration**

- Changed from `NEXT_PUBLIC_JWT_SECRET` to `JWT_SECRET` (server-side only)
- Updated `src/lib/auth.ts` to use server-side environment variable
- This ensures the secret is never exposed to clients

### 2. **Improved Cookie Management**

- Added proper `maxAge` to auth cookies (10 days)
- Enhanced cookie clearing mechanism for invalid tokens

### 3. **Enhanced Middleware**

- Made middleware async to properly handle JWT verification
- Added better error handling and token cleanup
- Extended protection to categories API as well
- Clear invalid cookies when authentication fails

### 4. **Updated Environment Configuration**

- Fixed local `.env` file to use `JWT_SECRET` instead of `NEXT_PUBLIC_JWT_SECRET`
- Created deployment setup script with instructions

## Deployment Instructions for Vercel

### Step 1: Update Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. **REMOVE** any existing `NEXT_PUBLIC_JWT_SECRET` variable
4. **ADD** these environment variables:
   ```
   JWT_SECRET=your_super_secure_random_string_here
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   ```

### Step 2: Generate a Secure JWT Secret

Use a strong, random string for `JWT_SECRET`. You can generate one using:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Redeploy

After updating environment variables, trigger a new deployment in Vercel.

## Security Improvements Made

1. **Server-side JWT Secret**: JWT secret is now only accessible server-side
2. **Enhanced Token Validation**: Better error handling for malformed or expired tokens
3. **Secure Cookie Configuration**: Proper cookie settings for production
4. **API Protection**: Extended middleware protection to all admin APIs

## Testing

After deployment, test the following flow:

1. Access `/admin` - should redirect to login
2. Login with admin credentials
3. After successful login, clicking "Manage Products" or "Manage Categories" should work
4. Verify that the session persists across page refreshes

## Why This Fixes the Production Issue

The main issue was that in production, the JWT secret was:

1. Exposed to the client (security risk)
2. Not properly accessible to server-side middleware
3. Causing token verification to fail silently

By moving to a server-side only JWT secret and improving error handling, the authentication flow now works correctly in production environments like Vercel.
