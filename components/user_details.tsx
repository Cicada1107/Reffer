'use client'

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import ResumeView from "./ui/resume-view";

interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  college?: string | null;
  branch?: string | null;
  phone?: string | null;
  degree?: string | null;
  company?: string;
  role?: string;
  linkedin?: string;
  resumeUrl?: string;
}

interface PersonalDetailsProps {
  user: UserProfile;
}

export default function UserDetails({ user }: PersonalDetailsProps) {
  const [profileData, setProfileData] = useState<UserProfile>(user);
  const [loading, setLoading] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingJob, setEditingJob] = useState(false);
  const [personalFormData, setPersonalFormData] = useState({
    phone: '',
    college: '',
    branch: '',
    degree: ''
  });
  const [jobFormData, setJobFormData] = useState({
    company: '',
    role: '',
    linkedin: ''
  });

  // Fetch data from db
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/user/profile?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData({ ...user, ...data });
          // Initialize form data
          setPersonalFormData({
            phone: data.phone || '',
            college: data.college || '',
            branch: data.branch || '',
            degree: data.degree || ''
          });
          setJobFormData({
            company: data.company || '',
            role: data.role || '',
            linkedin: data.linkedin || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile: ', error);
      } finally {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchUserProfile();
    }
  }, [user.id]);

  const handleUpdatePersonalDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id, 
          ...personalFormData 
        }),
      });
      
      if (response.ok) {
        const updated = await response.json();
        setProfileData(updated);
        setEditingPersonal(false);
      }
    } catch (error) {
      console.error('Error updating personal details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJobDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id, 
          ...jobFormData 
        }),
      });
      
      if (response.ok) {
        const updated = await response.json();
        setProfileData(updated);
        setEditingJob(false);
      }
    } catch (error) {
      console.error('Error updating job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', user.id);

    try {
      setLoading(true);
      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(prev => ({ ...prev, image: data.imageUrl }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelPersonalEdit = () => {
    setPersonalFormData({
      phone: profileData.phone || '',
      college: profileData.college || '',
      branch: profileData.branch || '',
      degree: profileData.degree || ''
    });
    setEditingPersonal(false);
  };

  const cancelJobEdit = () => {
    setJobFormData({
      company: profileData.company || '',
      role: profileData.role || '',
      linkedin: profileData.linkedin || ''
    });
    setEditingJob(false);
  };

  if (loading && !profileData.name) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white/10 rounded-xl backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex items-center p-2">
        {/* Profile Picture */}
        <div className="sm:w-1/4 w-full rounded-lg shadow-md backdrop-blur-md p-4">
          <div className="relative">
            <img
              src={profileData.image || '/default-avatar.png'}
              alt="Profile Picture"
              className="w-60 h-60 rounded-full border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors"
            />
            <label className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-colors">
              <PencilIcon className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Personal Details Card */}
        <div className="sm:w-3/4 w-full rounded-lg shadow-md backdrop-blur-md bg-white/10 border border-white/10 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-left font-bold text-white text-2xl">Personal Details</h1>
            <button
              onClick={() => editingPersonal ? cancelPersonalEdit() : setEditingPersonal(true)}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {editingPersonal ? <XIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-center w-full">
            {/* Column 1 */}
            <div className="flex flex-col gap-4 p-2 sm:w-1/2 w-full">
              <div>
                <label className="text-gray-300 text-sm">Name</label>
                <p className="text-white">{profileData.name}</p>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Email</label>
                <p className="text-white">{profileData.email}</p>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Phone</label>
                {editingPersonal ? (
                  <Input
                    value={personalFormData.phone}
                    onChange={(e) => setPersonalFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    className="bg-black/50 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white">{profileData.phone || 'Not Specified'}</p>
                )}
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4 p-2 sm:w-1/2 w-full">
              <div>
                <label className="text-gray-300 text-sm">College</label>
                {editingPersonal ? (
                  <Input
                    value={personalFormData.college}
                    onChange={(e) => setPersonalFormData(prev => ({ ...prev, college: e.target.value }))}
                    placeholder="Enter college name"
                    className="bg-black/50 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white">{profileData.college || 'Not Specified'}</p>
                )}
              </div>
              <div>
                <label className="text-gray-300 text-sm">Branch</label>
                {editingPersonal ? (
                  <Input
                    value={personalFormData.branch}
                    onChange={(e) => setPersonalFormData(prev => ({ ...prev, branch: e.target.value }))}
                    placeholder="Enter branch"
                    className="bg-black/50 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white">{profileData.branch || 'Not Specified'}</p>
                )}
              </div>
              <div>
                <label className="text-gray-300 text-sm">Degree</label>
                {editingPersonal ? (
                  <Input
                    value={personalFormData.degree}
                    onChange={(e) => setPersonalFormData(prev => ({ ...prev, degree: e.target.value }))}
                    placeholder="Enter degree"
                    className="bg-black/50 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white">{profileData.degree || 'Not Specified'}</p>
                )}
              </div>
            </div>
          </div>

          {editingPersonal && (
            <div className="flex gap-3 mt-4 justify-end">
              <Button
                onClick={handleUpdatePersonalDetails}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={cancelPersonalEdit}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Job Details Card */}
      <div className="w-full flex mt-2 items-center rounded-lg shadow-md backdrop-blur-md bg-white/10 border border-white/10 p-4">
        <div className="sm:w-3/4 w-full flex flex-col p-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-left font-bold text-white text-2xl">Job Details</h1>
            <button
              onClick={() => editingJob ? cancelJobEdit() : setEditingJob(true)}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {editingJob ? <XIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm">Current Company</label>
              {editingJob ? (
                <Input
                  value={jobFormData.company}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Enter company name"
                  className="bg-black/50 border-white/20 text-white"
                />
              ) : (
                <p className="text-white">{profileData.company || 'Not Specified'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-300 text-sm">Current Role</label>
              {editingJob ? (
                <Input
                  value={jobFormData.role}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Enter your role"
                  className="bg-black/50 border-white/20 text-white"
                />
              ) : (
                <p className="text-white">{profileData.role || 'Not Specified'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-300 text-sm">LinkedIn Profile</label>
              {editingJob ? (
                <Input
                  value={jobFormData.linkedin}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="bg-black/50 border-white/20 text-white"
                />
              ) : (
                <p className="text-white">
                  {profileData.linkedin ? (
                    <a 
                      href={profileData.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {profileData.linkedin}
                    </a>
                  ) : (
                    'Not Specified'
                  )}
                </p>
              )}
            </div>
          </div>

          {editingJob && (
            <div className="flex gap-3 mt-4 justify-end">
              <Button
                onClick={handleUpdateJobDetails}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={cancelJobEdit}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="sm:w-1/4 w-full">
          <ResumeView userId={user.id} resumeUrl={profileData.resumeUrl} />
        </div>
      </div>
    </>
  );
}