import { ref } from "vue";
import { defineStore } from "pinia";
import { Message } from "../types/interface/Message";
import settingsJson from "../conf/settings.json";


export const useMessageStore = defineStore("messages", () => {
    // variables
    let autoIncrementIndexForMessage = 0;

    // data
    const messages = ref<Message[]>([]);

    // API
    const apiURL = settingsJson.apiURL;

    // functions
    async function fetchMessagesByChatId(chatId: number) {
        const response = await fetch(`${apiURL}/messages/${chatId}`)
        if (!response.ok) {
            console.error("failed to fetch messages data from server");
            alert("failed to fetch messages data from server");
        }
        messages.value = await response.json();
    }

    async function getMessagesByChatId(chatId: number):Promise<Message[]> {
        return messages.value.filter(message => message.chatId === chatId);
    }

    async function sendUserMessage(chatId:number, userInput:string):Promise<void> {
        const newUserMessage: Message = {
            id: autoIncrementIndexForMessage,
            chatId: chatId,
            role: "user",
            content: userInput,
        };

        // call api

        messages.value.push(newUserMessage);
        const response: string = `your message is "${userInput}"` ;

        await new Promise(resolve => {
            setTimeout(() => {
                resolve("");
            }, 2000)
        });

        const newAgentMessage: Message = {
            id: autoIncrementIndexForMessage++,
            chatId: chatId,
            role: "agent",
            content: response,
        };
        messages.value.push(newAgentMessage);
    }

    // return
    return {
        messages,
        getMessagesByChatId,
        sendUserMessage,
    };
});
