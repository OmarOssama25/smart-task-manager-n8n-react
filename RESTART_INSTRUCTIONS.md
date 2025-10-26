# 🔄 How to Restart the Dev Server

## Why You Need to Restart

When you create or modify the `.env` file, **Vite must be restarted** to load the new environment variables.

Currently, your app is using the fallback URL instead of your actual n8n webhook because the server started before the `.env` file existed.

---

## 🚀 Quick Restart Steps

### Step 1: Stop the Current Server

In your terminal where the server is running:
- Press **`Ctrl + C`** to stop the server

### Step 2: Restart the Server

```bash
cd "C:\Users\HP\Desktop\LyRise AI Internship Assessment\smart-task-manager"
npm run dev
```

### Step 3: Open the New URL

The server is now on port **5174** (because 5173 was in use):
```
http://localhost:5174
```

---

## ✅ How to Verify It's Working

After restarting, open the browser console (F12) and check:

### Before Fix (OLD):
```
POST https://webhook.site/your-unique-url
❌ Using fallback URL
```

### After Fix (NEW):
```
POST https://omarossama.app.n8n.cloud/webhook-test/e20c92ab-a227-4cee-9558-e82ebcb3d7af
✅ Using your actual webhook!
```

---

## 🐛 What Was Wrong

1. **Environment Not Loaded**: Server started before `.env` existed
2. **Using Fallback URL**: `https://webhook.site/your-unique-url`
3. **CORS Error**: webhook.site doesn't allow CORS, but n8n does!

## ✅ What's Fixed

1. ✅ `.env` file created with correct webhook URL
2. ✅ React ref warning fixed in TaskCard
3. ✅ Ready to restart and use real n8n webhook

---

## 🧪 Quick Test After Restart

1. Open http://localhost:5174
2. Add a task
3. Open browser console (F12)
4. Click "Sync with n8n"
5. Check the Network tab - should POST to your n8n URL
6. If n8n workflow is set up, you'll see success!

---

## 📝 Note About Port Change

Your server switched from port **5173** to **5174** because port 5173 was already in use (probably from a previous instance).

**Always use the port shown in the terminal:**
```
➜  Local:   http://localhost:5174/
```

---

## 🔧 If You Still See Errors

### CORS Error with n8n URL:
This means n8n received the request but your workflow needs to respond.

**Solution**: Set up the n8n workflow first!
1. Go to https://omarossama.app.n8n.cloud
2. Create workflow with: Webhook → Code → Respond to Webhook
3. See `WEBHOOK_CONFIG.md` for exact setup

### "Failed to fetch" Error:
**Check:**
- [ ] n8n workflow exists
- [ ] Workflow is **Active** (green toggle)
- [ ] Webhook path matches exactly
- [ ] You have internet connection

---

## 🎯 Quick Summary

**Problem**: `.env` not loaded → using wrong URL → CORS error
**Solution**: Restart server → loads `.env` → uses correct URL → works! ✅

**Just press Ctrl+C and run `npm run dev` again!**

