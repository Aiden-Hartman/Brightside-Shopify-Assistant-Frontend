import { useState, useRef, useEffect } from 'react';
import { useAssistantFlow } from '@/hooks/useAssistantFlow';
import styles from './ChatWindow.module.css';

export function ChatWindow() {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    error,
    products,
    sendMessage
  } = useAssistantFlow();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    console.log('Submitting message:', inputMessage);
    await sendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
          >
            <div className={styles.messageContent}>
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className={`${styles.message} ${styles.assistantMessage}`}>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                Assistant is typing...
                <span className={styles.typingDots}>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {products.length > 0 && (
          <div className={`${styles.message} ${styles.assistantMessage}`}>
            <div className={styles.messageContent}>
              Here are some products I found...
            </div>
            <div className={styles.recommendations}>
              {products.map(product => (
                <div key={product.id} className={styles.productCard}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className={styles.price}>${parseFloat(product.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className={styles.messageInput}
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className={styles.sendButton}
        >
          Send
        </button>
      </form>
    </div>
  );
} 
