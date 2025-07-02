'use client'

import { useState } from 'react';
import { Button } from './button';
import { UploadIcon, FileTextIcon, EyeIcon } from 'lucide-react';

interface ResumeViewProps {
  userId: string;
  resumeUrl?: string;
}

export default function ResumeView({ userId, resumeUrl }: ResumeViewProps) {
  const [uploading, setUploading] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState(resumeUrl);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', userId);

    try {
      setUploading(true);
      const response = await fetch('/api/user/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentResumeUrl(data.resumeUrl);
      } else {
        alert('Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Error uploading resume');
    } finally {
      setUploading(false);
    }
  };

  const openResume = () => {
    if (currentResumeUrl) {
      window.open(currentResumeUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-80 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="text-center">
        <FileTextIcon className="w-12 h-12 text-white/60 mx-auto mb-2" />
        <h3 className="text-white font-semibold mb-1">Resume</h3>
        <p className="text-gray-400 text-sm">
          {currentResumeUrl ? 'Resume uploaded' : 'No resume uploaded'}
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        {currentResumeUrl && (
          <Button
            onClick={openResume}
            variant="secondary"
            className="w-full"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            View Resume
          </Button>
        )}

        <label className="w-full">
          <Button
            disabled={uploading}
            variant="outline"
            className="w-full cursor-pointer"
            asChild
          >
            <span>
              <UploadIcon className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : currentResumeUrl ? 'Update Resume' : 'Upload Resume'}
            </span>
          </Button>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Upload PDF only (Max 5MB)
      </p>
    </div>
  );
}