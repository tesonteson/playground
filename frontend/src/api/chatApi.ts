import apiClient from "./client";
import { Chat } from "../types/interface/Chat";
import { CreateChatRequest } from "../types/api/chat/CreateChatRequest";
import { UpdateChatRequest } from "../types/api/chat/UpdateChatRequest";


export const chatApi = {
    get: (): Promise<Chat[]> => apiClient.get("/chats"),
    create: (data: CreateChatRequest): Promise<Chat> => apiClient.post("/chats/create", data),
    update: (data: UpdateChatRequest): Promise<Chat> => apiClient.put("/chats/update", data),
    delete: (chatId: number): Promise<void> => apiClient.delete(`/chats/delete/${chatId}`),
};
