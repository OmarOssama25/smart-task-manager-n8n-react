# 🚀 Quick Setup Guide

This guide will help you get the Smart Task Manager up and running in minutes.

## ⚡ Fast Track Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd smart-task-manager
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 3: Test the App Locally (Without n8n)

You can use the app immediately without n8n! Tasks will be saved to localStorage.

To test the sync functionality without setting up n8n:

1. Go to [webhook.site](https://webhook.site)
2. Copy your unique webhook URL
3. Create a `.env` file:
   ```bash
   VITE_N8N_WEBHOOK_URL=https://webhook.site/your-unique-id
   ```
4. Restart the dev server
5. Click "Sync with n8n" and check webhook.site to see the request

---

## 🔧 Full Setup with n8n (15 minutes)

### Option 1: n8n Cloud (Easiest)

1. **Sign up for n8n Cloud**
   - Go to [n8n.cloud](https://n8n.cloud)
   - Create a free account
   - You get 5,000 workflow executions/month free

2. **Create a Workflow**
   - Click "New Workflow"
   - Add a "Webhook" node (trigger)
   - Configure:
     - HTTP Method: POST
     - Path: `smart-task-sync`
     - Respond: "Using 'Respond to Webhook' node"
   
3. **Add Response Node**
   - Add "Respond to Webhook" node
   - Connect it to the Webhook trigger
   - Set Response Body:
   ```json
   {
     "message": "Tasks synced successfully",
     "updatedTasks": {{ $json.tasks.map(t => ({...t, status: 'Synced'})) }},
     "lastSync": "{{ $now }}"
   }
   ```

4. **Activate and Copy URL**
   - Click "Active" toggle in top-right
   - Copy the webhook URL (shows in webhook node)

5. **Update Frontend**
   - Create `.env` file in project root:
   ```
   VITE_N8N_WEBHOOK_URL=your-copied-webhook-url
   ```
   - Restart dev server: `npm run dev`

### Option 2: Self-Hosted n8n (Advanced)

1. **Install n8n with Docker**
   ```bash
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n
   ```

2. **Access n8n**
   - Open `http://localhost:5678`
   - Create account

3. **Create Workflow**
   - Follow steps 2-5 from Option 1
   - Your webhook URL will be: `http://localhost:5678/webhook/smart-task-sync`

4. **Note**: If deploying frontend to cloud (Netlify/Vercel), your local n8n won't be accessible. Use ngrok:
   ```bash
   ngrok http 5678
   ```
   Use the ngrok URL in your `.env`

---

## 📊 Adding Google Sheets Integration

### Prerequisites
- Google account
- n8n workflow from above

### Steps

1. **Create Google Sheet**
   - New spreadsheet named "Smart Tasks"
   - Add headers: `ID | Title | Description | Due Date | Status | Priority | Synced At`

2. **Connect Google Sheets in n8n**
   - Click "Credentials" in n8n
   - Add "Google Sheets API"
   - Follow OAuth flow to authorize

3. **Update Workflow**
   - Add "Google Sheets" node after Webhook trigger
   - Select your spreadsheet
   - Operation: "Append"
   - Map fields:
     ```
     ID: {{ $json.id }}
     Title: {{ $json.title }}
     Description: {{ $json.description }}
     Due Date: {{ $json.dueDate }}
     Status: Synced
     Priority: {{ $json.priority }}
     Synced At: {{ $now }}
     ```

4. **Add Loop Node**
   - Add "Split In Batches" before Google Sheets
   - This processes each task individually

5. **Test It**
   - Add tasks in frontend
   - Click "Sync with n8n"
   - Check your Google Sheet - tasks should appear!

---

## 📧 Adding Email Reminders

### Prerequisites
- Gmail account (or other email provider)
- n8n workflow with Google Sheets

### Steps

1. **Add Gmail Credentials in n8n**
   - Go to Credentials → Add Credential
   - Select "Gmail OAuth2"
   - Follow authorization flow

2. **Add IF Node**
   - After Google Sheets node
   - Condition: Check if task due date is today
   ```
   {{ new Date($json.dueDate).toDateString() === new Date().toDateString() }}
   ```

3. **Add Gmail Node** (TRUE branch)
   - Operation: Send Email
   - To: your-email@gmail.com
   - Subject: `🔔 Task Reminder: {{ $json.title }}`
   - Body: Use HTML template from `N8N_WORKFLOW_EXAMPLES.md`

4. **Test It**
   - Create a task with today's due date
   - Sync with n8n
   - Check your email!

---

## 🤖 Adding AI Priority Analysis

### Prerequisites
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- n8n workflow

### Steps

1. **Get OpenAI API Key**
   - Create account at OpenAI
   - Go to API keys section
   - Create new secret key
   - **Important**: Add credits to your account ($5 minimum)

2. **Add OpenAI Credentials in n8n**
   - Credentials → Add Credential
   - Select "OpenAI"
   - Paste your API key

3. **Create Separate Workflow** (or branch existing one)
   - New Webhook: `smart-task-ai-analyze`
   - Add OpenAI node
   - See detailed configuration in `N8N_WORKFLOW_EXAMPLES.md`

4. **Update Frontend .env**
   ```
   VITE_N8N_WEBHOOK_URL=https://your-instance.com/webhook/smart-task-sync
   VITE_N8N_AI_WEBHOOK_URL=https://your-instance.com/webhook/smart-task-ai-analyze
   ```

5. **Test AI Analysis**
   - Add tasks with urgent keywords: "urgent", "critical", "important"
   - Click "AI Analyze" button
   - Watch priorities update based on AI recommendations!

---

## 🌐 Deploying to Production

### Deploy to Netlify

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Add Environment Variables**
   - Site settings → Environment variables
   - Add: `VITE_N8N_WEBHOOK_URL`
   - Redeploy site

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow prompts, then add environment variables in Vercel dashboard.

---

## 🎬 Recording Your Demo Video

### Checklist (5 minutes or less)

1. **Introduction** (30 sec)
   - "Hi, I'm [name], this is my Smart Task Manager with n8n Integration"
   - Quick overview of the app

2. **Frontend Demo** (2 min)
   - Add 2-3 tasks with different priorities
   - Show task cards with badges
   - Mark a task complete
   - Delete a task
   - Show statistics

3. **n8n Integration** (2 min)
   - Show n8n workflow (quick tour of nodes)
   - Click "Sync with n8n" button
   - Show loading state
   - Show success toast
   - Show updated task statuses
   - Switch to n8n → show execution history
   - (If you added) Show Google Sheets with synced tasks

4. **Bonus Features** (30 sec - optional)
   - Show AI analyze button
   - Demonstrate priority changes
   - Show email reminder (if configured)

5. **Technical Highlights** (30 sec)
   - Mention React + Vite
   - localStorage persistence (refresh page, tasks remain)
   - Tailwind CSS for styling
   - Framer Motion animations
   - RESTful API integration with n8n

### Recording Tools

- **Free Options**:
  - OBS Studio (desktop)
  - Loom (browser + desktop)
  - ShareX (Windows)
  - QuickTime (Mac)

- **Tips**:
  - Use 1080p resolution
  - Close unnecessary tabs/apps
  - Prepare your demo data beforehand
  - Do a practice run
  - No need for fancy editing

---

## 🐛 Common Issues

### Issue: "Cannot find module 'react'"

**Solution:**
```bash
npm install react react-dom
```

### Issue: Tailwind styles not working

**Solution:**
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer
# Make sure tailwind.config.js and postcss.config.js exist
```

### Issue: n8n webhook not responding

**Solution:**
- Check n8n workflow is **Active** (toggle in top-right)
- Verify webhook URL is correct
- Check n8n execution history for errors
- Test webhook with curl or Postman first

### Issue: CORS errors with n8n

**Solution:**
- n8n automatically handles CORS for webhooks
- If using self-hosted n8n behind proxy, configure CORS headers
- For local testing, use `http://localhost:5678` not `127.0.0.1`

### Issue: Tasks not persisting

**Solution:**
- Check browser localStorage (DevTools → Application → Local Storage)
- Ensure localStorage is enabled (not in private/incognito mode)
- Clear cache if seeing old data

---

## 📚 Next Steps

1. ✅ Complete basic setup
2. ✅ Test app locally
3. ✅ Set up n8n workflow
4. ✅ Add Google Sheets integration
5. ✅ Add email reminders
6. ✅ (Optional) Add AI analysis
7. ✅ Deploy to Netlify/Vercel
8. ✅ Record demo video
9. ✅ Submit assessment

---

## 💡 Pro Tips

1. **Start Simple**: Get basic sync working first, then add features
2. **Test Incrementally**: Test each n8n node individually
3. **Use Webhook.site**: Great for testing without setting up full n8n
4. **Save Workflows**: Export n8n workflows regularly as backup
5. **Environment Variables**: Never commit `.env` to Git
6. **Error Handling**: Check both frontend console and n8n execution logs

---

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- See `N8N_WORKFLOW_EXAMPLES.md` for workflow templates
- n8n Community: [community.n8n.io](https://community.n8n.io)
- React Docs: [react.dev](https://react.dev)

---

**You're all set! Happy building! 🚀**

