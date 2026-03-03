import apiClient from './client';
import { ChatResponse, ConversationHistoryResponse } from '@/types/chat';

/**
 * Send a message to the AI chat agent
 * @param conversationId - Existing conversation ID (null for new conversation)
 * @param message - User's message text
 * @returns ChatResponse with agent response and conversation metadata
 */
export async function sendMessage(
  conversationId: string | null,
  message: string
): Promise<ChatResponse> {
  const res = await apiClient.post('/chat', {
    conversation_id: conversationId,
    message: message,
  });
  return res.data;
}

/**
 * Get conversation history with all messages
 * @param conversationId - UUID of the conversation to retrieve
 * @returns ConversationHistoryResponse with conversation metadata and all messages
 */
export async function getConversationHistory(
  conversationId: string
): Promise<ConversationHistoryResponse> {
  const res = await apiClient.get(`/chat/${conversationId}`);
  return res.data;
}
