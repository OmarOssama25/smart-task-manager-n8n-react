# 🔒 Security Guide - API Key Management

## ⚠️ CRITICAL: Never Expose API Keys

API keys are like passwords to your accounts. Exposing them can lead to:
- Unauthorized usage and charges
- Data breaches
- Account suspension
- Financial loss

---

## ✅ Proper API Key Storage

### Where to Store API Keys

#### ❌ NEVER Store Keys Here:
- Frontend code (React, Vue, Angular)
- Git repositories (even private ones)
- Chat conversations
- Screenshots or documentation
- Client-side JavaScript
- Browser localStorage
- URL parameters

#### ✅ ALWAYS Store Keys Here:
- Backend servers (n8n, Node.js, etc.)
- Environment variables (`.env` files)
- Secret management services (AWS Secrets Manager, etc.)
- Credential managers in platforms (n8n Credentials)

---

## 🏗️ Secure Architecture for This Project

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (React App)                                    │
│  • No API keys stored                                    │
│  • Only has n8n webhook URL (public, safe)              │
│  • Runs in user's browser                                │
└─────────────────────────────────────────────────────────┘
                         ↓
                    (HTTPS POST)
                         ↓
┌─────────────────────────────────────────────────────────┐
│  n8n Workflow (Backend)                                  │
│  • OpenAI API key stored securely in Credentials        │
│  • Runs on server (not in browser)                      │
│  • Only accessible to you                                │
└─────────────────────────────────────────────────────────┘
                         ↓
                    (HTTPS POST with API key)
                         ↓
┌─────────────────────────────────────────────────────────┐
│  OpenAI API                                              │
│  • Receives request from n8n server                     │
│  • Validates API key                                     │
│  • Returns AI response                                   │
└─────────────────────────────────────────────────────────┘
```

**Key Point**: The frontend **never** has direct access to OpenAI API key!

---

## 🔧 Setup Instructions

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create account
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. **Copy the key** (you'll only see it once!)
6. **IMPORTANT**: Store it securely, don't share it

### Step 2: Configure in n8n

#### For n8n Cloud:

1. Open your n8n instance
2. Click **Credentials** in the left sidebar
3. Click **Add Credential** button
4. Search for and select **OpenAI API**
5. Enter your credentials:
   ```
   Name: OpenAI - Smart Task Manager
   API Key: [paste your key here]
   ```
6. Click **Save**

#### For Self-Hosted n8n:

Same process as above, or use environment variables:

```bash
# In your n8n .env file
OPENAI_API_KEY=your-api-key-here
```

### Step 3: Configure in n8n Workflow

1. Import the workflow: `n8n-workflow-ai-ranking.json`
2. Open the **OpenAI Analyze & Rank** node
3. In **Credentials**, select your saved OpenAI credential
4. Activate the workflow

### Step 4: Configure Frontend

Create `.env` file in `smart-task-manager/` folder:

```env
# n8n Webhook URL (safe to use in frontend)
VITE_N8N_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/task-sync

# AI Analysis Webhook URL
VITE_N8N_AI_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/ai-analyze

# NOTE: Do NOT put OpenAI API key here!
# It stays in n8n only.
```

### Step 5: Restart Development Server

```bash
npm run dev
```

---

## 🚨 What to Do If Key Is Exposed

### Immediate Steps:

#### 1. Revoke the Key

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Find the exposed key
3. Click **Revoke** or **Delete**
4. Confirm deletion

**Google Cloud:**
1. Go to https://console.cloud.google.com/
2. Navigate to APIs & Services → Credentials
3. Find and delete the key
4. Restrict or regenerate if needed

#### 2. Generate New Key

1. Create a new API key
2. Store it securely in n8n Credentials
3. Update your n8n workflow
4. Test to ensure it works

#### 3. Monitor Usage

Check for unauthorized usage:
- OpenAI: Check usage dashboard
- Look for unusual spikes in requests
- Review recent activity logs

#### 4. Enable Spending Limits

**OpenAI:**
1. Go to Settings → Limits
2. Set monthly spending limit
3. Enable email alerts

---

## 🛡️ Best Practices

### 1. Use Environment Variables

```bash
# .env file (add to .gitignore!)
VITE_N8N_WEBHOOK_URL=https://...
```

### 2. Add .env to .gitignore

```bash
# .gitignore
.env
.env.local
.env.production
*.env
```

### 3. Use .env.example for Documentation

```bash
# .env.example (safe to commit)
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-id
# Replace with your actual webhook URL
```

### 4. Never Commit Keys to Git

If you accidentally commit a key:

```bash
# Remove from history (use with caution!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Then force push
git push origin --force --all
```

**Better**: Just revoke the key and create a new one!

### 5. Use Secret Scanning

Enable GitHub secret scanning:
1. Repository Settings
2. Security & analysis
3. Enable "Secret scanning"

### 6. Implement Rate Limiting

In your n8n workflow, add rate limiting:
- Max requests per hour
- Timeout between requests
- Cost tracking

---

## 🧪 Testing Securely

### Test Without Real API Key

Use mock responses for development:

```javascript
// In development mode
if (import.meta.env.DEV) {
  // Return mock data instead of calling API
  return {
    analyzedTasks: [
      { id: '1', rank: 1, priority: 'High', reason: 'Mock data' }
    ]
  };
}
```

### Use Separate Keys for Dev/Prod

- **Development**: Use test API key with low limits
- **Production**: Use production API key with monitoring

---

## 📊 Cost Monitoring

### Set Up Alerts

**OpenAI:**
1. Platform → Settings → Limits
2. Set soft limit (e.g., $5)
3. Set hard limit (e.g., $10)
4. Enable email alerts

### Track Usage

Monitor your API usage regularly:
- Daily usage reports
- Cost per request
- Unusual patterns
- Set budget alerts

---

## ✅ Security Checklist

Before deploying:

- [ ] API keys stored in n8n Credentials only
- [ ] No API keys in frontend code
- [ ] `.env` file added to `.gitignore`
- [ ] `.env.example` provided for others
- [ ] Spending limits configured
- [ ] Email alerts enabled
- [ ] Rate limiting implemented
- [ ] HTTPS enabled (not HTTP)
- [ ] Webhook URLs use authentication (if needed)
- [ ] No sensitive data in Git history
- [ ] Keys rotated regularly
- [ ] Team members trained on security

---

## 🔗 Useful Resources

- [OpenAI API Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [n8n Security](https://docs.n8n.io/hosting/security/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

## 📞 Support

If you believe your API key was compromised:

**OpenAI Support:**
- Email: support@openai.com
- Help Center: https://help.openai.com/

**n8n Support:**
- Community: https://community.n8n.io/
- Documentation: https://docs.n8n.io/

---

## 📝 Summary

### ✅ DO:
- Store API keys in n8n Credentials
- Use environment variables for frontend config
- Add `.env` to `.gitignore`
- Set spending limits
- Monitor usage regularly
- Rotate keys periodically

### ❌ DON'T:
- Share API keys in chat/email
- Commit keys to Git
- Store keys in frontend code
- Use same key for dev/prod
- Ignore usage alerts
- Leave keys with unlimited spending

---

**Remember**: Security is not optional. Protect your API keys like passwords! 🔒

