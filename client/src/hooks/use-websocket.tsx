import { useState, useEffect, useRef, useCallback } from "react";

interface WebSocketMessage {
  type: string;
  data?: any;
  room?: string;
  username?: string;
  message?: string;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          setMessages(prev => [...prev, data.data]);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const joinRoom = useCallback((room: string) => {
    sendMessage({ type: 'join_room', room });
  }, [sendMessage]);

  const sendChatMessage = useCallback((room: string, username: string, message: string) => {
    sendMessage({ type: 'chat', room, username, message });
  }, [sendMessage]);

  return {
    isConnected,
    messages,
    sendChatMessage,
    joinRoom,
    setMessages,
  };
}
