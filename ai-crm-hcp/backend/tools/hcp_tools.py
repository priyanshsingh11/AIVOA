from langchain_core.tools import tool

@tool
def log_interaction_tool(hcp_name: str, details: str):
    """Log a new interaction with an HCP."""
    return f"Logged interaction for {hcp_name} with details: {details}"

@tool
def edit_interaction_tool(interaction_id: int, updates: dict):
    """Edit an existing interaction record."""
    return f"Updated interaction {interaction_id}"

@tool
def summarize_interaction_tool(transcript: str):
    """Summarize a conversation transcript into key points."""
    return "Summary of interaction: [Placeholder]"

@tool
def follow_up_recommendation_tool(summary: str):
    """Generate follow-up recommendations based on interaction summary."""
    return "Recommended follow-up: [Placeholder]"

@tool
def hcp_history_tool(hcp_name: str):
    """Retrieve historical interaction data for a specific HCP."""
    return f"History for {hcp_name}: [Placeholder]"

tools = [
    log_interaction_tool,
    edit_interaction_tool,
    summarize_interaction_tool,
    follow_up_recommendation_tool,
    hcp_history_tool
]
