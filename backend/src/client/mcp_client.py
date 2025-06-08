import os
import json
from pprint import pprint
import asyncio
from langchain.chat_models import init_chat_model
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage


class ChatbotAgent:
    def __init__(self):
        try:
            with open("../config/settings.json", "r") as settings_file:
                settings = json.load(settings_file)

            os.environ["ANTHROPIC_API_KEY"] = settings["anthropic_api_key"]
            model = init_chat_model("claude-3-5-sonnet-latest", model_provider="anthropic")

            client = MultiServerMCPClient({
                "chatbot": {
                    "command": "python",
                    "args": ["/Users/teson/ai-chatbot-api/src/server/mcp_server.py"],
                    "transport": "stdio",
                }
            })

            self.tools = client.get_tools()
            self.agent = create_react_agent(model, self.tools)

        except Exception as e:
            print(f"エラーが発生しました: {e}")

    def getResponse(self, user_message):
        response = self.agent.invoke({
            "messages": [HumanMessage(user_message)]
        })
        return response

    def getTools(self):
        return self.tools
