import { useState } from 'react';
import { Message, ChatContainer, ChatInput, TypingIndicator } from '@/components/ui/chat';
import { Card } from '@/components/ui/card';

interface OnboardingChatProps {
  interviewScript: InterviewQuestion[];
  onComplete: (positionMatrix: any) => void;
}

interface InterviewQuestion {
  id: string;
  question: string;
  followUps?: string[];
}

export function OnboardingChat({ interviewScript, onComplete }: OnboardingChatProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean; timestamp?: string }>>([
    { content: interviewScript[0].question, isUser: false, timestamp: new Date().toLocaleTimeString() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [positionMatrix, setPositionMatrix] = useState({
    archetype: '',
    skills: [],
    projects: [],
    goals: '',
    idealCollaborator: '',
    notes: '',
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { content: inputValue, isUser: true, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Update position matrix based on current question
    updatePositionMatrix(currentQuestionIndex, inputValue);

    // Simulate agent response after a delay
    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      if (nextQuestionIndex < interviewScript.length) {
        // Add agent response with next question
        setMessages((prev) => [
          ...prev,
          { content: interviewScript[nextQuestionIndex].question, isUser: false, timestamp: new Date().toLocaleTimeString() },
        ]);
        setCurrentQuestionIndex(nextQuestionIndex);
      } else {
        // Interview complete
        setMessages((prev) => [
          ...prev,
          {
            content: "Excellent. I've compiled your initial Position Matrix based on our conversation. You can see it here and can edit it at any time from your profile. I will now begin networking on your behalf. Expect your first personalized 'Morning Report' via email tomorrow. It was a pleasure to meet you.",
            isUser: false,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
        onComplete(positionMatrix);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  const updatePositionMatrix = (questionIndex: number, answer: string) => {
    // This is a simplified version - in a real implementation, this would use more sophisticated logic
    // and potentially AI to extract relevant information from the user's answers
    setPositionMatrix((prev) => {
      const updated = { ...prev };
      
      switch (questionIndex) {
        case 0: // Welcome question
          updated.notes = answer;
          break;
        case 1: // Archetype
          updated.archetype = answer.includes('Builder') ? 'BUILDER' :
                             answer.includes('Visionary') ? 'VISIONARY' :
                             answer.includes('Specialist') ? 'SPECIALIST' :
                             answer.includes('Connector') ? 'CONNECTOR' : 'OTHER';
          break;
        case 2: // Core Skills
          updated.skills = answer.split(',').map(skill => skill.trim());
          break;
        case 3: // Active Projects
          const projectName = answer.split('\n')[0] || answer;
          updated.projects.push({
            name: projectName,
            description: answer,
            url: ''
          });
          break;
        case 4: // Collaboration Goals
          updated.goals = answer;
          break;
        case 5: // Ideal Collaborator
          updated.idealCollaborator = answer;
          break;
        default:
          break;
      }
      
      return updated;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-grow overflow-hidden flex flex-col">
        <ChatContainer>
          {messages.map((message, index) => (
            <Message
              key={index}
              content={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-background-secondary rounded-2xl px-4 py-3 rounded-tl-none">
                <TypingIndicator />
              </div>
            </div>
          )}
        </ChatContainer>
        <ChatInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={handleSendMessage}
          disabled={isTyping}
        />
      </Card>
    </div>
  );
}
