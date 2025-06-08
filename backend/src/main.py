from fastapi import (
    FastAPI,
    Request,
)
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from client.mcp_client import ChatbotAgent


app = FastAPI(title="Router Example API")
agent = ChatbotAgent()

# data
index = 0
all_chats = {"chats": []}


@app.get("/api/chats")
async def get_chats():
    return all_chats

@app.post("/api/chats/create")
async def create_chats(request: Request):
    global index
    print(index)
    data = await request.body()
    all_chats["chats"].append(data.title)
    response = {"id": index, "title": data.title}
    index += 1
    return response


@app.get("/api/messages/{chat_id}")
async def get_all_messages_by_chat_id():
    message_data = {"messages": [""]}
    return message_data

@app.post("/api/ai_agent_response")
async def post_ai_agent_response(request: Request):
    user_message = request.body.message
    response = agent.getResponse(user_message)
    return response
