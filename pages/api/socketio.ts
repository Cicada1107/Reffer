import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiResponseServerIO } from '@/lib/socket';
import {prisma} from "@/lib/prisma"

export default async function ioHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (!res.socket.server.io) {
    console.log('Starting Socket.IO server...');
    
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
      cors: {
        //@ts-ignore
        origin: "https://reffer-sigma.vercel.app",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-chat', (chatId: string) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat ${chatId}`);
      });

      socket.on('send-message', async (data) => {
        const { chatId, senderId, receiverId, content } = data;
        
        try {
          // Save message to database
          const message = await prisma.message.create({
            data: {
              chatId,
              senderId,
              receiverId,
              content,
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                }
              }
            }
          });

          // Broadcast to chat room
          io.to(chatId).emit('new-message', message);
        } catch (error) {
          console.error('Error saving message:', error);
          socket.emit('error', 'Failed to send message');
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}