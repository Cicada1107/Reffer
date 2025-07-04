'use client'

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import UserCard from '@/components/ui/user-card';
import { UserProfile } from '@/lib/types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState({
    company: '',
    role: '',
    jobId: ''
  });
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchParams.company.trim() || !searchParams.role.trim()) {
      alert('Please enter atleast company and role');
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        company: searchParams.company.trim(),
        role: searchParams.role.trim(),
        ...(searchParams.jobId && { jobId: searchParams.jobId.trim() })
      });

      const response = await fetch(`/api/search/users?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.users || []);
        setHasSearched(true);
      } else {
        console.error('Search failed');
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Search Form */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Search for Employees</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <Input
                value={searchParams.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Enter company name"
                className="bg-black/50 border-white/20 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Role *</label>
              <Input
                value={searchParams.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="Enter role title"
                className="bg-black/50 border-white/20 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Job ID (Optional)</label>
              <Input
                value={searchParams.jobId}
                onChange={(e) => handleInputChange('jobId', e.target.value)}
                placeholder="Enter job ID"
                className="bg-black/50 border-white/20 text-white"
              />
            </div>
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={loading || !searchParams.company.trim() || !searchParams.role.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Searching...' : 'Search Referrals'}
          </Button>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className='py-5'>
            <h2 className="text-2xl font-semibold mb-4">
              Search Results ({results.length} found)
            </h2>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((user) => (
                  <UserCard key={user.id} user={user} jobId={searchParams.jobId} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No employees found for this company and role.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}