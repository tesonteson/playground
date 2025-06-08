<template>
    <div id="messages-container" class="messages-container">
        <div class="messages-list">
            <div v-for="message of messages" class="message-item" :class="message.role">
                <label class="message-role">
                    {{ message.role }}
                </label>
                <p class="message-content">{{ message.content }}</p>
            </div>
        </div>
        <div id="user-input" class="user-input-container">
            <input id="userInput" type="text" v-model="userInput" class="user-input-field" placeholder="Type your message here...">
            <button id="user-input-button" @click="handleSendUserMessage" :disabled="IsLoading" class="send-button">
                <span v-if="!IsLoading">Send</span>
                <span v-else class="loading-spinner"></span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useMessageStore } from "../stores/messages";
import { Message } from "../types/interface/Message";

// store
const messageStore = useMessageStore();

// props
const props = defineProps({
    chatId: {type: Number, required: true},
    title: {type: String, required: true},
});

// variables
const IsLoading = ref(false);
const userInput = ref("");

// data
const messages = ref<Message[]>([]);

// functions
async function handleSendUserMessage() {
    IsLoading.value = true;
    const response = await messageStore.sendUserMessage(props.chatId, userInput.value);
    userInput.value = "";
    IsLoading.value = false;
}

// watch
watchEffect(async () => {
    messages.value = await messageStore.getMessagesByChatId(props.chatId);
    userInput.value = "";
})
</script>

<style scoped>
/* リセットとベーススタイル */
* {
    box-sizing: border-box;
}

/* メッセージコンテナ全体のスタイル */
.messages-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #1a202c;
    color: #e2e8f0;
    overflow: hidden;
    position: relative;
}

/* メッセージリスト部分 */
.messages-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scrollbar-width: thin;
    scrollbar-color: #4a5568 #2d3748;
    overflow-x: hidden;
}

.messages-list::-webkit-scrollbar {
    width: 6px;
}

.messages-list::-webkit-scrollbar-track {
    background: #2d3748;
}

.messages-list::-webkit-scrollbar-thumb {
    background-color: #4a5568;
    border-radius: 6px;
}

/* 個別のメッセージスタイル */
.message-item {
    padding: 12px;
    border-radius: 4px;
    max-width: 80%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

/* ユーザーとシステムのメッセージで異なるスタイル */
.message-item.user {
    align-self: flex-end;
    background-color: #3182ce;
    color: #ffffff;
    border-bottom-right-radius: 2px;
}

.message-item.assistant {
    align-self: flex-start;
    background-color: #2d3748;
    color: #e2e8f0;
    border-bottom-left-radius: 2px;
    border-left: 3px solid #4299e1;
}

.message-item.system {
    align-self: center;
    background-color: #4a5568;
    color: #e2e8f0;
    font-style: italic;
    max-width: 70%;
    text-align: center;
    border: 1px solid #718096;
}

/* メッセージの役割ラベル */
.message-role {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: block;
    opacity: 0.8;
    color: inherit;
}

/* メッセージ本文 */
.message-content {
    margin: 0;
    line-height: 1.4;
    word-break: break-word;
    font-size: 14px;
    color: inherit;
}

/* 入力エリア */
.user-input-container {
    display: flex;
    padding: 12px 16px;
    background-color: #2d3748;
    border-top: 1px solid #4a5568;
    gap: 10px;
    position: sticky;
    bottom: 0;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.2);
    z-index: 10;
}

.user-input-field {
    flex: 1;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #4a5568;
    font-size: 14px;
    background-color: #1a202c;
    color: #e2e8f0;
    transition: border-color 0.2s;
    min-height: 36px;
}

.user-input-field:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.25);
}

.user-input-field::placeholder {
    color: #718096;
}

/* 送信ボタン */
.send-button {
    background-color: #4299e1;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 70px;
    height: 36px;
    font-size: 14px;
}

.send-button:hover:not(:disabled) {
    background-color: #3182ce;
}

.send-button:active:not(:disabled) {
    transform: translateY(1px);
}

.send-button:disabled {
    background-color: #4a5568;
    cursor: not-allowed;
    opacity: 0.7;
}

/* ローディングスピナー */
.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
