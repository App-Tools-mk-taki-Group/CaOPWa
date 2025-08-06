import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";

interface ChatMessage {
  id: string;
  room: string;
  username: string;
  message: string;
  timestamp: string;
}

export default function Chat() {
  const [currentRoom, setCurrentRoom] = useState("general");
  const [inputMessage, setInputMessage] = useState("");
  const [username] = useState("User" + Math.floor(Math.random() * 1000));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isConnected, messages: wsMessages, sendChatMessage, joinRoom, setMessages } = useWebSocket();

  // Fetch existing messages for the current room
  const { data: existingMessages } = useQuery({
    queryKey: ["/api/chat", currentRoom],
    enabled: !!currentRoom,
  });

  useEffect(() => {
    if (existingMessages) {
      setMessages(existingMessages);
    }
  }, [existingMessages, setMessages]);

  useEffect(() => {
    joinRoom(currentRoom);
  }, [currentRoom, joinRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [wsMessages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && isConnected) {
      sendChatMessage(currentRoom, username, inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const rooms = [
    { id: "general", name: "General" },
    { id: "tech", name: "Tech" },
    { id: "space", name: "Space" },
  ];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvatarColor = (username: string) => {
    const colors = ["bg-[hsl(174,100%,70%)]", "bg-[hsl(39,95%,65%)]", "bg-blue-500", "bg-green-500", "bg-purple-500"];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="glass-morphism rounded-xl p-6 h-[600px] flex flex-col" data-testid="chat-component">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <MessageCircle className="cosmic-accent mr-3" size={20} />
        Cosmic Chat
        <span className={`ml-auto text-sm px-2 py-1 rounded-full ${isConnected ? 'bg-[hsl(174,100%,70%)] text-[hsl(217,41%,11%)]' : 'bg-red-500 text-white'}`} data-testid="connection-status">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </h2>
      
      {/* Chat Rooms */}
      <div className="flex space-x-2 mb-4">
        {rooms.map((room) => (
          <Button
            key={room.id}
            variant={currentRoom === room.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentRoom(room.id)}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
              currentRoom === room.id 
                ? "bg-[hsl(174,100%,70%)] text-[hsl(217,41%,11%)]" 
                : "cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)] border-[hsl(174,100%,70%)] border-opacity-30"
            }`}
            data-testid={`button-room-${room.id}`}
          >
            {room.name}
          </Button>
        ))}
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2" data-testid="chat-messages">
        {wsMessages
          .filter((msg: ChatMessage) => msg.room === currentRoom)
          .map((message: ChatMessage) => (
            <div key={message.id} className="chat-message max-w-[80%] word-wrap break-word" data-testid={`message-${message.id}`}>
              <div className="flex items-start space-x-2">
                <div className={`w-8 h-8 ${getAvatarColor(message.username)} rounded-full flex items-center justify-center text-[hsl(217,41%,11%)] text-xs font-bold`}>
                  {message.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium cosmic-accent" data-testid={`username-${message.id}`}>
                      {message.username}
                    </span>
                    <span className="text-xs cosmic-text opacity-50" data-testid={`timestamp-${message.id}`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm cosmic-text" data-testid={`content-${message.id}`}>
                    {message.message}
                  </div>
                </div>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="flex space-x-2">
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 cosmic-blue border border-[hsl(174,100%,70%)] border-opacity-30 rounded-lg px-4 py-2 cosmic-text placeholder:text-[hsl(217,32%,91%)] placeholder:opacity-50 focus:outline-none focus:border-[hsl(174,100%,70%)]"
          data-testid="input-chat-message"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!isConnected || !inputMessage.trim()}
          className="bg-[hsl(174,100%,70%)] text-[hsl(217,41%,11%)] px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all disabled:opacity-50"
          data-testid="button-send-message"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
