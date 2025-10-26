# 🎯 Smart Task Manager with n8n Integration

A modern, full-stack task management web application that seamlessly integrates with **n8n** workflow automation and **AI-powered task prioritization**. Built for the LyRise AI Technical Internship Assessment.

## 🎯 **LyRise Assessment Highlights**

This project demonstrates:
- 🧠 **AI Integration**: Real LLM implementation for intelligent task prioritization
- 🔄 **Automation Mastery**: 4 sophisticated n8n workflows working in harmony
- ⚡ **Full-Stack Development**: Modern React frontend with cloud-based automation backend
- 📊 **Data Management**: Google Sheets integration with real-time CRUD operations
- 🏗️ **Clean Architecture**: Scalable, maintainable code with comprehensive documentation

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan?logo=tailwindcss)
![n8n](https://img.shields.io/badge/n8n-Integration-red?logo=n8n)

## ✨ Features

### Core Functionality
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete tasks
- 💾 **Persistent Storage** - localStorage keeps your tasks safe between sessions
- 🎨 **Modern UI/UX** - Clean, professional interface with Tailwind CSS
- 🎬 **Smooth Animations** - Framer Motion for delightful interactions
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

### Task Management
- 📝 Add tasks with title, description, due date, and priority
- 🎯 Priority levels: High 🟥, Medium 🟨, Low 🟩
- ✔️ Mark tasks as complete/incomplete
- 🗑️ Delete unwanted tasks
- 📊 Real-time task statistics

### n8n Integration
- ☁️ **Webhook Sync** - Send tasks to n8n workflows
- 🔄 **Bidirectional Updates** - Receive updated task data from n8n
- ⚡ **Real-time Feedback** - Visual status updates after sync
- 📅 **Smart Reminders** - n8n can send email reminders for due tasks

### AI-Powered Features (Bonus)
- 🤖 **AI Task Analysis** - Intelligent priority suggestions
- 🧠 **OpenAI Integration** - Via n8n workflow automation
- 📈 **Smart Prioritization** - Based on keywords and due dates

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **n8n instance** (cloud or self-hosted)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure n8n webhook**
   
   Create a `.env` file in the root directory:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your n8n webhook URLs:
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
   VITE_N8N_AI_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-ai-webhook-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🔧 n8n Workflow Setup

### Basic Sync Workflow

Create an n8n workflow with the following nodes:

1. **Webhook Trigger**
   - Method: POST
   - Path: `/smart-task-sync`
   - Response: Respond to Webhook

2. **Google Sheets Node** (Optional)
   - Operation: Append
   - Save incoming tasks to a spreadsheet

3. **IF Node** (Optional)
   - Check if tasks are due today
   - Branch: Send reminder emails

4. **Gmail Node** (Optional)
   - Send email reminders for urgent tasks

5. **Respond to Webhook Node**
   - Status Code: 200
   - Response Body:
   ```json
   {
     "message": "Tasks synced successfully",
     "updatedTasks": [
       {
         "id": "{{task.id}}",
         "title": "{{task.title}}",
         "status": "Synced",
         "priority": "{{task.priority}}"
       }
     ],
     "lastSync": "{{$now}}"
   }
   ```

### AI Analysis Workflow (Bonus)

Add an OpenAI node to analyze tasks:

1. **Webhook Trigger**
   - Receives tasks with `action: "ai_analyze"`

2. **OpenAI Node**
   - Model: GPT-3.5 or GPT-4
   - Prompt:
   ```
   Analyze these tasks and suggest priority levels (High/Medium/Low) based on:
   - Due date urgency
   - Task keywords (urgent, important, etc.)
   - Description content
   
   Tasks: {{JSON.stringify($json.tasks)}}
   
   Respond in JSON format with analyzedTasks array.
   ```

3. **Respond to Webhook Node**
   - Return analyzed tasks with suggested priorities

### Example Webhook Response Format

```json
{
  "message": "Tasks synced successfully",
  "updatedTasks": [
    {
      "id": "1234567890",
      "title": "Complete project documentation",
      "status": "Synced",
      "priority": "High"
    }
  ],
  "lastSync": "2025-10-26T15:30:00.000Z"
}
```

## 📁 Project Structure

```
smart-task-manager/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation with sync buttons
│   │   ├── TaskForm.jsx         # Form to add new tasks
│   │   ├── TaskList.jsx         # Grid display of tasks
│   │   ├── TaskCard.jsx         # Individual task card
│   │   └── Toast.jsx            # Notification component
│   ├── hooks/
│   │   └── useLocalStorage.js   # Custom hook for localStorage
│   ├── App.jsx                  # Main application logic
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind CSS + custom styles
├── index.html                   # HTML template
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🎨 UI/UX Highlights

### Design Philosophy
- **Clean & Modern** - Minimalist design with focus on functionality
- **Color-Coded** - Priority and status badges for quick recognition
- **Smooth Animations** - Framer Motion for delightful interactions
- **Responsive Layout** - CSS Grid and Flexbox for all screen sizes

### Color Scheme
- **Primary Blue** - Main actions and branding
- **Status Colors**
  - 🟢 Green - Completed/Synced
  - 🟡 Yellow - Medium priority
  - 🔴 Red - High priority/Overdue
  - ⚪ Gray - Pending tasks

### Animations
- Fade-in on task creation
- Slide-up for toasts
- Smooth transitions on status changes
- Loading spinners during sync

## 🔌 API Integration

### Frontend → n8n

**Request Format:**
```javascript
POST https://your-n8n-webhook.com/webhook/id
Content-Type: application/json

{
  "tasks": [
    {
      "id": "1234567890",
      "title": "Task title",
      "description": "Task description",
      "dueDate": "2025-10-27",
      "status": "Pending",
      "priority": "Medium",
      "createdAt": "2025-10-26T10:00:00.000Z"
    }
  ],
  "syncTimestamp": "2025-10-26T15:00:00.000Z",
  "totalTasks": 1
}
```

**Expected Response:**
```javascript
{
  "message": "Tasks synced successfully",
  "updatedTasks": [
    {
      "id": "1234567890",
      "status": "Synced",
      "priority": "High"  // Optionally updated by n8n/AI
    }
  ],
  "lastSync": "2025-10-26T15:00:00.000Z"
}
```

## 🧪 Testing

### Local Testing Without n8n

For testing without n8n, you can use:

1. **Webhook.site** - Free webhook testing service
   ```
   https://webhook.site/#!/<your-unique-id>
   ```

2. **Beeceptor** - Mock API responses
   ```
   https://myapp.free.beeceptor.com
   ```

3. **Mockoon** - Local mock API server

### With n8n Cloud

1. Sign up at [n8n.cloud](https://n8n.cloud)
2. Create a new workflow
3. Add a Webhook trigger
4. Copy the webhook URL
5. Add it to your `.env` file

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy to Netlify

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add `VITE_N8N_WEBHOOK_URL`

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts and add environment variables in the Vercel dashboard.

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **Vite 7.1** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon set

### Backend/Automation
- **n8n** - Workflow automation
- **Google Sheets** - Task storage (optional)
- **Gmail** - Email reminders (optional)
- **OpenAI API** - AI analysis (optional)

### Storage
- **localStorage** - Client-side persistence

## 🎯 Key Features Explained

### 1. Task Persistence
Tasks are automatically saved to `localStorage` using a custom React hook. This ensures data persists even after browser refresh.

### 2. n8n Webhook Integration
The app sends task data to n8n via HTTP POST requests. n8n processes the data (save to sheets, send emails, etc.) and returns updated task information.

### 3. Real-time UI Updates
When n8n responds, the frontend immediately updates task statuses and priorities, providing instant feedback to users.

### 4. AI Priority Suggestions
Optional feature where n8n calls OpenAI to analyze task urgency based on:
- Due date proximity
- Keywords in title/description
- Task complexity indicators

## 🐛 Troubleshooting

### Issue: "Unable to connect to n8n"

**Solution:**
- Verify your webhook URL is correct in `.env`
- Check if your n8n instance is running
- Test the webhook URL directly with curl or Postman
- Check browser console for CORS errors

### Issue: Tasks not syncing

**Solution:**
- Check n8n workflow is active
- Verify webhook response format matches expected structure
- Check n8n execution history for errors
- Ensure "Respond to Webhook" node is configured

### Issue: AI analysis not working

**Solution:**
- Verify OpenAI API key in n8n
- Check OpenAI node configuration
- Ensure proper prompt format
- Check API quota/rate limits

## 📝 Future Enhancements

- [ ] User authentication with Firebase/Auth0
- [ ] Multi-user support with backend database
- [ ] Task categories/tags
- [ ] Drag-and-drop reordering
- [ ] Dark mode toggle
- [ ] Export tasks to CSV/PDF
- [ ] Recurring tasks
- [ ] Task comments/notes
- [ ] File attachments
- [ ] Calendar view

## 🤝 Contributing

This project was created for the LyRise AI Technical Internship Assessment. Feel free to fork and enhance!

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 👨‍💻 Author

Created with ❤️ for LyRise AI Internship Assessment

---

## 📹 Demo Video Checklist

When recording your demo video (≤5 minutes), include:

- [ ] Opening the app in browser
- [ ] Adding multiple tasks with different priorities
- [ ] Showing task details (title, description, due date)
- [ ] Marking tasks as complete
- [ ] Clicking "Sync with n8n" button
- [ ] Showing n8n dashboard/workflow execution
- [ ] Returning to frontend to show updated task statuses
- [ ] (Optional) Demonstrating AI analysis feature
- [ ] Showing persistent storage (refresh page, tasks remain)
- [ ] Briefly explaining the architecture

## 🎬 **Demo & Submission**

### 📹 **Live Demo Video**
[🎥 Watch the 5-minute demo](YOUR_VIDEO_LINK_HERE) - Shows the complete system in action with AI-powered task reordering and n8n workflow integration.

### 🔗 **Live n8n Workflows**
- **Main Sync**: `https://omarossama.app.n8n.cloud/webhook/sync` - AI task prioritization
- **Get Tasks**: `https://omarossama.app.n8n.cloud/webhook/get-tasks` - Data retrieval  
- **Delete Task**: `https://omarossama.app.n8n.cloud/webhook/delete-task` - Task removal
- **Overdue Check**: `https://omarossama.app.n8n.cloud/webhook/check-overdue` - Automated monitoring

## 🔗 Useful Links

- [n8n Documentation](https://docs.n8n.io/)
- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

**Happy Task Managing! 🚀**

