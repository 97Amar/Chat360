import { memo } from 'react';
import { IconRefresh } from '@tabler/icons-react';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import { UserAvatarIcon, ErrorAvatarIcon, Chat360Icon } from '../../assets/SvgIcons';
import type { Message } from '../hooks/interface';
import './MessageBubble.scss';

interface Props {
  message: Message;
  onRetry: (id: string) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const UserAvatar = memo(() => (
  <div className="avatar avatar--user" aria-hidden="true">
    <UserAvatarIcon />
  </div>
));
UserAvatar.displayName = 'UserAvatar';

const ErrorAvatar = memo(() => (
  <div className="avatar avatar--error" aria-hidden="true">
    <ErrorAvatarIcon />
  </div>
));
ErrorAvatar.displayName = 'ErrorAvatar';

const MessageBubble = memo(({ message, onRetry }: Props) => {
  const { id, role, content, status, timestamp } = message;
  const isStreaming = status === 'streaming';
  const isErrorDrop = status === 'error_drop';
  const isErrorUpstream = status === 'error_upstream';
  const isError = isErrorDrop || isErrorUpstream;

  if (role === 'user') {
    return (
      <div className="message-row message-row--user">
        <div className="message-group message-group--user">
          <span className="message__timestamp">{formatTime(timestamp)}</span>
          <div className="bubble bubble--user">{content}</div>
        </div>
        <UserAvatar />
      </div>
    );
  }

  // Error bubble
  if (isError) {
    return (
      <div className="message-row message-row--assistant">
        <ErrorAvatar />
        <div className="message-group message-group--assistant">
          <span className="message__timestamp">{formatTime(timestamp)}</span>
          <div className="bubble bubble--error">
            <div className="bubble--error__header">
              {isErrorDrop ? 'Connection lost' : 'Upstream model unavailable'}
            </div>
            <p className="bubble--error__body">
              {isErrorDrop
                ? 'The connection was lost while receiving the response. You can retry to generate the response again.'
                : "We're unable to reach the AI model right now. Please try again in a moment."}
            </p>
            <button className="bubble--error__retry" onClick={() => onRetry(id)}>
              <IconRefresh size={14} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Assistant bubble (streaming or completed)
  return (
    <div className="message-row message-row--assistant">
      <Chat360Icon />
      <div className="message-group message-group--assistant">
        <span className="message__timestamp">{formatTime(timestamp)}</span>
        <div className={`bubble bubble--assistant${isStreaming ? ' bubble--streaming' : ''}`}>
          {content}
          {isStreaming && <TypingIndicator inline={content.length > 0} />}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;