# AI-First CRM HCP Module

A modern CRM module designed for Healthcare Professionals (HCPs), featuring a split-screen dashboard with an AI chat assistant.

## Tech Stack

- **Frontend:** React, Vite, Redux Toolkit, TailwindCSS
- **Backend:** FastAPI, SQLAlchemy, Supabase (PostgreSQL)
- **AI:** LangGraph, Groq (gemma2-9b-it)

## Folder Structure

```text
ai-crm-hcp/
├── frontend/        # React + Vite Application
└── backend/         # FastAPI Application
```

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file from `.env.example` and add your keys:
   - `GROQ_API_KEY`
   - `SUPABASE_DB_URL`
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Database Connection (Supabase)

- Go to your Supabase project settings.
- Copy the **URI** from the Database settings (Connection String -> SQLAlchemy).
- Paste it into your `.env` as `SUPABASE_DB_URL`.

## AI Assistant

The AI assistant uses **LangGraph** to manage conversational flows and **Groq** for high-speed inference using the `gemma2-9b-it` model.
