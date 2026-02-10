# AI ChatBot (Vite + Bun + Express + Groq)

A full-stack chatbot application featuring a modern React frontend and a high-performance Node.js/Express backend powered by the **Groq Llama 3.3** model.

## 🚀 Tech Stack

### Frontend
* **Vite + React (TypeScript)**: Core framework and development environment.
* **Tailwind CSS 4.0**: Modern utility-first styling.
* **shadcn/ui**: High-quality UI components (Card, ScrollArea, Avatar, Input).
* **Lucide React**: Icon library.

### Backend
* **Bun**: Fast JavaScript runtime and package manager.
* **Express**: API framework.
* **Groq SDK**: LLM integration for Llama 3.3-70b-versatile.
* **Zod**: Schema validation.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
Ensure you have **Bun** installed:
```bash
curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash

### 2. Environment Variables
Create a .env file in your root/server directory:
```env
PORT=5000
Groq_API_KEY=your_groq_api_key_here
```

### 3. Install Dependencies
Bash
bun install

### 4. Run the Application
Start the Backend (Server)
# From the server directory
bun run index.ts

Start the Frontend (Client)
bun dev