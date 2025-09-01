import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { chatApi } from '../services/api.js';
import ProductCard from './ProductCard.jsx';
import './ChatAssistant.css';

const ChatAssistant = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content:
        "Hi! I'm your shopping assistant. I can help you find products, answer questions about our inventory, and provide recommendations. What are you looking for today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatApi.processMessage(inputMessage, products);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        products: response.type === 'product_suggestion' ? response.products : null,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log('Error in chat:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='chat-assistant'>
      {/* Chat Toggle Button */}
      <button className='chat-toggle-btn' onClick={toggleChat} title={isOpen ? 'Minimize Chat' : 'Open Chat'}>
        {isOpen ? <Minimize2 size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className='chat-window'>
          <div className='chat-header'>
            <div className='chat-title'>
              <MessageCircle size={20} />
              <span>Shopping Assistant</span>
            </div>
            <button className='close-btn' onClick={toggleChat} title='Close Chat'>
              <X size={20} />
            </button>
          </div>

          <div className='chat-messages'>
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className='message-content'>{message.content}</div>
                {message.products && (
                  <div className='product-suggestions'>
                    <h4>Recommended Products:</h4>
                    <div className='suggested-products'>
                      {message.products.slice(0, 3).map((product) => (
                        <div key={product.item_id} className='suggested-product'>
                          <img src={product.image} alt={product.item_name} className='suggested-product-image' />
                          <div className='suggested-product-info'>
                            <h5>{product.item_name}</h5>
                            <p>${product.prices.sale_price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className='message-time'>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className='message bot'>
                <div className='typing-indicator'>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className='chat-input'>
            <input
              ref={inputRef}
              type='text'
              placeholder='Type your message...'
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className='message-input'
            />
            <button onClick={handleSendMessage} disabled={!inputMessage.trim()} className='send-btn'>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
