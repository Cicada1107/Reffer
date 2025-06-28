export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  college?: string | null;
  branch?: string | null;
  phone?: string | null;
  degree?: string | null;
  company?: string | null;
  role?: string | null;
  linkedin?: string | null;
  resumeUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}