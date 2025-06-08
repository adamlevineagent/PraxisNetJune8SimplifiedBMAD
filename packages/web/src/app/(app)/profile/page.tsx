import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PositionMatrix } from '@/features/onboard/PositionMatrix';

// Mock data for demonstration
const mockUser = {
  handle: "builder_42",
  disclosureLevel: "OPEN" as const,
  status: "APPROVED" as const
};

const mockOpportunities = [
  {
    id: "opp-1",
    summary: "Looking for a technical co-founder with expertise in distributed systems and blockchain technology for an open protocol project.",
    status: "PENDING" as const,
    targetUser: {
      handle: "protocol_visionary",
      disclosureLevel: "OPEN" as const
    },
    createdAt: "2025-06-05T12:00:00Z"
  },
  {
    id: "opp-2",
    summary: "Seeking UI/UX designer for collaboration on a new decentralized social platform focused on creative communities.",
    status: "PENDING" as const,
    targetUser: {
      handle: "design_specialist",
      disclosureLevel: "OPEN" as const
    },
    createdAt: "2025-06-06T09:30:00Z"
  },
  {
    id: "opp-3",
    summary: "Angel investor interested in funding open-source tools that enhance collaborative workflows for distributed teams.",
    status: "PENDING" as const,
    targetUser: {
      handle: "anonymous",
      disclosureLevel: "STEALTH" as const
    },
    createdAt: "2025-06-06T15:45:00Z"
  }
];

const mockPositionMatrix = {
  archetype: "BUILDER",
  skills: ["Python", "System Architecture", "Distributed Systems", "Smart Contracts"],
  projects: [
    {
      name: "Open Protocol Initiative",
      description: "Building open standards for decentralized communication",
      url: "https://example.com/project"
    }
  ],
  goals: "Looking for technical co-founders with expertise in distributed systems and funding for early-stage development.",
  idealCollaborator: "Someone with strong technical skills and shared values around open systems and decentralization.",
  notes: "Passionate about building tools that enable new forms of collaboration and coordination."
};

export default function ProfilePage() {
  const [user] = useState(mockUser);
  const [opportunities] = useState(mockOpportunities);
  const [positionMatrix] = useState(mockPositionMatrix);
  
  return (
    <div className="min-h-screen bg-background-primary">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-background-secondary">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-accent-primary">Praxis Network</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-text-primary hover:text-accent-primary">Dashboard</a>
              </li>
              <li>
                <a href="#" className="text-text-primary hover:text-accent-primary">Settings</a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-accent-primary">Logout</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container-custom py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <UserProfile 
              user={user}
              opportunities={opportunities}
              positionMatrix={positionMatrix}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Import the UserProfile component from the features directory
import { UserProfile } from '@/features/profile/UserProfile';
