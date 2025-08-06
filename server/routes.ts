import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat messages API
  app.get("/api/chat/:room", async (req, res) => {
    try {
      const { room } = req.params;
      const messages = await storage.getChatMessages(room);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat') {
          // Validate message data
          const validatedMessage = insertChatMessageSchema.parse({
            room: message.room,
            username: message.username,
            message: message.message,
          });

          // Store the message
          const savedMessage = await storage.addChatMessage(validatedMessage);

          // Broadcast to all connected clients
          const broadcastData = JSON.stringify({
            type: 'chat',
            data: savedMessage,
          });

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastData);
            }
          });
        } else if (message.type === 'join_room') {
          // Handle room joining (could store user-room mappings in the future)
          ws.send(JSON.stringify({
            type: 'room_joined',
            room: message.room,
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
        }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}
