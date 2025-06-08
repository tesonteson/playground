<template>
    <div id="sidebar-container" class="app-container">
        <div id="toggleSideBar" class="toggle-sidebar">
            <input type="checkbox" id="sidebar-toggle" v-model="showSidebar">
            <label for="sidebar-toggle" class="toggle-button">
                <span class="toggle-icon"></span>
            </label>
        </div>
        <div id="sidebar" class="sidebar" v-show="showSidebar">
            <button id="new-chat-button" class="new-chat-btn" @click="handleCreateChat">
                <span class="btn-icon">+</span>
                <span class="btn-text">New Chat</span>
            </button>
            <div class="chats-container">
                <div v-for="chat of chats" class="chat-item" :class="{ 'active': selectedChat?.id === chat.id, 'editing': updatingChatTitle && selectedChat?.id === chat.id }" @click="handleSelectedChat(chat)">
                    <div class="chat-wrapper">
                        <p v-if="!updatingChatTitle || selectedChat?.id !== chat.id" class="chat-content">{{ chat.title}}</p>
                        <div v-if="updatingChatTitle && selectedChat?.id === chat.id" class="edit-form">
                            <input type="text" v-model="newChatTitle" class="edit-input" @keyup.enter="handleUpdateChat(chat.id)">
                            <div class="edit-actions">
                                <button class="save-btn" @click.stop="handleUpdateChat(chat.id)" title="Save">
                                    <span class="save-icon">✓</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="chat-actions" v-if="!updatingChatTitle">
                        <button v-if="selectedChat?.id === chat.id" class="edit-btn" @click.stop="handleStartUpdatingChat" title="Edit">
                            <span class="edit-icon">✎</span>
                        </button>
                        <button class="delete-btn" @click.stop="handleDeleteChat(chat.id)" title="Delete">
                            <span class="delete-icon">×</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Messages
            :chatId="selectedChat.id"
            :title="selectedChat.title"
            class="messages-container"
            v-if="selectedChat !== null"
            />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '../stores/chats';
import { useToastNotification } from '../utils/toastNotification';
import Messages from './Messages.vue';
import { storeToRefs } from 'pinia';
import { Chat } from '../types/interface/Chat';

// store
const chatStore = useChatStore();

// toast notification
const toast = useToastNotification();

// variables
const showSidebar = ref<boolean>(true);
const selectedChat = ref<Chat | null>(null);
const updatingChatTitle = ref<boolean>(false);
const newChatTitle = ref<string | null>(null);

// data
const { chats } = storeToRefs(chatStore);

// functions
async function handleCreateChat() {
    try {
        selectedChat.value = await chatStore.createChat("new chat");
    } catch (error:any) {
        toast.error(error.message);
    }
}

async function handleUpdateChat(chatId: number) {
    try {
        if (newChatTitle.value !== null) {
            await chatStore.updateChat(chatId, newChatTitle.value);
        }
    } catch (error:any) {
        toast.error(error.message);
    } finally {
        updatingChatTitle.value = false;
        newChatTitle.value = null;
    }
}

async function handleDeleteChat(chatId:number) {
    try {
        await chatStore.deleteChat(chatId);
    } catch (error:any) {
        toast.error(error.message);
    } finally {
        selectedChat.value = null;
    }
}

async function handleStartUpdatingChat() {
    updatingChatTitle.value = true;
}

async function handleSelectedChat(chat: Chat) {
    selectedChat.value = chat;
}
</script>

<style scoped>
/* リセットとベーススタイル */
* {
    box-sizing: border-box;
}

/* 全体のレイアウト */
.app-container {
    display: flex;
    height: 100vh;
    width: 100%;
    background-color: #1a202c;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #e2e8f0;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
}

/* トグルボタン */
.toggle-sidebar {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 100;
}

#sidebar-toggle {
    display: none;
}

.toggle-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background-color: #3182ce;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: background-color 0.2s;
}

.toggle-button:hover {
    background-color: #4299e1;
}

.toggle-icon {
    position: relative;
    width: 18px;
    height: 2px;
    background-color: white;
    transition: all 0.3s;
}

.toggle-icon::before,
.toggle-icon::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 2px;
    background-color: white;
    transition: all 0.3s;
}

.toggle-icon::before {
    transform: translateY(-6px);
}

.toggle-icon::after {
    transform: translateY(6px);
}

#sidebar-toggle:checked + .toggle-button .toggle-icon {
    background-color: transparent;
}

#sidebar-toggle:checked + .toggle-button .toggle-icon::before {
    transform: rotate(45deg);
}

#sidebar-toggle:checked + .toggle-button .toggle-icon::after {
    transform: rotate(-45deg);
}

/* サイドバー部分 */
.sidebar {
    width: 280px;
    height: 100vh;
    background-color: #2d3748;
    color: #e2e8f0;
    padding: 60px 20px 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: #4a5568 #2d3748;
    flex-shrink: 0;
    z-index: 50;
    position: relative;
}

.sidebar::-webkit-scrollbar {
    width: 6px;
}

.sidebar::-webkit-scrollbar-track {
    background: #2d3748;
}

.sidebar::-webkit-scrollbar-thumb {
    background-color: #4a5568;
    border-radius: 6px;
}

/* 新規チャットボタン */
.new-chat-btn {
    background-color: #4299e1;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    transition: background-color 0.2s;
    width: 100%;
}

.new-chat-btn:hover {
    background-color: #3182ce;
}

.new-chat-btn:active {
    transform: translateY(1px);
}

.btn-icon {
    margin-right: 8px;
    font-size: 14px;
}

/* チャットのリスト */
.chats-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.chat-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background-color: #1a202c;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    position: relative;
    border-left: 3px solid transparent;
}

.chat-item:hover {
    background-color: #2c3e50;
}

.chat-item.active {
    border-left-color: #4299e1;
    background-color: #2c3e50;
}

.chat-item.editing {
    background-color: #2c3e50;
}

.chat-wrapper {
    flex: 1;
    min-width: 0; /* テキストの省略を有効にする */
}

.chat-content {
    margin: 0;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #e2e8f0;
    padding-right: 8px;
}

.chat-actions {
    display: flex;
    align-items: center;
    opacity: 0;
    transition: opacity 0.2s;
}

.chat-item:hover .chat-actions {
    opacity: 1;
}

/* 編集モード */
.edit-form {
    display: flex;
    align-items: center;
    width: 100%;
}

.edit-input {
    flex: 1;
    background-color: #1a202c;
    border: 1px solid #4299e1;
    border-radius: 4px;
    color: #e2e8f0;
    padding: 6px 8px;
    font-size: 14px;
    min-width: 0;
    outline: none;
}

.edit-actions {
    display: flex;
    margin-left: 8px;
}

/* ボタンのスタイル */
.edit-btn, .delete-btn, .save-btn {
    background-color: transparent;
    color: #cbd5e0;
    border: none;
    border-radius: 4px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    flex-shrink: 0;
    padding: 0;
    margin-left: 4px;
}

.edit-btn:hover {
    color: #4299e1;
    background-color: rgba(255, 255, 255, 0.1);
}

.delete-btn:hover {
    color: #fc8181;
    background-color: rgba(255, 255, 255, 0.1);
}

.save-btn:hover {
    color: #48bb78;
    background-color: rgba(255, 255, 255, 0.1);
}

.edit-icon {
    font-size: 16px;
}

.save-icon {
    font-size: 16px;
    color: #48bb78;
}

.delete-icon {
    font-size: 18px;
}

/* メッセージ部分のコンテナ */
.messages-container {
    flex: 1;
    height: 100vh;
    overflow: hidden;
    background-color: #1a202c;
    border-left: 1px solid #4a5568;
    margin-left: 0;
    transition: margin-left 0.3s;
}

/* サイドバー非表示時のメッセージコンテナの調整 */
.app-container:has(#sidebar-toggle:not(:checked)) .messages-container {
    margin-left: 0;
    padding-left: 60px; /* トグルボタン分のスペース */
}
</style>
