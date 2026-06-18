import { useState, useCallback } from 'react';
import { chatService } from '../../services/chat.service';
import type { Message } from './interface';

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const sendMessage = useCallback(async (
        text: string,
        opts?: {
            simulateDrop?: boolean;
            simulateError?: boolean;
        }
    ) => {
        if (!text.trim() || isStreaming) return;

        const assistantId = crypto.randomUUID();

        setMessages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                role: 'user',
                content: text,
                status: 'completed',
                timestamp: new Date(),
            },
            {
                id: assistantId,
                role: 'assistant',
                content: '',
                status: 'streaming',
                timestamp: new Date(),
                originalQuery: text,
            },
        ]);

        setIsStreaming(true);

        await chatService.streamChat({
            query: text,
            simulateDrop: opts?.simulateDrop,
            simulateError: opts?.simulateError,

            onToken: (token) => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? { ...msg, content: msg.content + token }
                            : msg
                    )
                );
            },

            onDone: () => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? { ...msg, status: 'completed' }
                            : msg
                    )
                );
                setIsStreaming(false);
            },

            onError: (type) => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? {
                                ...msg,
                                status: type === 'drop' ? 'error_drop' : 'error_upstream',
                            }
                            : msg
                    )
                );
                setIsStreaming(false);
            },
        });
    }, [isStreaming]);

    const retryMessage = useCallback((assistantId: string) => {
        const message = messages.find((msg) => msg.id === assistantId);
        if (!message?.originalQuery) return;
        sendMessage(message.originalQuery);
    }, [messages, sendMessage]);

    const clearChat = useCallback(() => {
        setMessages([]);
        setIsStreaming(false);
    }, []);

    return {
        messages,
        isStreaming,
        sendMessage,
        retryMessage,
        clearChat,
    };
};