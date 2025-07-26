import axios from "axios";

const API = "http://localhost:5000/chat";

export const getChatUsers = () => axios.get(`${API}/users`, { withCredentials: true });
export const getMessages = (userId) =>
  axios.get(`${API}/chat/messages/${userId}`, { withCredentials: true });
