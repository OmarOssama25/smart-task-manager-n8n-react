# 🔧 Webhook Configuration

## Your n8n Webhook URL

Your n8n webhook URL is:
```
https://omarossama.app.n8n.cloud/webhook/e20c92ab-a227-4cee-9558-e82ebcb3d7af
```

---

## 🚀 Quick Setup Steps

### Step 1: Create `.env` File

In the `smart-task-manager` folder, create a file named `.env` with this content:

```env
# Smart Task Manager - Environment Configuration

# Main webhook for task syncing
VITE_N8N_WEBHOOK_URL=https://omarossama.app.n8n.cloud/webhook/e20c92ab-a227-4cee-9558-e82ebcb3d7af

# AI Analysis and Ranking webhook (using same URL for now)
VITE_N8N_AI_WEBHOOK_URL=https://omarossama.app.n8n.cloud/webhook/e20c92ab-a227-4cee-9558-e82ebcb3d7af
```

### Step 2: Restart Development Server

Stop the current server (Ctrl+C) and restart:

```bash
npm run dev
```

---

## 🧪 Testing Your Webhook

### Test 1: Basic Connectivity

Open a new terminal and run:

```bash
curl -X POST https://omarossama.app.n8n.cloud/webhook/e20c92ab-a227-4cee-9558-e82ebcb3d7af \
  -H "Content-Type: application/json" \
  -d '{"test": "hello from smart task manager"}'
```

**Expected**: Your n8n workflow should show an execution.

### Test 2: Task Sync Format

```bash
curl -X POST https://omarossama.app.n8n.cloud/webhook/e20c92ab-a227-4cee-9558-e82ebcb3d7af \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      {
        "id": "1",
        "title": "Test Task",
        "description": "Testing webhook integration",
        "dueDate": "2025-10-27",
        "status": "Pending",
        "priority": "Medium"
      }
    ],
    "syncTimestamp": "2025-10-26T12:30:00.000Z",
    "totalTasks": 1
  }'
```

---

## 📋 n8n Workflow Setup

### Option 1: Import Pre-built Workflow

1. In n8n, click **Workflows** → **Import from File**
2. Choose one of these files:
   - `n8n-workflow-basic.json` - Basic sync
   - `n8n-workflow-ai-ranking.json` - AI ranking (requires OpenAI)
3. Update the webhook path to match: `webhook/e20c92ab-a227-4cee-9558-e82ebcb3d7af`
4. Activate the workflow

### Option 2: Create Workflow Manually

#### Basic Sync Workflow

**Node 1: Webhook Trigger**
- HTTP Method: POST
- Path: `webhook/e20c92ab-a227-4cee-9558-e82ebcb3d7af`
- Response Mode: "Using 'Respond to Webhook' node"

**Node 2: Code Node**
```javascript
// Extract task data
const tasks = $input.item.json.tasks || [];

// Mark all as synced
const updatedTasks = tasks.map(task => ({
  id: task.id,
  title: task.title,
  status: 'Synced',
  priority: task.priority
}));

return [{
  json: {
    message: `Successfully synced ${tasks.length} task(s)`,
    updatedTasks: updatedTasks,
    lastSync: new Date().toISOString()
  }
}];
```

**Node 3: Respond to Webhook**
- Response Body: `{{ $json }}`
- Status Code: 200

Connect: Webhook → Code → Respond

#### AI Ranking Workflow (Advanced)

Follow the detailed guide in `AI_RANKING_GUIDE.md` and use the workflow in `n8n-workflow-ai-ranking.json`.

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `.env` file created with webhook URL
- [ ] Dev server restarted (`npm run dev`)
- [ ] App opens at http://localhost:5173
- [ ] n8n workflow is **Active** (green toggle)
- [ ] Webhook URL matches in both app and n8n

### Test in App:

1. Add a task in the app
2. Click **"Sync with n8n"** button
3. Check:
   - Loading spinner appears
   - Success toast shows
   - Tasks show "Synced" status
4. In n8n, check **Executions** tab for successful run

---

## 🎯 Expected Responses

### Sync Success Response:

```json
{
  "message": "Successfully synced 3 task(s)",
  "updatedTasks": [
    {
      "id": "1234567890",
      "title": "Complete project",
      "status": "Synced",
      "priority": "High"
    }
  ],
  "lastSync": "2025-10-26T12:35:00.000Z"
}
```

### AI Ranking Response:

```json
{
  "message": "AI analysis complete! 5 tasks ranked and prioritized.",
  "analyzedTasks": [
    {
      "id": "1",
      "title": "Fix production bug",
      "suggestedPriority": "High",
      "rank": 1,
      "urgencyScore": 95,
      "reason": "Critical production issue"
    }
  ],
  "topTask": {
    "title": "Fix production bug",
    "reason": "Highest urgency and impact"
  }
}
```

---

## 🐛 Troubleshooting

### Issue: "Unable to connect to n8n"

**Solutions:**
1. Check n8n workflow is **Active** (toggle in top-right)
2. Verify webhook URL is correct in `.env`
3. Restart dev server: `npm run dev`
4. Check n8n execution history for errors
5. Try test with curl command first

### Issue: "CORS Error"

n8n automatically handles CORS, but if you see CORS errors:
1. In n8n workflow, add to "Respond to Webhook" node:
   - Response Headers:
     - `Access-Control-Allow-Origin: *`
     - `Access-Control-Allow-Methods: POST, OPTIONS`

### Issue: No response from webhook

**Check:**
1. n8n workflow has "Respond to Webhook" node
2. All nodes are connected
3. No errors in n8n execution logs
4. Webhook path matches exactly

### Issue: Tasks not updating

**Check:**
1. Response format matches expected structure
2. `updatedTasks` array exists in response
3. Task IDs match between request and response
4. Status field is spelled correctly: "Synced" (capital S)

---

## 📊 Monitoring

### Check n8n Executions

1. Go to n8n dashboard
2. Click **Executions** in sidebar
3. View recent webhook calls:
   - ✅ Green = Success
   - ⚠️ Yellow = Warning
   - ❌ Red = Error
4. Click on execution to see details

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for:
   - Request sent to n8n
   - Response received
   - Any error messages

### Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "Sync with n8n"
4. Look for POST request to your webhook URL
5. Check:
   - Status: 200 OK
   - Response contains expected JSON

---

## 🎬 Demo Preparation

Before recording your demo:

1. **Test the workflow** multiple times
2. **Add sample tasks** with varied priorities
3. **Prepare talking points**:
   - "This is my n8n webhook URL"
   - "When I click sync, it sends tasks to n8n"
   - "n8n processes them and returns updated status"
   - "The UI updates automatically"
4. **Show n8n dashboard** during demo
5. **Highlight the execution** in n8n

---

## 🚀 Next Steps

### 1. Basic Sync (Start Here)
- [x] Webhook URL configured
- [ ] Create basic sync workflow in n8n
- [ ] Test sync button in app
- [ ] Verify in n8n executions

### 2. Advanced Features (Optional)
- [ ] Add Google Sheets integration
- [ ] Set up email reminders
- [ ] Configure OpenAI for AI ranking
- [ ] Test AI Rank button

### 3. Deploy
- [ ] Deploy frontend to Netlify/Vercel
- [ ] Update webhook URL to deployed app URL
- [ ] Test production deployment
- [ ] Record demo video

---

## 📞 Support

If you need help:
- Check `README.md` for detailed documentation
- See `SETUP_GUIDE.md` for step-by-step instructions
- Review `AI_RANKING_GUIDE.md` for AI feature details
- Visit n8n community: https://community.n8n.io

---

**Your webhook is ready to use! Create the `.env` file and start syncing! 🚀**

