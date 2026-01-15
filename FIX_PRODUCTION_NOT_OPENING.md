# 🔧 Fix: Production Link Not Opening

## ❌ Problem

The production URL is not opening:
- https://pharmacy-pos-backend-prod.eba-wdg27kyw.us-east-1.elasticbeanstalk.com/api/docs

---

## ✅ Solutions to Check

### Issue 1: Application Not Running

**Check AWS Elastic Beanstalk Status:**

1. **Go to AWS Console:** https://console.aws.amazon.com/elasticbeanstalk
2. **Select environment:** `pharmacy-pos-backend-prod`
3. **Check Health Status:**
   - ✅ **Green** = Healthy (app is running)
   - ⚠️ **Yellow** = Warning (check logs)
   - ❌ **Red** = Unhealthy (app crashed)

**If unhealthy, check:**
- **Events** tab - See recent errors
- **Logs** tab - View application logs

---

### Issue 2: Port Configuration

**Elastic Beanstalk uses port 8080, not 3000!**

**Check if PORT is set in AWS:**

1. **AWS Console** → **Elastic Beanstalk** → Your environment
2. **Configuration** → **Software** → **Environment properties**
3. **Look for:** `PORT=8080`

**If missing, add it:**
```bash
eb setenv PORT=8080
```

**Or via AWS Console:**
- Add environment variable: `PORT` = `8080`

---

### Issue 3: Environment Variables Missing

**Required environment variables must be set:**

1. **Go to AWS Console** → **Elastic Beanstalk** → Your environment
2. **Configuration** → **Software** → **Environment properties**
3. **Check these are set:**

```bash
NODE_ENV=production
PORT=8080
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
DB_HOST=your-database-host
DB_PORT=3306
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=pharmacy_pos
CORS_ORIGIN=*
```

**If any are missing, add them!**

---

### Issue 4: Database Connection Failed

**If database is not configured, app will crash on startup.**

**Check logs:**
```bash
eb logs pharmacy-pos-backend-prod
```

**Look for errors like:**
- "ECONNREFUSED" - Database not accessible
- "Access denied" - Wrong credentials
- "Unknown database" - Database doesn't exist

**Fix:**
1. Set up AWS RDS MySQL database
2. Update `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD` in environment variables
3. Redeploy

---

### Issue 5: Application Crashed on Startup

**Check application logs:**

**Via Terminal:**
```bash
export PATH=$PATH:/Users/app/Library/Python/3.9/bin
eb logs pharmacy-pos-backend-prod
```

**Via AWS Console:**
1. **Elastic Beanstalk** → Your environment
2. **Logs** → **Request Logs** or **Last 100 Lines**
3. **Download logs** and check for errors

**Common errors:**
- Missing dependencies
- Build failed
- Syntax errors
- Missing environment variables

---

### Issue 6: Security Group / Network Issues

**Check if port 8080 is open:**

1. **AWS Console** → **EC2** → **Security Groups**
2. Find security group for your Elastic Beanstalk environment
3. **Inbound rules** should allow:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 8080 (if needed)

**Elastic Beanstalk usually handles this automatically, but check if needed.**

---

## 🔍 Quick Diagnostic Steps

### Step 1: Check Environment Health

1. **AWS Console** → **Elastic Beanstalk**
2. **Select:** `pharmacy-pos-backend-prod`
3. **Check Health Status** (top right)
4. **Click "Health"** tab for details

### Step 2: View Recent Events

1. **Events** tab
2. **Look for errors** (red X marks)
3. **Click on error** to see details

### Step 3: Check Logs

1. **Logs** tab
2. **Request Logs** → **Last 100 Lines**
3. **Download** and check for:
   - Application startup errors
   - Database connection errors
   - Port binding errors

### Step 4: Verify Environment Variables

1. **Configuration** → **Software** → **Environment properties**
2. **Verify all required variables are set**
3. **Especially:** `PORT=8080`

### Step 5: Test Database Connection

If database is configured, test connection:
```bash
eb ssh pharmacy-pos-backend-prod
mysql -h $DB_HOST -u $DB_USERNAME -p$DB_PASSWORD $DB_DATABASE -e "SELECT 1;"
```

---

## 🛠️ Quick Fixes

### Fix 1: Set PORT Environment Variable

```bash
export PATH=$PATH:/Users/app/Library/Python/3.9/bin
eb setenv PORT=8080 --region us-east-1
```

### Fix 2: Restart Environment

```bash
eb restart pharmacy-pos-backend-prod
```

### Fix 3: Rebuild Environment

```bash
eb rebuild pharmacy-pos-backend-prod
```

**⚠️ Warning:** This will recreate the EC2 instance!

### Fix 4: Redeploy Application

```bash
npm run build
eb deploy pharmacy-pos-backend-prod
```

---

## 📋 Checklist

- [ ] Environment health is "Green" (not Red/Yellow)
- [ ] PORT environment variable is set to 8080
- [ ] All required environment variables are set
- [ ] Database is accessible (if using)
- [ ] Application logs show no errors
- [ ] Security groups allow HTTP/HTTPS traffic
- [ ] Application is listening on port 8080

---

## 🆘 Still Not Working?

### Get Detailed Logs

```bash
export PATH=$PATH:/Users/app/Library/Python/3.9/bin
eb logs pharmacy-pos-backend-prod --all
```

### SSH into Instance

```bash
eb ssh pharmacy-pos-backend-prod
# Then check:
ps aux | grep node
netstat -tulpn | grep 8080
cat /var/log/eb-engine.log
```

### Check Application Status

```bash
eb status pharmacy-pos-backend-prod
```

---

## ✅ Expected Behavior

**When working correctly:**
- Health status: **Green**
- URL opens: https://pharmacy-pos-backend-prod.eba-wdg27kyw.us-east-1.elasticbeanstalk.com/api/docs
- Swagger UI loads
- API endpoints respond

**If you see:**
- "502 Bad Gateway" → App crashed or not running
- "503 Service Unavailable" → App starting or health check failing
- "Connection timeout" → Network/security group issue
- "404 Not Found" → Route not found (check URL path)

---

**Most common issue: Missing PORT=8080 environment variable!** 🔑
