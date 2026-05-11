import os
from typing import TypedDict, Annotated, List, Union
from langchain_groq import ChatGroq
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from dotenv import load_dotenv

# Import tools
from tools.log_interaction_tool import log_interaction_tool
from tools.edit_interaction_tool import edit_interaction_tool
from tools.summarize_interaction_tool import summarize_interaction_tool
from tools.followup_recommendation_tool import followup_recommendation_tool
from tools.hcp_history_tool import hcp_history_tool

load_dotenv()

# Define tools list
tools = [
    log_interaction_tool,
    edit_interaction_tool,
    summarize_interaction_tool,
    followup_recommendation_tool,
    hcp_history_tool
]

# Initialize model
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0
).bind_tools(tools)

# Define State with proper message history handling
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]

# System prompt for healthcare CRM behavior
SYSTEM_PROMPT = (
    "You are a professional Healthcare CRM Assistant. Your goal is to help sales representatives "
    "manage their interactions with Healthcare Professionals (HCPs).\n\n"
    "CORE CAPABILITIES:\n"
    "1. DATA EXTRACTION: When a user describes an interaction, ALWAYS try to extract: "
    "hcp_name, interaction_type, topics_discussed, sentiment, follow_up, summary, materials_shared, samples_distributed, date, and time.\n"
    "2. AUTOFILL SUPPORT: Whenever you extract or update information (even if it's just one field like 'interaction_type'), "
    "you MUST include the <autofill> JSON block in your FINAL RESPONSE to the user. "
    "Do NOT include it when calling a tool. "
    "Example: \"I've updated the type to Call. <autofill>{\\\"interaction_type\\\": \\\"Virtual Call\\\"}</autofill>\"\n"
    "3. TOOLS: Use available tools for database actions. "
    "IMPORTANT: When calling a tool, provide ONLY the tool arguments. Do not add any text or tags.\n\n"
    "BEHAVIOR:\n"
    "- Be professional, concise, and healthcare-focused.\n"
    "- If interaction details are missing, ask for them.\n"
    "- ALWAYS provide a brief summary of what you have updated or logged (e.g., \"I've updated the interaction type to Call.\").\n"
    "- ALWAYS end your final response with the word \"Done.\" after your summary."
)

# Define nodes
def call_model(state: AgentState):
    messages = state['messages']
    print(f"\n[AGENT] Calling LLM with {len(messages)} messages in history...")
    
    # Prepend system message to the conversation history for this call
    full_messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
    response = llm.invoke(full_messages)
    
    print(f"[AGENT] LLM Response received. Tool calls: {len(response.tool_calls) if response.tool_calls else 0}")
    return {"messages": [response]}

def should_continue(state: AgentState):
    last_message = state['messages'][-1]
    if last_message.tool_calls:
        print(f"[FLOW] Tool execution required: {last_message.tool_calls[0]['name']}")
        return "tools"
    print("[FLOW] No tool calls. Sending final response.")
    return END

# Build Graph
workflow = StateGraph(AgentState)

workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(tools))

workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

app = workflow.compile()

async def run_crm_agent(user_input: str, history: List[dict] = []):
    # Convert history into LangChain message format
    formatted_history = []
    for msg in history:
        if msg['role'] == 'user':
            formatted_history.append(HumanMessage(content=msg['content']))
        elif msg['role'] == 'assistant':
            formatted_history.append(AIMessage(content=msg['content']))
    
    # Run the graph
    print(f"\n[USER] {user_input[:50]}...")
    inputs = {"messages": formatted_history + [HumanMessage(content=user_input)]}
    result = await app.ainvoke(inputs)
    
    # Return the last AI response content
    return result["messages"][-1].content
