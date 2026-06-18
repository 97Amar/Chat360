import { useState, useCallback, type KeyboardEvent } from 'react';
import { IconSend } from '@tabler/icons-react';
import { Textarea, Button, Text } from '@mantine/core';
import './Composer.scss';

interface Props {
  disabled?: boolean;
  onSend: (message: string, opts?: { simulateDrop?: boolean; simulateError?: boolean }) => void;
}

const Composer = ({ onSend, disabled }: Props) => {
  const [text, setText] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  }, [text, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="composer">
      <div className={`composer__box${disabled ? ' composer__box--disabled' : ''}`}>


        <Textarea
          className="composer__textarea"
          placeholder="Type your message..."
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          autosize
          minRows={1}
          maxRows={6}
          variant="unstyled"
          aria-label="Message input"
        />

        <Button
          onClick={handleSubmit}
          disabled={disabled || !text.trim()}
          loading={disabled}
          className="composer__send-btn"
          leftIcon={<IconSend size={16} />}
        >
          Send
        </Button>
      </div>

      <Text size="xs" color="dimmed" align="center" mt={6}>
        Chat responses can make mistakes. Consider checking important information.
      </Text>
    </div>
  );
};

export default Composer;