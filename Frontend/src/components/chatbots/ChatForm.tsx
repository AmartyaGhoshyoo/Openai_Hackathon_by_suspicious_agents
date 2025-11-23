/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { div, span } from "motion/react-client";
import { usegenerateMd5 } from "../hooks/usegenerateMd5";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  type: "user" | "bot";
}

// Hook for Storage management
const useLocalStorage = (key: string) => {
  const loadMessages = (): Message[] => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
    return [];
  };

  const saveMessages = (messages: Message[]) => {
    if (messages.length > 0) {
      localStorage.setItem(key, JSON.stringify(messages));
    } else {
      localStorage.removeItem(key);
    }
  };

  return { loadMessages, saveMessages };
};

// Chat Header Component
const ChatHeader = ({ onClear }: { onClear: () => void }) => (
  <div className="flex items-center justify-between p-6 border-b border-white/10">
    <h1 className="text-2xl font-light">Messages</h1>
    <Button
      onClick={onClear}
      variant="outline"
      size="sm"
      className="bg-black border-white/20 hover:bg-white/5 text-white h-9 px-3"
    >
      <Trash2 className="w-4 h-4 mr-2" />
      Clear
    </Button>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center">
    <p className="text-white/50 text-lg font-light">Start a conversation</p>
  </div>
);

// Message Avatar Component
const MessageAvatar = ({ type }: { type: "user" | "bot" }) => {
  const { login, img, name } = useSelector(
    (state: RootState) => state.loginuserSlice
  );

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 overflow-hidden ${
        type === "user"
          ? "bg-white text-black"
          : "bg-black border border-white/20 text-white"
      }`}
    >
      {type === "user" ? (
        <img 
          className="w-full h-full object-cover" 
          src={login ? img : "/user_avatar.png"} 
          alt="user_img"
        />
      ) : (
        <img 
          className="w-full h-full object-cover" 
          src="/bot_avatar.png" 
          alt="bot_avatar" 
        />
      )}
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({
  message,
  isUser,
}: {
  message: Message;
  isUser: boolean;
}) => (
  <div
    className={`px-4 py-3 rounded-2xl max-w-md ${
      isUser
        ? "bg-white text-black rounded-tr-sm"
        : "bg-black border border-white/20 text-white rounded-tl-sm"
    }`}
  >
    <p className="text-base leading-relaxed">{message.text}</p>
  </div>
);

// Message Timestamp Component
const MessageTimestamp = ({
  timestamp,
  isUser,
}: {
  timestamp: Date;
  isUser: boolean;
}) => (
  <span
    className={`text-xs text-white/40 mt-2 block ${
      isUser ? "text-right" : "text-left"
    }`}
  >
    {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
  </span>
);

// Individual Message Component
const MessageItem = ({ message }: { message: Message }) => {
  const isUser = message.type === "user";

  return (
    <div
      className={`flex gap-3 mb-8 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <MessageAvatar type={message.type} />
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <MessageBubble message={message} isUser={isUser} />
        <MessageTimestamp timestamp={message.timestamp} isUser={isUser} />
      </div>
    </div>
  );
};

// Messages List Component
const MessagesList = ({
  messages,
  isloading,
}: {
  messages: Message[];
  isloading: boolean;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isloading && (
        <div className="flex space-x-3 p-3">
          {/* Chat avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>

          {/* Chat bubble placeholder */}
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded bg-gray-300 animate-pulse"></div>
            <div className="h-3 w-1/2 rounded bg-gray-300 animate-pulse"></div>
            <div className="h-3 w-2/3 rounded bg-gray-300 animate-pulse"></div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

// Chat Input Component
const ChatInput = ({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: (key: string) => void;
  disabled: boolean;
}) => {
  const { session_key } = usegenerateMd5();
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(session_key);
    }
  };

  return (
    <div className="p-6 border-t border-white/10">
      <div className="flex items-end gap-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-black border-white/20 text-white placeholder-white/50 focus:border-white h-12 text-base px-4"
          placeholder="Type your message..."
        />
        <Button
          onClick={() => onSend(session_key)}
          disabled={disabled}
          className="bg-white hover:bg-white/90 disabled:bg-white/20 text-black disabled:text-white/40 h-12 w-12 p-0 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

// Floating Suggestions Component
const FloatingSuggestions = ({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) => {
  const suggestions = [
    "Take me to the pricing section",
    "Show me the API guide",
    "Take me to documentation",
    "Find me about Geoffrey Hinton from wikipedia",
    "Explain this page",
    "What can you do?"
  ];

  return (
    <div className="px-6 pb-4 flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-4 py-2 text-sm bg-black border border-white/20 text-white/70 rounded-full hover:bg-white/5 hover:text-white hover:border-white/40 transition-all duration-200"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

// Main Chat Form Component
const ChatForm = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { loadMessages, saveMessages } = useLocalStorage(
    "elevenlabs-chat-messages"
  );
  const [isloading, setIsloading] = useState(false);
  const router = useRouter();

  // Load messages on mount
  useEffect(() => {
    setMessages(loadMessages());
  }, []);

  // Save messages when they change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const handleSendMessage = async (session_key: string) => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      timestamp: new Date(),
      type: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    try {
      setIsloading(true);
      let rawUrl = "";
      const params = new URLSearchParams(window.location.search);

      if (params.has("url")) {
        rawUrl = decodeURIComponent(params.get("url") || "");
      } else {
        rawUrl = window.location.href;
      }

      const res = await fetch(
        "https://gpt-qa.parentune.com/chat/agentic_webpilot_modified/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "session-key": session_key || "",
          },
          body: JSON.stringify({
            message: userText,
            current_url: rawUrl,
          }),
        }
      );

      const data = await res.json();
      setIsloading(false);

      // Handle rate limiting and error responses
      if (res.status === 429 || res.status === 400 || res.status === 500) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response || "An error occurred. Please try again.",
          timestamp: new Date(),
          type: "bot",
        };
        setMessages((prev) => [...prev, botResponse]);
        return;
      }

      // Extract best_url and response from the new backend format
      const bestUrl = data.best_url || "";
      const responseText = data.response || "";

      // If best_url is provided and not empty, navigate
      if (bestUrl && bestUrl.trim() !== "") {
        try {
          const parsed = new URL(bestUrl, window.location.origin);
          if (parsed.origin === window.location.origin) {
            // Internal link → SPA navigate
            router.push(parsed.pathname + parsed.search + parsed.hash);
          } else {
            // External link → reader
            const readerParams = new URLSearchParams({ url: parsed.toString() });
            router.push(`/reader?${readerParams.toString()}`);
          }
        } catch {
          // Fallback if URL parsing fails
          const readerParams = new URLSearchParams({ url: bestUrl });
          router.push(`/reader?${readerParams.toString()}`);
        }
      }

      // Add bot response to chat
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText || "I've processed your request.",
        timestamp: new Date(),
        type: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (e) {
      setIsloading(false);
      const errResponse: Message = {
        id: (Date.now() + 2).toString(),
        text: "Error contacting server. Please try again.",
        timestamp: new Date(),
        type: "bot",
      };
      setMessages((prev) => [...prev, errResponse]);
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setInputValue(suggestionText);
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      <ChatHeader onClear={handleClearMessages} />
      <MessagesList messages={messages} isloading={isloading} />
      {messages.length === 0 && !isloading && (
        <FloatingSuggestions onSuggestionClick={handleSuggestionClick} />
      )}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={!inputValue.trim()}
      />
    </div>
  );
};

export default ChatForm;