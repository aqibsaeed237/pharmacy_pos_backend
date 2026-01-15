# 🔌 Integration Guide - Complete Setup

## Table of Contents
1. [Firebase Complete Setup](#firebase-complete-setup)
2. [Google OAuth Complete Setup](#google-oauth-complete-setup)
3. [Stripe Payment Setup](#stripe-payment-setup)
4. [PayFast Payment Setup](#payfast-payment-setup)
5. [Push Notifications Setup](#push-notifications-setup)
6. [Email Service Setup](#email-service-setup)
7. [SMS Service Setup](#sms-service-setup)

---

## Firebase Complete Setup

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add Project"**
3. Enter project name: `pharmacy-pos-backend`
4. Enable/Disable Google Analytics (optional)
5. Click **"Create Project"**

### Step 2: Get Service Account Credentials

1. Go to **Project Settings** (gear icon)
2. Click **"Service Accounts"** tab
3. Click **"Generate New Private Key"**
4. Download JSON file
5. Extract values:

```json
{
  "project_id": "your-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
}
```

### Step 3: Enable Cloud Messaging (FCM)

1. Go to **Project Settings** > **Cloud Messaging**
2. Copy **Server Key** (if not visible, enable Cloud Messaging API)
3. Copy **Sender ID**

### Step 4: Enable Required APIs

1. Go to **APIs & Services** > **Library**
2. Enable:
   - **Cloud Messaging API**
   - **Firebase Cloud Messaging API**

### Step 5: Configure Environment

Add to `.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FCM_SERVER_KEY=your-fcm-server-key
FCM_SENDER_ID=your-fcm-sender-id
```

**Important:** 
- Keep the `\n` characters in `FIREBASE_PRIVATE_KEY`
- Wrap the entire private key in quotes

### Step 6: Install Dependencies

```bash
npm install firebase-admin
```

### Step 7: Create Firebase Module

Create `src/modules/notifications/notifications.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from './services/firebase.service';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class NotificationsModule {}
```

### Step 8: Push Notification Topics

Topics are automatically created based on:
- **Format**: `tenant-{tenantId}-store-{storeId}-{eventType}`
- **Event Types**:
  - `low-stock` - When product stock is low
  - `expiry-alert` - When product is near expiry
  - `new-order` - When new order is placed
  - `payment-received` - When payment is received
  - `sale-completed` - When sale is completed

**Example Topics:**
- `tenant-abc123-store-xyz789-low-stock`
- `tenant-abc123-store-xyz789-expiry-alert`
- `tenant-abc123-store-xyz789-new-order`

---

## Google OAuth Complete Setup

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click **"New Project"**
3. Enter name: `Pharmacy POS OAuth`
4. Click **"Create"**

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** (for testing) or **Internal** (for Google Workspace)
3. Fill in:
   - **App name**: Pharmacy POS
   - **User support email**: your-email@example.com
   - **Developer contact**: your-email@example.com
4. Click **"Save and Continue"**
5. Add scopes:
   - `email`
   - `profile`
   - `openid`
6. Click **"Save and Continue"**
7. Add test users (for testing)
8. Click **"Save and Continue"**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. Choose **"Web application"**
4. Name: `Pharmacy POS Web Client`
5. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/v1/auth/google/callback
   https://yourdomain.com/api/v1/auth/google/callback
   ```
6. Click **"Create"**
7. Copy **Client ID** and **Client Secret**

### Step 4: Enable Google+ API

1. Go to **APIs & Services** > **Library**
2. Search for **"Google+ API"**
3. Click **"Enable"**

### Step 5: Configure Environment

Add to `.env`:

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback
```

### Step 6: Install Dependencies

```bash
npm install @nestjs/passport passport passport-google-oauth20
npm install --save-dev @types/passport-google-oauth20
```

### Step 7: Create Google Strategy

See `COMPLETE_SETUP_GUIDE.md` for implementation.

---

## Stripe Payment Setup

### Step 1: Create Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Sign up with email
3. Verify email address
4. Complete business information

### Step 2: Get API Keys

1. Go to **Developers** > **API Keys**
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`)
4. Click **"Reveal test key"** for secret key

### Step 3: Setup Webhooks

1. Go to **Developers** > **Webhooks**
2. Click **"Add endpoint"**
3. Enter endpoint URL: `https://yourdomain.com/api/v1/payments/stripe/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **"Add endpoint"**
6. Copy **Signing secret** (starts with `whsec_`)

### Step 4: Configure Environment

Add to `.env`:

```env
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
STRIPE_WEBHOOK_SECRET=whsec_abcdefghijklmnopqrstuvwxyz1234567890
```

### Step 5: Install Dependencies

```bash
npm install stripe
```

### Step 6: Test Mode vs Production

- **Test Mode**: Use `sk_test_` and `pk_test_` keys
- **Production Mode**: Use `sk_live_` and `pk_live_` keys

Switch in `.env` when ready for production.

---

## PayFast Payment Setup

### Step 1: Create PayFast Account

1. Go to https://www.payfast.co.za/
2. Click **"Register"**
3. Complete registration
4. Verify email

### Step 2: Get Merchant Credentials

1. Login to PayFast Dashboard
2. Go to **Settings** > **My Account**
3. Copy:
   - **Merchant ID**
   - **Merchant Key**
4. Set **Passphrase** (if enabled)

### Step 3: Configure Environment

Add to `.env`:

```env
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_MODE=sandbox
PAYFAST_RETURN_URL=https://yourdomain.com/api/v1/payments/payfast/return
PAYFAST_CANCEL_URL=https://yourdomain.com/api/v1/payments/payfast/cancel
PAYFAST_NOTIFY_URL=https://yourdomain.com/api/v1/payments/payfast/notify
```

### Step 4: Sandbox vs Production

- **Sandbox**: Use test credentials, `PAYFAST_MODE=sandbox`
- **Production**: Use live credentials, `PAYFAST_MODE=production`

---

## Push Notifications Setup

### Step 1: Client-Side Setup (Mobile/Web)

#### For React Native (Expo)

```bash
expo install expo-notifications
```

#### For React Native (Bare)

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

#### For Web (Firebase SDK)

```bash
npm install firebase
```

### Step 2: Get FCM Token

Client needs to:
1. Request notification permission
2. Get FCM token
3. Send token to backend: `POST /api/v1/notifications/register-token`

### Step 3: Subscribe to Topics

When user logs in, subscribe to topics:
- `tenant-{tenantId}-store-{storeId}-low-stock`
- `tenant-{tenantId}-store-{storeId}-expiry-alert`
- `tenant-{tenantId}-store-{storeId}-new-order`

### Step 4: Backend Implementation

See Firebase Service in `COMPLETE_SETUP_GUIDE.md`

---

## Email Service Setup

### Option 1: Gmail SMTP

1. Enable **2-Factor Authentication** on Gmail
2. Generate **App Password**:
   - Go to Google Account > Security
   - Click **2-Step Verification**
   - Click **App passwords**
   - Generate password for "Mail"

### Option 2: SendGrid

1. Sign up at https://sendgrid.com/
2. Verify sender email
3. Create API key
4. Configure:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

### Option 3: AWS SES

1. Go to AWS SES Console
2. Verify email/domain
3. Create SMTP credentials
4. Configure:

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
```

### Install Email Package

```bash
npm install @nestjs-modules/mailer nodemailer
npm install --save-dev @types/nodemailer
```

---

## SMS Service Setup

### Option 1: Twilio

1. Sign up at https://www.twilio.com/
2. Get Account SID and Auth Token
3. Get phone number
4. Configure:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Option 2: AWS SNS

1. Go to AWS SNS Console
2. Create topic
3. Configure:

```env
AWS_SNS_REGION=us-east-1
AWS_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:pharmacy-notifications
```

### Install Twilio Package

```bash
npm install twilio
```

---

## Testing Integrations

### Test Firebase

```bash
# Send test notification
curl -X POST http://localhost:3000/api/v1/notifications/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token": "FCM_TOKEN", "title": "Test", "body": "Test message"}'
```

### Test Google OAuth

1. Visit: `http://localhost:3000/api/v1/auth/google`
2. Should redirect to Google login
3. After login, redirects back with user info

### Test Stripe

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Test PayFast

Use PayFast sandbox:
- Test card: `5200 0000 0000 0007`
- CVV: Any 3 digits
- Expiry: Any future date

---

## Production Checklist

- [ ] Change all test keys to production keys
- [ ] Update redirect URIs to production domains
- [ ] Enable production mode in payment gateways
- [ ] Setup SSL certificates
- [ ] Configure production database
- [ ] Enable error tracking (Sentry)
- [ ] Setup monitoring (New Relic)
- [ ] Configure backup strategy
- [ ] Setup CI/CD pipeline
- [ ] Review security settings
- [ ] Enable rate limiting
- [ ] Configure CORS for production domains
- [ ] Setup log aggregation
- [ ] Configure alerts

---

## Security Best Practices

1. **Never commit `.env` file**
2. **Use strong secrets** (32+ characters)
3. **Rotate keys regularly**
4. **Use HTTPS in production**
5. **Enable 2FA on all service accounts**
6. **Limit API key permissions**
7. **Monitor API usage**
8. **Use webhook signatures**
9. **Validate all webhook payloads**
10. **Log all payment transactions**

---

**All integrations are now configured! 🎉**
