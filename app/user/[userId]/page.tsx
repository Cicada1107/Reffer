'use client'

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Briefcase, Building, ExternalLink, FileText, Mail, MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";



//The type for the part of the profile that we will display publically - to not use sensitive info
interface PublicUserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  college?: string;
  branch?: string;
  degree?: string;
  company?: string;
  role?: string;
  linkedin?: string;
  resumeUrl?: string;
  createdAt: string;
}


export default function UserProfilePage(){
  const userId = useParams()?.userId as string;
  const router = useRouter();
  
  //states
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //fetch the user data from db
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/user/public-profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

        if (userId) {
      fetchUserProfile();
    }
  }, [userId]);


  //Now the UI
  if(loading){
    return (
      <div className="min-h-screen bg-black text-white pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(error || !profile){
    return (
      <div className="min-h-screen bg-black text-white pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The user profile you requested could not be found.'}</p>
          <Button onClick={() => router.back()} variant="secondary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-6">
            <img
              src={profile.image || '/default-avatar.png'}
              alt={profile.name}
              className="w-24 h-24 rounded-full border-2 border-purple-500/30 shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{profile.name}</h2>
              <div className="flex items-center text-gray-400 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                  {profile.email}
                </a>
              </div>
              {profile.linkedin && (
                <div className="flex items-center text-gray-400">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                Professional Information
              </h3>
              
              {profile.company && (
                <div className="flex items-center text-gray-300">
                  <Building className="w-5 h-5 mr-3 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Company</p>
                    <p className="font-medium">{profile.company}</p>
                  </div>
                </div>
              )}

              {profile.role && (
                <div className="flex items-center text-gray-300">
                  <Briefcase className="w-5 h-5 mr-3 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Role</p>
                    <p className="font-medium">{profile.role}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Educational Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                Educational Information
              </h3>
              
              {profile.college && (
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">College</p>
                    <p className="font-medium">{profile.college}</p>
                  </div>
                </div>
              )}

              {profile.branch && (
                <div>
                  <p className="text-sm text-gray-400">Branch</p>
                  <p className="font-medium text-gray-300">{profile.branch}</p>
                </div>
              )}

              {profile.degree && (
                <div>
                  <p className="text-sm text-gray-400">Degree</p>
                  <p className="font-medium text-gray-300">{profile.degree}</p>
                </div>
              )}
            </div>
          </div>

          {/* Resume Section */}
          {profile.resumeUrl && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Resume</h3>
              <Button
                onClick={() => window.open(profile.resumeUrl, '_blank')}
                variant="outline"
                className="border-purple-500/50 hover:bg-purple-500/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Resume
              </Button>
            </div>
          )}

          {/* Member Since */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-gray-500">
              Member since {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

