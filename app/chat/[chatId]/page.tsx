'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, ArrowLeft, MoreVertical, Phone, Video, User, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import io, { Socket } from 'socket.io-client';

//For type suggestions. Baad mein kaam ayega
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
    const chatId = useParams()?.chatId;
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    //states
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatData, setChatData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [concluding, setConcluding] = useState(false);

    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    // Get other participant info
    const getOtherParticipant = () => {
        if (!chatData || !session?.user?.id) return null;
        
        return chatData.referralRequest.requesterId === session.user.id 
            ? chatData.referralRequest.employee 
            : chatData.referralRequest.requester;
    };

    const otherParticipant = getOtherParticipant();

    const handleProfileClick = () => {
        if (otherParticipant) {
            router.push(`/user/${otherParticipant.id}`);
        }
    };

    const handleConcludeRequest = async () => {
        if (!chatData?.referralRequest?.id) return;

        setConcluding(true);
        try {
            const response = await fetch('/api/referral/conclude', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    referralRequestId: chatData.referralRequest.id,
                }),
            });

            if (response.ok) {
                // Update the local chat data to reflect the concluded status
                setChatData(prev => ({
                    ...prev,
                    referralRequest: {
                        ...prev.referralRequest,
                        status: 'CONCLUDED'
                    }
                }));
                alert('Referral request concluded successfully!');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to conclude referral request');
            }
        } catch (error) {
            console.error('Error concluding request:', error);
            alert('Error concluding referral request');
        } finally {
            setConcluding(false);
        }
    };

    if(loading){
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-20">
                <div className="max-w-5xl mx-auto px-4 h-[calc(100vh-5rem)]">
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl h-full flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-800/50">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-3 w-[120px]" />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6">
                            <div className="space-y-4">
                                {[1,2,3].map((i) => (
                                    <div key={i} className="flex space-x-3">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <Skeleton className="h-16 w-[250px] rounded-2xl" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-3 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-20">
            <div className="max-w-5xl mx-auto px-4 h-[calc(100vh-5rem)]">
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl h-full flex flex-col shadow-2xl overflow-hidden">
                    
                    {/* Modern Chat Header */}
                    <div className="p-6 border-b border-gray-800/50 bg-gradient-to-r from-gray-800/30 to-gray-900/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.back()}
                                    className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="relative group">
                                        <img
                                            src={otherParticipant?.image || '/default-avatar.png'}
                                            alt={otherParticipant?.name || 'User'}
                                            className="w-12 h-12 rounded-full border-2 border-purple-500/30 shadow-lg cursor-pointer hover:border-purple-500/60 transition-colors"
                                            onClick={handleProfileClick}
                                            title="View profile"
                                        />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">
                                            {otherParticipant?.name || 'Chat Partner'}
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            {otherParticipant?.role && otherParticipant?.company 
                                                ? `${otherParticipant.role} at ${otherParticipant.company}`
                                                : 'Online'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full"
                                >
                                    <Phone className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full"
                                >
                                    <Video className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Add Conclude Request Button */}
                        {chatData?.referralRequest?.status === 'PENDING' && (
                            <div className="mt-4 flex justify-center">
                                <Button
                                    onClick={handleConcludeRequest}
                                    disabled={concluding}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{concluding ? 'Concluding...' : 'Conclude Request'}</span>
                                </Button>
                            </div>
                        )}
                        
                        {/* Show status if concluded */}
                        {chatData?.referralRequest?.status === 'CONCLUDED' && (
                            <div className="mt-4 flex justify-center">
                                <div className="bg-green-600/20 border border-green-500/30 rounded-lg px-4 py-2 flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400 text-sm">Request Concluded</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modern Messages Container */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                                    <Send className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">Start the conversation</h3>
                                <p className="text-gray-500">Send your first message to get started!</p>
                            </div>
                        ) : (
                            messages.map((message, index) => {
                                const isCurrentUser = message.senderId === session?.user?.id;
                                const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                                
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex items-end space-x-3 ${
                                            isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            {showAvatar ? (
                                                <div className="relative group">
                                                    <img
                                                        src={message.sender.image || '/default-avatar.png'}
                                                        alt={message.sender.name}
                                                        className="w-8 h-8 rounded-full border border-gray-700 cursor-pointer hover:border-purple-500/50 transition-colors"
                                                        onClick={() => router.push(`/user/${message.sender.id}`)}
                                                        title="View profile"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <User className="w-3 h-3 text-white" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8"></div>
                                            )}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`flex flex-col max-w-xs lg:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                            {showAvatar && (
                                                <p className="text-xs text-gray-500 mb-1 px-3">
                                                    {message.sender.name}
                                                </p>
                                            )}
                                            
                                            <div
                                                className={`px-4 py-3 rounded-2xl shadow-lg relative ${
                                                    isCurrentUser
                                                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                                                        : 'bg-gray-800/70 backdrop-blur-sm text-gray-100 border border-gray-700/50'
                                                }`}
                                            >
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                
                                                {/* Message tail */}
                                                <div className={`absolute bottom-0 ${
                                                    isCurrentUser 
                                                        ? 'right-0 transform translate-x-1/2' 
                                                        : 'left-0 transform -translate-x-1/2'
                                                } w-0 h-0 border-l-4 border-r-4 border-t-4 ${
                                                    isCurrentUser 
                                                        ? 'border-l-transparent border-r-purple-500 border-t-purple-500'
                                                        : 'border-r-transparent border-l-gray-800 border-t-gray-800'
                                                }`}></div>
                                            </div>
                                            
                                            <p className="text-xs text-gray-500 mt-1 px-3">
                                                {new Date(message.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Modern Message Input */}
                    <div className="p-6 border-t border-gray-800/50 bg-gradient-to-r from-gray-800/20 to-gray-900/20">
                        <div className="flex items-end space-x-4">
                            <div className="flex-1 relative">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 rounded-2xl py-3 px-4 pr-12 resize-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                />
                            </div>
                            
                            <Button 
                                onClick={sendMessage}
                                disabled={!newMessage.trim()}
                                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-2xl px-6 py-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};