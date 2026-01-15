# 🚀 AWS EC2 Setup Guide - Step by Step

Complete guide to create your EC2 instance and get the credentials needed for deployment.

---

## 📋 Prerequisites

- [ ] AWS Account (create one at https://aws.amazon.com if needed)
- [ ] Credit card (AWS free tier allows you to run t2.micro for 12 months free)

---

## 🟢 Step 1: Sign in to AWS Console

1. Go to: **https://console.aws.amazon.com**
2. Sign in with your AWS account
3. Select region: **US East (N. Virginia)** or your preferred region

---

## 🟢 Step 2: Create EC2 Instance

### 2.1 Launch Instance

1. In AWS Console, search for **"EC2"** in the search bar
2. Click **"EC2"** service
3. Click **"Launch Instance"** (orange button)

### 2.2 Configure Instance

**Name:**
- Name: `pharmacy-pos-backend` (or any name you prefer)

**Application and OS Images:**
- Select: **Ubuntu**
- Version: **Ubuntu Server 24.04 LTS** (free tier eligible)
- Architecture: **64-bit (x86)**

**Instance Type:**
- Select: **t2.micro** (free tier eligible)
- If t3.micro not available, choose **t3.micro** (very cheap ~$7/month)

**Key Pair (Login credentials):**
- Click **"Create new key pair"**
- **Key pair name:** `pharmacy-key`
- **Key pair type:** RSA
- **Private key file format:** `.pem`
- Click **"Create key pair"**
- ⚠️ **IMPORTANT:** The `.pem` file will download automatically!
- 📁 **Save it somewhere safe** (e.g., `~/Downloads/pharmacy-key.pem`)
- ⚠️ **You cannot download it again later!**

**Network Settings:**
- ✅ **Allow SSH traffic from:** Select **"My IP"** (your current IP)
- ✅ **Allow HTTP traffic from the internet** (port 80)
- ✅ **Allow HTTPS traffic from the internet** (port 443)
- Click **"Add security group rule"** and add:
  - **Type:** Custom TCP
  - **Port:** 3000
  - **Source:** 0.0.0.0/0 (Anywhere-IPv4)
  - **Description:** NestJS API

**Configure Storage:**
- **Volume size:** 8 GB (free tier includes 30 GB)
- **Volume type:** gp3 (default)

**Advanced Details:** (Optional)
- You can skip this for now

### 2.3 Launch

1. Click **"Launch Instance"** (orange button at bottom)
2. Wait for instance to be created (takes 1-2 minutes)
3. Click **"View all instances"**

---

## 🟢 Step 3: Get Your EC2 Details

### 3.1 Get Public IP Address

1. In EC2 Dashboard, find your instance (`pharmacy-pos-backend`)
2. Wait until **Instance State** shows **"Running"** (green)
3. Copy the **"IPv4 Public IP"** (e.g., `54.90.77.23`)
   - This is your **EC2_IP**
   - ⚠️ **Note:** This IP changes when you stop/start the instance
   - 💡 **Tip:** Use Elastic IP (see Step 5) to get a permanent IP

### 3.2 Verify Key File Location

1. Check your Downloads folder (or wherever you saved it)
2. File name: `pharmacy-key.pem`
3. Full path example: `~/Downloads/pharmacy-key.pem` or `/Users/app/Downloads/pharmacy-key.pem`

---

## 🟢 Step 4: Set Key File Permissions (IMPORTANT!)

**On Mac/Linux, run this command locally:**

```bash
chmod 400 ~/Downloads/pharmacy-key.pem
```

Or wherever your key file is located.

---

## 🟢 Step 5: (Optional) Create Elastic IP

Elastic IP gives you a permanent IP address that doesn't change.

1. In EC2 Dashboard, click **"Elastic IPs"** (left sidebar)
2. Click **"Allocate Elastic IP address"**
3. Click **"Allocate"**
4. Select the Elastic IP → Click **"Actions"** → **"Associate Elastic IP address"**
5. Select your instance → Click **"Associate"**
6. Your new IP is permanent (copy this one instead)

---

## ✅ Step 6: Verify You Have Everything

You should now have:

- [x] **EC2 Instance:** Running ✅
- [x] **Public IP:** `54.90.77.23` ✅
- [x] **Key File:** `pharmacy-key.pem` ✅ (found in project directory)
- [x] **Key File Path:** `./pharmacy-key.pem` ✅

---

## 🚀 Step 7: Test Connection (Optional)

Test if you can connect to EC2:

```bash
ssh -i ~/Downloads/pharmacy-key.pem ubuntu@YOUR_EC2_IP
```

Replace `YOUR_EC2_IP` with your actual IP.

If successful, you'll see:
```
Welcome to Ubuntu 22.04...
ubuntu@ip-xxx:~$
```

Type `exit` to disconnect.

---

## 🎯 Step 8: Run Deployment

Once you have:
- ✅ EC2 IP address
- ✅ Key file path

Run the automated deployment:

```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend

# Replace with your actual values:
./scripts/deploy-now.sh YOUR_EC2_IP ~/Downloads/pharmacy-key.pem
```

**Example with your IP:**
```bash
./scripts/deploy-now.sh 54.90.77.23 ~/Downloads/pharmacy-key.pem
```

**Or if key file is in project directory:**
```bash
./scripts/deploy-now.sh 54.90.77.23 ./pharmacy-key.pem
```

---

## 📝 Quick Reference

| Item | What You Need | Example (Your Setup) |
|------|---------------|----------------------|
| **EC2 IP** | IPv4 Public IP from EC2 console | `54.90.77.23` |
| **Key File** | `.pem` file you downloaded | `~/Downloads/pharmacy-key.pem` |
| **Username** | Always `ubuntu` for Ubuntu instances | `ubuntu` |

---

## ❓ Troubleshooting

### "Permission denied (publickey)"
- Make sure you set key file permissions: `chmod 400 ~/Downloads/pharmacy-key.pem`
- Verify key file path is correct

### "Connection timeout"
- Check security group allows SSH (port 22) from your IP
- Verify EC2 instance is "Running"
- Try accessing from a different network

### "t2.micro not available"
- Select t3.micro instead (very cheap)
- Or choose a different region

### "IP address changed"
- Use Elastic IP (Step 5) for permanent IP
- Or update GitHub secrets when IP changes

---

## 💰 Cost Estimate

**Free Tier (First 12 months):**
- ✅ t2.micro instance: **FREE** (750 hours/month)
- ✅ 30 GB storage: **FREE**
- ✅ Data transfer: 1 GB/month **FREE**

**After Free Tier:**
- t2.micro: ~$7-8/month
- t3.micro: ~$7-8/month
- Data transfer: First 1 GB free, then ~$0.09/GB

**Total estimated cost:** ~$7-10/month (very affordable!)

---

## 🎉 Next Steps

Once EC2 is set up:

1. ✅ Run deployment script with your IP and key file
2. ✅ Set up GitHub Secrets for auto-deployment
3. ✅ Configure `.env` file on EC2
4. ✅ Start using your deployed backend!

---

**You're all set! Once you have the EC2 IP and key file, come back and run the deployment script!** 🚀
