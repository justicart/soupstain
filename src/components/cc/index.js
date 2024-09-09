import './style.css';
import React from 'react';

export default function ChatApp() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const chatAreaRef = React.useRef(null);

  React.useEffect(() => {
      if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }
  }, [messages]);

  const handleSubmit = (e) => {
      e.preventDefault();
      if (input.trim()) {
          const maskedMessage = maskCreditCardNumbers(input);
          setMessages(prevMessages => [...prevMessages, maskedMessage]);
          setInput('');
      }
  };

  const maskCreditCardNumbers = (text) => {
      return text.replace(/\b(?:\d{4}[-\s]?){3}\d{4}\b/g, match => {
          if (validateCreditCard(match.replace(/[-\s]/g, ''))) {
              return '*'.repeat(match.length);
          }
          return match;
      });
  };

  const validateCreditCard = (number) => {
      let sum = 0;
      let isEven = false;
      for (let i = number.length - 1; i >= 0; i--) {
          let digit = parseInt(number.charAt(i), 10);
          if (isEven) {
              digit *= 2;
              if (digit > 9) {
                  digit -= 9;
              }
          }
          sum += digit;
          isEven = !isEven;
      }
      return (sum % 10) === 0;
  };

  return (
    <div className="chat-container">
      <div className="chat-area" ref={chatAreaRef}>
      <div className="message received">Did you know that if you type your credit card number, this chat will show *s instead of the numbers?</div>
        {messages.map((msg, index) => (
          <div key={index} className="message">{msg}</div>
        ))}
      </div>
      <form className="input" onSubmit={handleSubmit}>
        <input
          className="prompt"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}