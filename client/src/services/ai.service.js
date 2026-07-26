import api from "./api";
import { apiEndpoints } from "../constants/apiEndpoints";

export const sendMessageToAI = (data) =>
  api.post(apiEndpoints.ai.chat, data);