# 🚀 Quick Reference Card

## Common Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### First Time Setup
```bash
# Clone and setup
git clone <repo-url>
cd smart-task-manager
npm install

# Create environment file
cp env.example .env
# Edit .env with your webhook URL

# Start development
npm run dev
```

---

## File Locations

### Core Files
- **Main App**: `src/App.jsx`
- **Styles**: `src/index.css`
- **Config**: `vite.config.js`, `tailwind.config.js`
- **Environment**: `.env` (create from `env.example`)

### Components
- **Navbar**: `src/components/Navbar.jsx`
- **Task Form**: `src/components/TaskForm.jsx`
- **Task List**: `src/components/TaskList.jsx`
- **Task Card**: `src/components/TaskCard.jsx`
- **Toast**: `src/components/Toast.jsx`

### Hooks
- **localStorage**: `src/hooks/useLocalStorage.js`

---

## Environment Variables

```env
# Required for n8n sync
VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/your-id

# Optional for AI features
VITE_N8N_AI_WEBHOOK_URL=https://your-n8n.com/webhook/ai-id
```

---

## n8n Webhook Response Format

### Expected Response
```json
{
  "message": "Tasks synced successfully",
  "updatedTasks": [
    {
      "id": "task-id",
      "status": "Synced",
      "priority": "High"
    }
  ],
  "lastSync": "2025-10-26T15:00:00.000Z"
}
```

### Minimal Response (also works)
```json
{
  "message": "Success"
}
```

---

## Task Object Structure

```javascript
{
  id: "1698156789012",          // Timestamp string
  title: "Task title",          // Required
  description: "Details...",    // Optional
  dueDate: "2025-10-27",       // Required (YYYY-MM-DD)
  status: "Pending",           // Pending | Synced | Completed
  priority: "Medium",          // Low | Medium | High
  createdAt: "2025-10-26T..."  // ISO timestamp
}
```

---

## Color Scheme

### Priority Colors
- **High**: Red (#dc2626)
- **Medium**: Yellow (#f59e0b)
- **Low**: Green (#10b981)

### Status Colors
- **Pending**: Gray (#6b7280)
- **Synced**: Blue (#0ea5e9)
- **Completed**: Green (#10b981)

### Primary Brand
- **Primary**: Blue gradient (#667eea to #764ba2)

---

## Component Props

### TaskCard
```jsx
<TaskCard 
  task={taskObject}
  onDelete={(id) => {}}
  onToggleComplete={(id) => {}}
/>
```

### TaskForm
```jsx
<TaskForm 
  onAddTask={(newTask) => {}}
/>
```

### TaskList
```jsx
<TaskList 
  tasks={[]}
  onDeleteTask={(id) => {}}
  onToggleComplete={(id) => {}}
/>
```

### Navbar
```jsx
<Navbar 
  onSync={() => {}}
  onAIAnalyze={() => {}}
  lastSync={timestamp}
  isSyncing={false}
  isAnalyzing={false}
/>
```

### Toast
```jsx
<Toast 
  message="Success!"
  type="success"  // success | error | info
  duration={5000}
  onClose={() => {}}
/>
```

---

## Useful Code Snippets

### Get Tasks from localStorage
```javascript
const tasks = JSON.parse(localStorage.getItem('smart-tasks') || '[]');
```

### Add New Task
```javascript
const newTask = {
  id: Date.now().toString(),
  title: "Task title",
  description: "",
  dueDate: "2025-10-27",
  status: "Pending",
  priority: "Medium",
  createdAt: new Date().toISOString()
};
```

### Test Webhook with curl
```bash
curl -X POST https://your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"tasks": [{"id":"1","title":"Test"}]}'
```

---

## Troubleshooting Quick Fixes

### App won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Styles not working
```bash
# Check Tailwind is installed
npm list tailwindcss

# Reinstall if needed
npm install -D tailwindcss@3.4.1 postcss autoprefixer
```

### Build fails
```bash
# Check for errors in console
npm run build

# Common fix: clear cache
rm -rf dist
npm run build
```

### n8n not responding
1. Check workflow is Active (toggle in n8n)
2. Verify webhook URL in .env
3. Check n8n execution history for errors
4. Test webhook with Postman/curl first

---

## Browser DevTools Tips

### Check localStorage
1. F12 → Application tab
2. Storage → Local Storage
3. Look for `smart-tasks` key

### Debug API calls
1. F12 → Network tab
2. Filter: Fetch/XHR
3. Click "Sync with n8n"
4. Inspect request/response

### React DevTools
1. Install React DevTools extension
2. F12 → Components tab
3. Inspect component state

---

## Git Commands

```bash
# Initial commit
git init
git add .
git commit -m "Initial commit: Smart Task Manager"

# Push to GitHub
git remote add origin <your-repo-url>
git push -u origin main

# Create branch for changes
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

---

## Deployment Checklist

### Pre-Deploy
- [ ] Build succeeds: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Environment variables configured
- [ ] n8n webhook is accessible (not localhost)
- [ ] .gitignore includes .env
- [ ] README is complete

### Netlify Deploy
```bash
# Build settings
Build command: npm run build
Publish directory: dist

# Environment variables (in Netlify dashboard)
VITE_N8N_WEBHOOK_URL = your-webhook-url
```

### Vercel Deploy
```bash
vercel

# Or with environment variables
vercel --env VITE_N8N_WEBHOOK_URL=your-url
```

---

## Performance Optimization Tips

1. **Images**: Use WebP format, lazy loading
2. **Code Splitting**: Dynamic imports for routes
3. **Memoization**: Use `React.memo()` for expensive components
4. **Debouncing**: For search/filter inputs
5. **Virtual Scrolling**: For 100+ tasks

---

## Keyboard Shortcuts (Future Enhancement)

Suggested shortcuts to implement:
- `N` - New task
- `S` - Sync with n8n
- `A` - AI analyze
- `/` - Search tasks
- `ESC` - Close modals
- `?` - Show help

---

## Testing URLs

### Local
- Dev server: `http://localhost:5173`
- n8n local: `http://localhost:5678`

### Testing Tools
- Webhook tester: `https://webhook.site`
- API testing: `https://httpbin.org`
- Mock API: `https://beeceptor.com`

---

## Documentation Files

1. **README.md** - Complete documentation
2. **SETUP_GUIDE.md** - Step-by-step setup
3. **N8N_WORKFLOW_EXAMPLES.md** - Workflow templates
4. **PROJECT_SUMMARY.md** - Architecture and design
5. **QUICK_REFERENCE.md** - This file

---

## Support Resources

### Official Docs
- React: https://react.dev
- Vite: https://vite.dev
- Tailwind: https://tailwindcss.com
- n8n: https://docs.n8n.io

### Community
- n8n Forum: https://community.n8n.io
- Stack Overflow: [react] [n8n] tags
- Discord servers for each tech

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 5173 in use | `kill -9 $(lsof -t -i:5173)` |
| Module not found | `npm install` |
| Styles not applying | Check Tailwind config paths |
| n8n CORS error | n8n handles CORS automatically |
| localStorage full | Clear old data or compress |
| Animations laggy | Check browser performance tab |

---

## Version Info

- **Project Version**: 1.0.0
- **Node Version**: 18.0.0+
- **React Version**: 18.3.1
- **Vite Version**: 7.1.12
- **Tailwind Version**: 3.4.1

---

## License

MIT License - Free to use and modify

---

**Quick tip**: Bookmark this file for instant reference! 📌

