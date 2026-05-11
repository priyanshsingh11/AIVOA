import os
from typing import TypedDict, Annotated, List, Union
from langchain_groq import ChatGroq
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from tools.hcp_tools import tools
from dotenv import load_dotenv

load_dotenv()

# Define the state for our graph
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], "The messages in the conversation"]

# Initialize the model
model = ChatGroq(
    model_name="gemma2-9b-it",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.1
)

# Define the nodes
def call_model(state: AgentState):
    messages = state['messages']
    response = model.invoke(messages)
    return {"messages": [response]}

# Build the graph
workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.set_entry_point("agent")
workflow.add_edge("agent", END)

# Compile the graph
app = workflow.compile()

async def run_agent(user_input: str, history: List[dict] = []):
    # Convert history dicts to message objects
    formatted_history = []
    for msg in history:
        if msg['role'] == 'user':
            formatted_history.append(HumanMessage(content=msg['content']))
        else:
            formatted_history.append(AIMessage(content=msg['content']))
    
    messages = formatted_history + [HumanMessage(content=user_input)]
    
    # Run the graph
    inputs = {"messages": messages}
    result = await app.ainvoke(inputs)
    
    # Return the last message's content
    return result["messages"][-1].content
