'use client'

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';


//For type sugegstions. Baad mein kaam ayega
interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    sender:{
        id: string;
        name: string;
        image?: string;
    };
}


export default function chatPage(){

    //ye bohot complicated hone vala hai so I will break this down into steps

    //getting current logged in user & the chat id
    const {data: session} = useSession();
    const chatId = useParams().chatId;

    //states
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatData, setChatData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    //initializing the websocket client
    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
            path: '/api/socketio',
        });

        //when connected, joing the room having current chatid
        socketInstance.on('connect', () => {
            console.log('Connected to Socket');
            socketInstance.emit('join-chat', chatId);
        });
        
        

        //now handling the new messages
        socketInstance.on('new-message', (message: Message) => {
            setMessages(prev => [...prev, message]);
        });

        setSocket(socketInstance);

        //clean up function of the use effect - just diconnect
        return () =>  {
            socketInstance.disconnect();
        };

    }, [chatId]);

    //Now fetch the existing chat data & msgs
    useEffect(() => {

        const fetchChatData = async () => {
            try{
                const response = await fetch(`/api/chat/${chatId}`);
                if(response.ok){
                    const data = await response.json();
                    setChatData(data.chat);
                    setMessages(data.messages || []);
                }
            }catch(err){
                console.error('Error fetchingchat: ', err);
            }finally{
                setLoading(false);
            }
        };

        if(chatId){
            fetchChatData();
        }

    }, [chatId]);

    //And now FInally sending a message
    const sendMessage = async () => {
        if(!newMessage.trim() || !socket || !session?.user?.id || !chatData){
            return;
        }

        //figuring out who is the receiver
        const receiverId = (chatData.referralRequest.requesterId === session.user.id ? 
            chatData.referralRequest.employeeId : chatData.referralRequest.requesterId
        );

        const messageData = {
            chatId,
            senderId: session.user.id,
            receiverId,
            content: newMessage.trim(),
        };

        console.log('Sending message:', messageData);

        //sending the message (as per definition of the event in socket.io endpoint) to socket.io endpoint
        socket.emit('send-message', {
            chatId,
            senderId: session.user.id,
            receiverId,
            content: newMessage.trim(),
        });

        setNewMessage('');
    };

    if(loading){
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white pt-20">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-xl font-semibold">Chat</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                        message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === session?.user?.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/20 text-white'
                        }`}
                        >
                        <p className="text-sm font-medium">{message.sender.name}</p>
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex space-x-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                        }}
                    />
                    <Button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700">
                        <Send className="w-4 h-4" />
                    </Button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};