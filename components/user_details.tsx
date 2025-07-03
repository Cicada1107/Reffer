'use client'

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import ResumeView from "./ui/resume-view";
import ProfileImage from "./ui/profile-image";

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
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white/10 rounded-xl backdrop-blur-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full" />
            <div className="space-y-2 text-center sm:text-left">
              <Skeleton className="h-6 w-[200px] sm:w-[250px]" />
              <Skeleton className="h-4 w-[150px] sm:w-[200px]" />
              <Skeleton className="h-4 w-[100px] sm:w-[150px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Profile Header Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Picture */}
        <div className="flex justify-center lg:justify-start lg:items-stretch">
          <div className="rounded-xl p-4 sm:p-6 flex items-center justify-center lg:w-auto lg:min-w-0">
            <div className="relative">
              <ProfileImage
                src={profileData.image}
                alt={profileData.name || 'Profile Picture'}
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-70 lg:h-70 rounded-full border-4 border-white/20 cursor-pointer hover:border-white/40 transition-colors"
                fallbackClassName="w-32 h-32 sm:w-40 sm:h-40 lg:w-70 lg:h-70 rounded-full border-4 border-white/20 cursor-pointer hover:border-white/40 transition-colors text-2xl sm:text-3xl lg:text-4xl"
              />
              <label className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-purple-600 hover:bg-purple-700 text-white p-2 sm:p-3 rounded-full cursor-pointer transition-colors shadow-lg">
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
        </div>

        {/* Personal Details Card */}
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Personal Details</h1>
            <button
              onClick={() => editingPersonal ? cancelPersonalEdit() : setEditingPersonal(true)}
              className="text-white hover:text-purple-400 transition-colors self-start sm:self-auto"
            >
              {editingPersonal ? <XIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1">Name</label>
                <p className="text-white">{profileData.name}</p>
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1">Email</label>
                <p className="text-white break-all">{profileData.email}</p>
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1">Phone</label>
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
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1">College</label>
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
                <label className="text-gray-300 text-sm block mb-1">Branch</label>
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
                <label className="text-gray-300 text-sm block mb-1">Degree</label>
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
            <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-end">
              <Button
                onClick={handleUpdatePersonalDetails}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 order-2 sm:order-1"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={cancelPersonalEdit}
                variant="secondary"
                className="order-1 sm:order-2"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Job Details Section */}
      <div className="flex flex-col xl:flex-row gap-6 xl:items-stretch">
        {/* Job Details Card */}
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Job Details</h1>
            <button
              onClick={() => editingJob ? cancelJobEdit() : setEditingJob(true)}
              className="text-white hover:text-purple-400 transition-colors self-start sm:self-auto"
            >
              {editingJob ? <XIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="text-gray-300 text-sm block mb-1">Current Company</label>
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
              <label className="text-gray-300 text-sm block mb-1">Current Role</label>
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
              <label className="text-gray-300 text-sm block mb-1">LinkedIn Profile</label>
              {editingJob ? (
                <Input
                  value={jobFormData.linkedin}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="bg-black/50 border-white/20 text-white"
                />
              ) : (
                <p className="text-white break-all">
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
            <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-end">
              <Button
                onClick={handleUpdateJobDetails}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 order-2 sm:order-1"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={cancelJobEdit}
                variant="secondary"
                className="order-1 sm:order-2"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Resume Section*/}
        <div className="xl:w-80 xl:flex xl:flex-col">
          <div className="flex-1">
            <ResumeView userId={user.id} resumeUrl={profileData.resumeUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}