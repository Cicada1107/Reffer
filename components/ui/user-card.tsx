'use client'

import { useState } from 'react';
import { Button } from './button';
import { MapPin, Building, Briefcase, MessageCircle } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface UserCardProps {
  user: UserProfile;
  jobId?: string;
}

export default function UserCard({ user, jobId }: UserCardProps) {
  const [requesting, setRequesting] = useState(false);

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
        alert('Referral request sent successfully!');
      } else {
        alert('Failed to send referral request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending referral request');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/15 transition-colors">
      {/* Profile Section */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={user.image || '/default-avatar.png'}
          alt={user.name || 'User'}
          className="w-16 h-16 rounded-full border-2 border-white/20"
        />
        <div>
          <h3 className="text-lg font-semibold text-white">{user.name}</h3>
          <p className="text-gray-400 text-sm">{user.email}</p>
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
      <div className="flex space-x-2">
        <Button
          onClick={handleRequestReferral}
          disabled={requesting}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {requesting ? 'Sending...' : 'Request Referral'}
        </Button>
        
        <Button
          variant="secondary"
          className="px-3"
          title="Chat"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}