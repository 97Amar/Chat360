import { memo } from 'react';
import './TypingIndicator.scss';

interface Props {
  /** When true, renders inline (appended to message content) vs standalone row */
  inline?: boolean;
}

const TypingIndicator = memo(({ inline = false }: Props) => {
  return (
    <span className={`typing-indicator${inline ? ' typing-indicator--inline' : ''}`} aria-label="Typing...">
      <span className="typing-indicator__dot" />
      <span className="typing-indicator__dot" />
      <span className="typing-indicator__dot" />
    </span>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

export default TypingIndicator;
