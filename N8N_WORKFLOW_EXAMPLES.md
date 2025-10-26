# 🔧 n8n Workflow Examples

This document provides detailed examples of n8n workflows you can use with the Smart Task Manager.

## 📋 Table of Contents

1. [Basic Task Sync Workflow](#basic-task-sync-workflow)
2. [Advanced Sync with Google Sheets](#advanced-sync-with-google-sheets)
3. [Email Reminder Workflow](#email-reminder-workflow)
4. [AI Priority Analysis Workflow](#ai-priority-analysis-workflow)
5. [Complete All-in-One Workflow](#complete-all-in-one-workflow)

---

## 1. Basic Task Sync Workflow

### Purpose
Simple webhook that receives tasks and responds with confirmation.

### Nodes Configuration

#### Node 1: Webhook (Trigger)
```
HTTP Method: POST
Path: smart-task-sync
Authentication: None (or Header Auth for production)
Respond: Respond to Webhook
```

#### Node 2: Code (Process Tasks)
```javascript
// Extract task data
const tasks = items[0].json.tasks || [];
const totalTasks = tasks.length;

// Mark all tasks as synced
const updatedTasks = tasks.map(task => ({
  id: task.id,
  title: task.title,
  status: 'Synced',
  priority: task.priority
}));

return [{
  json: {
    message: `Successfully synced ${totalTasks} task(s)`,
    updatedTasks: updatedTasks,
    lastSync: new Date().toISOString(),
    totalProcessed: totalTasks
  }
}];
```

#### Node 3: Respond to Webhook
```
Response Code: 200
Response Body: {{ $json }}
```

---

## 2. Advanced Sync with Google Sheets

### Purpose
Save tasks to Google Sheets for permanent storage and tracking.

### Prerequisites
- Google Sheets credentials configured in n8n
- A Google Sheet with columns: ID, Title, Description, Due Date, Status, Priority, Synced At

### Nodes Configuration

#### Node 1: Webhook (Trigger)
Same as basic workflow

#### Node 2: Split In Batches
```
Batch Size: 1
Options: 
  - Process all items
  - Reset on each run
```

#### Node 3: Google Sheets (Append)
```
Operation: Append
Document: [Your Sheet ID]
Sheet: Sheet1

Columns:
- ID: {{ $json.id }}
- Title: {{ $json.title }}
- Description: {{ $json.description }}
- Due Date: {{ $json.dueDate }}
- Status: Synced
- Priority: {{ $json.priority }}
- Synced At: {{ $now.toISO() }}
```

#### Node 4: Code (Aggregate Results)
```javascript
// Wait for all batches to complete
const allTasks = items.map(item => ({
  id: item.json.id,
  title: item.json.title,
  status: 'Synced',
  priority: item.json.priority
}));

return [{
  json: {
    message: `Successfully synced ${allTasks.length} task(s) to Google Sheets`,
    updatedTasks: allTasks,
    lastSync: new Date().toISOString()
  }
}];
```

#### Node 5: Respond to Webhook
Same as basic workflow

---

## 3. Email Reminder Workflow

### Purpose
Send email reminders for tasks due today or overdue.

### Prerequisites
- Gmail credentials configured (or SMTP for other email providers)
- Webhook from previous workflows

### Additional Nodes

#### Node: IF (Check Due Date)
```
Conditions:
- Value 1: {{ $json.dueDate }}
- Operation: Is after or equal to
- Value 2: {{ $today }}

AND

- Value 1: {{ $json.dueDate }}
- Operation: Is before or equal to
- Value 2: {{ $today.plus({days: 1}) }}
```

#### Node: Gmail (Send Email) - Connected to TRUE branch
```
Resource: Message
Operation: Send

To: your-email@example.com
Subject: 🔔 Task Reminder: {{ $json.title }}

Message (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .task-info { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .priority-high { color: #dc2626; font-weight: bold; }
    .priority-medium { color: #f59e0b; font-weight: bold; }
    .priority-low { color: #10b981; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Task Reminder</h1>
    </div>
    <div class="content">
      <h2>{{ $json.title }}</h2>
      <div class="task-info">
        <p><strong>Description:</strong> {{ $json.description || 'No description' }}</p>
        <p><strong>Due Date:</strong> {{ $json.dueDate }}</p>
        <p><strong>Priority:</strong> <span class="priority-{{ $json.priority.toLowerCase() }}">{{ $json.priority }}</span></p>
      </div>
      <p>Don't forget to complete this task!</p>
    </div>
  </div>
</body>
</html>
```
```

---

## 4. AI Priority Analysis Workflow

### Purpose
Use OpenAI to analyze tasks and suggest optimal priorities.

### Prerequisites
- OpenAI API credentials configured in n8n
- OpenAI node available in your n8n instance

### Nodes Configuration

#### Node 1: Webhook (Trigger)
```
HTTP Method: POST
Path: smart-task-ai-analyze
Authentication: None
```

#### Node 2: Code (Prepare AI Prompt)
```javascript
const tasks = items[0].json.tasks || [];

// Format tasks for AI analysis
const taskList = tasks.map((task, index) => `
Task ${index + 1}:
- Title: ${task.title}
- Description: ${task.description || 'None'}
- Due Date: ${task.dueDate}
- Current Priority: ${task.priority}
`).join('\n');

const prompt = `Analyze these tasks and suggest optimal priority levels (High, Medium, or Low) based on:
1. Due date urgency (closer dates = higher priority)
2. Keywords indicating importance (urgent, critical, important, etc.)
3. Task complexity from description

${taskList}

Respond ONLY with a valid JSON array in this exact format:
[
  {
    "id": "task_id_here",
    "title": "task_title_here",
    "suggestedPriority": "High|Medium|Low",
    "reason": "brief explanation"
  }
]`;

return [{
  json: {
    prompt: prompt,
    originalTasks: tasks
  }
}];
```

#### Node 3: OpenAI (Chat Model)
```
Resource: Chat
Operation: Create a Message

Model: gpt-3.5-turbo (or gpt-4 for better results)
Messages:
  - Type: System
    Content: You are a task management AI that helps prioritize tasks. Always respond with valid JSON only.
  
  - Type: User
    Content: {{ $json.prompt }}

Options:
  - Temperature: 0.3
  - Max Tokens: 1000
```

#### Node 4: Code (Parse AI Response)
```javascript
const aiResponse = items[0].json.message.content;
const originalTasks = items[0].json.originalTasks;

try {
  // Parse AI response
  const analyzedTasks = JSON.parse(aiResponse);
  
  // Match analyzed tasks with original tasks
  const updatedTasks = originalTasks.map(task => {
    const analysis = analyzedTasks.find(at => 
      at.title.toLowerCase().includes(task.title.toLowerCase()) ||
      at.id === task.id
    );
    
    return {
      id: task.id,
      title: task.title,
      suggestedPriority: analysis?.suggestedPriority || task.priority,
      reason: analysis?.reason || 'No specific recommendation'
    };
  });
  
  return [{
    json: {
      message: 'AI analysis completed successfully',
      analyzedTasks: updatedTasks,
      aiInsights: analyzedTasks
    }
  }];
} catch (error) {
  return [{
    json: {
      message: 'AI analysis completed with warnings',
      analyzedTasks: originalTasks.map(t => ({
        id: t.id,
        title: t.title,
        suggestedPriority: t.priority,
        reason: 'Could not parse AI response'
      })),
      error: error.message
    }
  }];
}
```

#### Node 5: Respond to Webhook
```
Response Code: 200
Response Body: {{ $json }}
```

---

## 5. Complete All-in-One Workflow

### Purpose
Comprehensive workflow combining all features:
- Save to Google Sheets
- Send email reminders
- AI priority analysis
- Status tracking

### Workflow Structure

```
Webhook Trigger
    ↓
Check Action Type (IF node)
    ├── [action = "sync"] → Google Sheets → Email Check → Respond
    └── [action = "ai_analyze"] → OpenAI → Process Results → Respond
```

### IF Node Configuration
```
Conditions:
- Value 1: {{ $json.action }}
- Operation: Equal to
- Value 2: ai_analyze
```

### Complete Node Flow

1. **Webhook Trigger**
2. **IF (Check Action)**
   - TRUE → AI Analysis Branch (Nodes 3-5 from AI workflow)
   - FALSE → Sync Branch (Nodes from Google Sheets workflow)
3. **Merge** (Combine both branches)
4. **Respond to Webhook**

---

## 🧪 Testing Your Workflow

### Using curl

```bash
# Test basic sync
curl -X POST https://your-n8n-instance.com/webhook/your-id \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      {
        "id": "1",
        "title": "Test Task",
        "description": "Testing n8n integration",
        "dueDate": "2025-10-27",
        "status": "Pending",
        "priority": "Medium"
      }
    ],
    "syncTimestamp": "2025-10-26T15:00:00Z",
    "totalTasks": 1
  }'

# Test AI analysis
curl -X POST https://your-n8n-instance.com/webhook/your-ai-id \
  -H "Content-Type: application/json" \
  -d '{
    "action": "ai_analyze",
    "tasks": [
      {
        "id": "1",
        "title": "Urgent: Fix critical bug",
        "description": "Production server is down",
        "dueDate": "2025-10-26",
        "priority": "Low"
      }
    ]
  }'
```

### Using Postman

1. Create a new POST request
2. Enter your webhook URL
3. Set Headers:
   ```
   Content-Type: application/json
   ```
4. Add request body (use examples above)
5. Send and verify response

---

## 🔐 Security Best Practices

1. **Use Authentication**
   ```
   Add Header Auth to webhook:
   Header Name: X-API-Key
   Header Value: your-secret-key
   ```

2. **Validate Input**
   ```javascript
   // Add validation node
   if (!items[0].json.tasks || !Array.isArray(items[0].json.tasks)) {
     throw new Error('Invalid request: tasks array required');
   }
   ```

3. **Rate Limiting**
   - Use n8n's built-in rate limiting
   - Or add custom rate limit logic

4. **Error Handling**
   ```javascript
   try {
     // Your workflow logic
   } catch (error) {
     return [{
       json: {
         error: true,
         message: 'An error occurred',
         details: error.message
       }
     }];
   }
   ```

---

## 📊 Monitoring & Logging

### Add Logging Node

```javascript
// After each major step
const logEntry = {
  timestamp: new Date().toISOString(),
  workflow: 'smart-task-sync',
  step: 'process-tasks',
  tasksProcessed: items.length,
  status: 'success'
};

console.log(JSON.stringify(logEntry));

// Continue with your data
return items;
```

### Track Execution Times

```javascript
const startTime = Date.now();

// Your processing logic here

const endTime = Date.now();
const duration = endTime - startTime;

return [{
  json: {
    ...yourData,
    executionTime: duration + 'ms'
  }
}];
```

---

## 🎓 Tips & Tricks

1. **Use Environment Variables**
   - Store API keys in n8n credentials
   - Use environment variables for configuration

2. **Test Incrementally**
   - Build workflows step by step
   - Test each node individually

3. **Use Set Node for Debugging**
   - Add Set nodes to inspect data flow
   - Helpful for troubleshooting

4. **Save Workflow Versions**
   - Export workflows regularly
   - Keep backups before major changes

5. **Optimize Performance**
   - Use batch processing for large task lists
   - Minimize external API calls
   - Cache results when possible

---

## 🆘 Common Issues & Solutions

### Issue: Webhook not responding

**Solution:**
- Ensure workflow is active
- Check execution history for errors
- Verify "Respond to Webhook" node is present

### Issue: Google Sheets not updating

**Solution:**
- Verify credentials are correct
- Check sheet permissions
- Ensure column names match exactly

### Issue: OpenAI returning errors

**Solution:**
- Check API key validity
- Verify you have credits/quota
- Reduce token limit if hitting limits
- Check prompt format

---

## 📚 Additional Resources

- [n8n Workflow Templates](https://n8n.io/workflows)
- [n8n Community Forum](https://community.n8n.io/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

**Happy Automating! 🚀**

