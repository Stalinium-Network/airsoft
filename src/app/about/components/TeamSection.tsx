// Server component to fetch team data
import { Suspense } from 'react';
import Image from 'next/image';
import TeamMemberClientComponent from './TeamMemberClientComponent';

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
        <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-xl animate-pulse">
          <div className="h-80 w-full bg-gray-700"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
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
  
  // Process data - ensure consistent image URLs
  const processedTeamMembers = teamMembers.map(member => ({
    _id: member._id,
    name: member.name,
    description: member.description || '',
    image: member.image,
    // Format image URL based on source
    imageUrl: member.image.startsWith('/') 
      ? member.image 
      : `${process.env.NEXT_PUBLIC_API_URL}/team/image/${member.image}`
  }));
  
  return (
    <Suspense fallback={
      <section className="py-20 px-4 w-screen">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">OUR <span className="text-green-500">TEAM</span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the experienced stalkers who make the Zone come alive.
            </p>
          </div>
          <TeamSkeleton />
        </div>
      </section>
    }>
      <section className="py-20 px-4 w-screen">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">OUR <span className="text-green-500">TEAM</span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the experienced stalkers who make the Zone come alive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processedTeamMembers.map((member, index) => (
              <TeamMemberClientComponent 
                key={member._id} 
                member={member} 
                index={index} 
              />
            ))}
          </div>

          <div className="mt-20 text-center bg-gray-800 p-10 rounded-lg shadow-lg border-t-4 border-green-500">
            <h3 className="text-2xl font-bold mb-6">JOIN OUR FACTION</h3>
            <p className="text-gray-300 max-w-3xl mx-auto mb-8 text-lg">
              We're always looking for passionate stalkers to join our team. If you have skills in prop-making, scenario design, or event management, reach out to us.
            </p>
            <button className="px-10 py-4 bg-green-500 text-gray-900 font-bold rounded-md text-lg hover:bg-green-400 transition-colors shadow-lg">
              CONTACT US
            </button>
          </div>
        </div>
      </section>
    </Suspense>
  );
}
