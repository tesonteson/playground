import apiClient from "./client";
import { Message } from "../types/interface/Message";


export const messageApi = {
    get: ():Promise<Message[]> => apiClient.get("/messages"),
};
