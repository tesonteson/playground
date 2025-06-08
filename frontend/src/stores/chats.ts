import { ref } from "vue";
import { defineStore } from "pinia";
import { Chat } from "../types/interface/Chat";
import { chatApi } from "../api/chatApi";
import { CreateChatRequest } from "../types/api/chat/CreateChatRequest";
import { UpdateChatRequest } from "../types/api/chat/UpdateChatRequest";


export const useChatStore = defineStore("chats", () => {
    // data
    const chats = ref<Chat[]>([]);

    // functions
    async function getChats():Promise<void> {
        try {
            chats.value = await chatApi.get();
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async function createChat(title: string):Promise<Chat> {
        try {
            const reqeust: CreateChatRequest = {title: title};
            const newChat:Chat = await chatApi.create(reqeust);
            chats.value.push(newChat);
            return newChat;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async function updateChat(chatId: number, newChatTitle: string):Promise<void> {
        try {
            const request: UpdateChatRequest = {id: chatId, title: newChatTitle};
            const response = await chatApi.update(request);
            chats.value = chats.value.map(chat => {
                if (chat.id === chatId) {
                    return {...chat, title:response.title};
                }
                return chat;
            });
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async function deleteChat(chatId: number):Promise<void> {
        try {
            await chatApi.delete(chatId);
            chats.value = chats.value.filter(chat => chat.id !== chatId);
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    // return
    return {
        chats,
        getChats,
        createChat,
        updateChat,
        deleteChat,
    };
});
