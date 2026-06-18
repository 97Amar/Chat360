import { useEffect, useRef, useMemo, useCallback } from 'react';

import Composer from '../Composer/Composer';
import MessageBubble from '../MessageBubble/MessageBubble';
import SidePanel from '../SidePanel/SidePanel';

import { useChat } from '../hooks/useChat';

import './ChatWindow.scss';
import Header from '../Header/Header';

const ChatWindow = () => {
  const {
    messages,
    isStreaming,
    sendMessage,
    retryMessage,
    clearChat,
  } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const messageItems = useMemo(() =>
    messages.map((message) => (
      <MessageBubble
        key={message.id}
        message={message}
        onRetry={retryMessage}
      />
    )),
    [messages, retryMessage]
  );

  const handleSend = useCallback(
    (text: string, opts?: { simulateDrop?: boolean; simulateError?: boolean }) =>
      sendMessage(text, opts),
    [sendMessage]
  );

  return (
    <div className="chat-layout">
      <div className="chat-main">
        <Header
          isStreaming={isStreaming}
          onClearChat={clearChat}
        />

        <div className="chat-body">
          <div
            className="message-list"
            ref={scrollRef}
          >
            {!messages.length && (
              <div className="empty-state">
                <div className="empty-state__icon">
                  💬
                </div>

                <p className="empty-state__title">
                  Start a conversation
                </p>

                <p className="empty-state__sub">
                  Ask me anything — I'm here to help.
                </p>
              </div>
            )}

            {messageItems}
          </div>
        </div>

        <Composer
          disabled={isStreaming}
          onSend={handleSend}
        />
      </div>

      <SidePanel isStreaming={isStreaming} />
    </div>
  );
};

export default ChatWindow;