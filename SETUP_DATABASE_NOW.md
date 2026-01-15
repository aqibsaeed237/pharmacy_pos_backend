# 🗄️ Setup Database on Railway - DO THIS NOW

## Quick Setup (Copy & Paste)

Run this command to connect to MySQL:

```bash
railway connect mysql
```

Then in the MySQL prompt, copy and paste this:

```sql
CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pharmacy_pos;
SOURCE src/database/sql/schema.sql;
```

Press Enter after pasting. The schema will be imported.

## Alternative: One-liner

If you have the schema file ready, you can also do:

```bash
railway connect mysql -e "CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; USE pharmacy_pos; SOURCE src/database/sql/schema.sql;"
```

## Verify

After setup, check your app logs:

```bash
railway logs
```

You should see the database connection succeed instead of retry errors.

## Your App URL

Get your app URL:
```bash
railway domain
```

Then test:
- Health: `https://your-url/api/v1/health`
- Swagger: `https://your-url/api/docs`

---

**Note:** The database connection uses Railway's internal network (`mysql.railway.internal`), so the app should connect automatically once the schema is set up.
