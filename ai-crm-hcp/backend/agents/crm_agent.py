import os
from typing import TypedDict, Annotated, List, Union
from langchain_groq import ChatGroq
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.utils.function_calling import convert_to_openai_tool
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
    model="gemma2-9b-it",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0
).bind_tools(tools)

# Define State
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], "The messages in the conversation"]

# Define nodes
def call_model(state: AgentState):
    messages = state['messages']
    
    # System prompt for healthcare CRM behavior
    system_prompt = (
        "You are a professional Healthcare CRM Assistant. Your goal is to help sales representatives "
        "manage their interactions with Healthcare Professionals (HCPs). "
        "You can log new interactions, edit existing ones, summarize transcripts, and recommend follow-ups. "
        "Always be professional, concise, and focused on CRM data extraction. "
        "When logging an interaction, try to extract: hcp_name, interaction_type, topics_discussed, sentiment, follow_up, and summary."
    )
    
    if not any(isinstance(m, HumanMessage) and m.content == system_prompt for m in messages):
        # We don't actually want to append system prompt to history every time, 
        # usually it's at the start. For now we just invoke.
        pass

    response = llm.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState):
    last_message = state['messages'][-1]
    if last_message.tool_calls:
        return "tools"
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
    formatted_history = []
    for msg in history:
        if msg['role'] == 'user':
            formatted_history.append(HumanMessage(content=msg['content']))
        else:
            formatted_history.append(AIMessage(content=msg['content']))
    
    inputs = {"messages": formatted_history + [HumanMessage(content=user_input)]}
    result = await app.ainvoke(inputs)
    return result["messages"][-1].content
