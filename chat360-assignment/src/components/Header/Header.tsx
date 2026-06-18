import { memo } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { Chat360Icon } from '../../assets/SvgIcons';
import './Header.scss';

interface Props {
    isStreaming: boolean;
    onClearChat: () => void;
}

const Header = memo(({ isStreaming, onClearChat }: Props) => {
    return (
        <header className="chat-header">
            <div className="chat-header__brand">
                <Chat360Icon size={24} className="chat-header__icon" />
                <h1 className="chat-header__title">Chat360</h1>
            </div>

            <div className="chat-header__actions">

                <button
                    className="chat-header__btn chat-header__btn--clear"
                    onClick={onClearChat}
                    disabled={isStreaming}
                    aria-label="Clear chat"
                >
                    <IconTrash size={16} />
                    <span>Clear chat</span>
                </button>
            </div>
        </header>
    );
});

Header.displayName = 'Header';

export default Header;
