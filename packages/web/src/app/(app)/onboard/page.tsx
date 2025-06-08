import { useState } from 'react';
import { OnboardingChat } from '@/features/onboard/OnboardingChat';
import { PositionMatrix } from '@/features/onboard/PositionMatrix';

// Define the interview script based on the UX/UI specification
const interviewScript = [
  {
    id: 'welcome',
    question: "Welcome! I'm your new Praxis Agent. My sole purpose is to understand your goals and find opportunities for you within a network of builders and creators. To start, what about this mission to build a more collaborative future resonates most with you?"
  },
  {
    id: 'archetype',
    question: "Great. Now let's build your profile. Based on your work and passions, which of these archetypes fits you best right now? A Builder (who makes things), a Visionary (who designs things), a Specialist (with deep domain expertise), or a Connector (who brings people and resources—like funding or media attention—together)? Or, feel free to select 'Something else' and just describe your role in your own words."
  },
  {
    id: 'skills',
    question: "Perfect. Now, what are the 3-5 core skills or areas of expertise you want me to highlight when I talk to other agents? These can be specific, like 'Python' or 'UI Design', or broader, like 'economic modeling' or 'community building'."
  },
  {
    id: 'projects',
    question: "Do you have any active projects or ventures you'd like me to represent? Please share a name, a brief description, or even a link if you have one."
  },
  {
    id: 'goals',
    question: "This is very helpful. When you think about ideal future collaborations, what are you primarily looking for right now? (e.g., a co-founder, interesting projects to contribute to, funding for your project, mentorship, etc.)"
  },
  {
    id: 'collaborator',
    question: "To help me find the right fit, how would you describe your ideal collaborator?"
  },
  {
    id: 'privacy',
    question: "Finally, let's set your privacy. 'Open Networker' mode allows me to use your handle for faster connections. 'Stealth Mode' keeps you completely private until you approve an introduction. Which do you prefer to start?"
  }
];

export default function OnboardingPage() {
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [positionMatrix, setPositionMatrix] = useState<any>(null);
  
  const handleInterviewComplete = (matrix: any) => {
    setPositionMatrix(matrix);
    setIsInterviewComplete(true);
  };
  
  const handleMatrixChange = (updatedMatrix: any) => {
    setPositionMatrix(updatedMatrix);
  };
  
  return (
    <div className="min-h-screen bg-background-primary">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-background-secondary">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-accent-primary">Praxis Network</h1>
          </div>
        </div>
      </header>
      
      <main className="container-custom py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            {isInterviewComplete ? 'Your Position Matrix' : 'Onboarding Interview'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {!isInterviewComplete ? (
              <>
                <div className="md:col-span-1">
                  <OnboardingChat 
                    interviewScript={interviewScript} 
                    onComplete={handleInterviewComplete} 
                  />
                </div>
                <div className="md:col-span-1 hidden md:block">
                  <div className="sticky top-8">
                    <p className="text-text-secondary mb-4">
                      Your Position Matrix will appear here as we talk. It updates in real-time based on our conversation.
                    </p>
                    {positionMatrix && (
                      <PositionMatrix positionMatrix={positionMatrix} />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <div className="mb-8">
                  <p className="text-text-primary mb-4">
                    Thank you for completing the onboarding interview! Your profile has been submitted for approval.
                    You'll receive a notification once it's approved, and your agent will begin networking on your behalf.
                  </p>
                  <p className="text-text-primary">
                    In the meantime, you can review and edit your Position Matrix below.
                  </p>
                </div>
                
                <PositionMatrix 
                  positionMatrix={positionMatrix} 
                  editable={true}
                  onChange={handleMatrixChange}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
