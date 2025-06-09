import { ReactNode } from 'react';

interface MessageProps {
  content: string;
  isUser?: boolean;
  timestamp?: string;
  className?: string;
}

export function Message({ content, isUser = false, timestamp, className = '' }: MessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${className}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-accent-primary text-background-primary rounded-tr-none'
            : 'bg-background-secondary text-text-primary rounded-tl-none'
        }`}
      >
        <p>{content}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${isUser ? 'text-background-primary/70' : 'text-text-secondary'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}

interface ChatContainerProps {
  children: ReactNode;
  className?: string;
}

export function ChatContainer({ children, className = '' }: ChatContainerProps) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
  className = '',
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`flex items-center p-4 border-t border-background-secondary ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-grow px-4 py-2 bg-background-secondary border border-background-secondary rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className={`px-4 py-2 bg-accent-primary text-background-primary rounded-r-md focus:outline-none focus:ring-2 focus:ring-accent-primary ${
          disabled || !value.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-primary/90'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className = '' }: TypingIndicatorProps) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="w-2 h-2 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
}
