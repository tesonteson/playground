import axios from "axios";
import settingsJson from "../conf/settings.json";


const apiClient = axios.create({
    baseURL: settingsJson.apiURL,
    timeout: 10000,
});


export default apiClient;
