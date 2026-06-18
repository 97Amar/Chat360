export type MessageStatus = 'streaming' | 'completed' | 'error_drop' | 'error_upstream';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: MessageStatus;
  timestamp: Date;
  /** Stores the user query associated with this assistant response so we can retry */
  originalQuery?: string;
}

export interface StreamChatOptions {
  query: string;
  simulateDrop?: boolean;
  simulateError?: boolean;
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (type: 'drop' | 'upstream', message?: string) => void;
}