// Server component to fetch team data
import { Suspense } from 'react';
import TeamSectionClient from './TeamSectionClient';
import { desc } from 'framer-motion/client';

// Team member interface based on exact structure from API documentation
export interface TeamMember {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

// Function to fetch team members from the server
async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team`, {
      next: { revalidate: 3600 } // Revalidate once per hour (3600 seconds)
    });
    
    if (!res.ok) {
      console.error('Failed to fetch team data:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching team data:', error);
    return [];
  }
}

// Component for loading placeholder
function TeamSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl animate-pulse border border-gray-700">
          <div className="h-80 w-full bg-gray-700"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main server component
export default async function TeamSection() {
  // Fetch team members data
  const teamMembers = await getTeamMembers();

  
  return (
    <section className="py-20 px-4 w-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Our <span className="text-green-500">Commanders</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the experienced stalkers who make the Zone come alive.
          </p>
        </div>

        <Suspense fallback={<TeamSkeleton />}>
          <TeamSectionClient teamMembers={teamMembers} />
        </Suspense>
      </div>
    </section>
  );
}
