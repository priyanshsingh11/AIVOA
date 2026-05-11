# AI-First CRM HCP Module

This project is a high-fidelity CRM system specifically designed for Healthcare Professionals (HCPs). It integrates a modern React dashboard with a stateful AI agent built using LangGraph and Groq, enabling seamless interaction logging, automated data extraction, and intelligent follow-up recommendations.

## System Architecture

The application is built using a decoupled frontend-backend architecture:

1. **Frontend (React + Vite)**: 
   - A split-screen dashboard providing a dual-interaction model.
   - **Manual Form (Left Pane)**: A structured form for recording detailed HCP interactions, including sentiment, topics, materials shared, and samples distributed.
   - **AI Assistant (Right Pane)**: A persistent chat interface that uses natural language processing to automate form filling and database operations.
   - **State Management**: Redux Toolkit synchronizes the AI's extractions with the manual form in real-time.

2. **Backend (FastAPI)**:
   - **API Layer**: Exposes endpoints for database CRUD operations and AI chat orchestration.
   - **Agent Layer (LangGraph)**: Manages the reasoning loop of the AI assistant, handling tool execution and conversational state.
   - **Inference Layer (Groq)**: Utilizes the Llama-3.1-8b-Instant model for low-latency, high-accuracy CRM data extraction.

3. **Database (Supabase PostgreSQL)**:
   - A relational database storing HCP interaction records, outcomes, and metadata.
   - Integrated via SQLAlchemy ORM for robust data management.

## LangGraph Workflow Design

The AI Assistant operates on a stateful graph architecture:

- **Nodes**:
  - **Agent Node**: Processes user input, prepends system instructions, and determines if a tool call is necessary.
  - **Tools Node**: Executes specific Python functions (Tools) based on the agent's decision.
- **Conditional Logic**:
  - The graph uses a `should_continue` edge to check for `tool_calls` in the model response.
  - If a tool is called, the graph moves to the Tools node and then loops back to the Agent node with the result.
  - If no tool is called, the graph finishes and returns the final response to the user.

## Specialized AI Tools

The backend implements five specialized tools that the agent can invoke:

1. **log_interaction_tool**: 
   - Directly persists structured data to the PostgreSQL database.
   - Handles fields: HCP Name, Interaction Type, Topics, Sentiment, Materials Shared, Samples, etc.
2. **edit_interaction_tool**: 
   - Allows users to modify existing records through natural language commands.
3. **summarize_interaction_tool**: 
   - Generates professional CRM-style summaries from long meeting transcripts or voice notes.
4. **followup_recommendation_tool**: 
   - Analyzes interaction outcomes to suggest the next three most effective sales actions.
5. **hcp_history_tool**: 
   - Retrieves historical interaction data for a specific HCP to provide contextual AI responses.

## AI Autofill Protocol

To bridge the gap between the chat and the form, the system uses a custom extraction protocol:
- When the agent extracts data, it appends a structured JSON block wrapped in `<autofill>` tags to its final response.
- The frontend parses this block and uses a Redux batch update to instantly synchronize the manual form fields without user intervention.

## Setup and Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key
- Supabase PostgreSQL URI

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `.env`:
   ```text
   GROQ_API_KEY=your_key_here
   SUPABASE_DB_URL=your_postgresql_uri
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Design Aesthetics
The UI follows a premium "State-of-the-Art" aesthetic:
- **Color Palette**: Deep Navy (#1a2b4b) for text, Bright Blue (#2563eb) for actions, and subtle Mint Green (#f0fdf4) for success states.
- **Typography**: Optimized using the Google Inter font family for maximum readability.
- **Micro-animations**: Smooth transitions for AI "Thinking" states and success confirmations.
- **Responsiveness**: Flexible grid layout designed for high-resolution desktop CRM usage.
