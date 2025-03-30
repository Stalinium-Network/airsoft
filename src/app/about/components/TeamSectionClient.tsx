'use client'

import TeamMemberCard from './TeamMemberCard';
import TeamJoinSection from './TeamJoinSection';
import { TeamMember } from './TeamSection';


interface TeamSectionClientProps {
  teamMembers: TeamMember[];
}

// Клиентский компонент, получающий предварительно загруженные данные о команде
export default function TeamSectionClient({ teamMembers }: TeamSectionClientProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <TeamMemberCard 
            key={member._id} 
            member={member} 
            index={index} 
          />
        ))}
      </div>
      
      <TeamJoinSection />
    </>
  );
}