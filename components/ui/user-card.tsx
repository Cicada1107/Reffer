'use client'

import { useState } from 'react';
import { Button } from './button';
import { MapPin, Building, Briefcase, MessageCircle, Send, User } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';
import ProfileImage from './profile-image';

interface UserCardProps {
  user: UserProfile;
  jobId?: string;
}

export default function UserCard({ user, jobId }: UserCardProps) {
  const [requesting, setRequesting] = useState(false);
  const [ hasRequested, setHasRequested ] = useState(false);
  const [ chatId, setChatId ] = useState<string | null>(null);
  const router = useRouter();

  const handleRequestReferral = async () => {
    setRequesting(true);
    try {
      const response = await fetch('/api/referral/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referrerId: user.id,
          jobId: jobId || '',
          message: `Hi ${user.name}, I would like to request a referral for the ${user.role} position at ${user.company}.`
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Referral request sent successfully!');
        setChatId(result.data.chatId);
        setHasRequested(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to send referral request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending referral request');
    } finally {
      setRequesting(false);
    }
  };

  const handleChatClick = () => {
    if(chatId){
      router.push(`/chat/${chatId}`);
    }
  };

  const handleProfileClick = () => {
    console.log('Profile clicked for user:', user.id);
    router.push(`/user/${user.id}`);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/15 transition-colors">
      <div className="flex items-center space-x-4 mb-4 ">
        <div 
          className="relative group cursor-pointer"
          onClick={handleProfileClick}
          title="View profile"
        >
          <ProfileImage
            src={user.image}
            alt={user.name || 'User'}
            className="w-16 h-16 rounded-full border-2 border-white/20 hover:border-purple-500/50 transition-colors"
          />
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{user.name}</h3>
          <p className="text-gray-400 text-sm break-all hover:underline">
            <a href={`mailto:${user.email}`} className="break-all">
              {user.email}
            </a>
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-2 mb-4">
        {user.company && (
          <div className="flex items-center text-gray-300 text-sm">
            <Building className="w-4 h-4 mr-2" />
            {user.company}
          </div>
        )}
        
        {user.role && (
          <div className="flex items-center text-gray-300 text-sm">
            <Briefcase className="w-4 h-4 mr-2" />
            {user.role}
          </div>
        )}
        
        {user.college && (
          <div className="flex items-center text-gray-300 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {user.college}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center">
        {!hasRequested ? (
          <Button
            onClick={handleRequestReferral}
            disabled={requesting}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Send className='w-4 h-4' /> {requesting ? 'Sending...' : 'Request Referral'}
          </Button>
        ) : (
          <Button
            onClick={handleChatClick}
            className="flex-1 bg-gray-600 hover:bg-gray-700"
            title="Chat with this employee"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className='font-medium text-white'>Chat</span>
          </Button>
        )}
      </div>
    </div>
  );
}