"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  User,
  Bot,
  Send,
  Activity,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface EssenceMetrics {
  completeness: number;
  currentFocus: string;
  energy: string;
  workingStyle: string;
}

export default function ProvingGroundDemoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'register' | 'agent' | 'interview' | 'review' | 'complete'>('register');
  
  // Registration state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  // Agent state
  const [agentName, setAgentName] = useState('');
  const [agentStyle, setAgentStyle] = useState('warm');
  
  // Interview state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [essenceMetrics, setEssenceMetrics] = useState<EssenceMetrics>({
    completeness: 0,
    currentFocus: '',
    energy: '',
    workingStyle: '[Gathering...]'
  });
  
  // System metrics
  const [responseTime, setResponseTime] = useState(0);
  const [turnCount, setTurnCount] = useState(0);

  useEffect(() => {
    // Check username availability after debounce
    const timer = setTimeout(() => {
      if (username.length > 2) {
        setCheckingUsername(true);
        // Simulate API call
        setTimeout(() => {
          setIsUsernameAvailable(!['admin', 'test', 'user'].includes(username.toLowerCase()));
          setCheckingUsername(false);
        }, 500);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [username]);

  const handleRegister = async () => {
    // Simulate registration
    const startTime = Date.now();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const duration = Date.now() - startTime;
    console.log(`Account creation took ${duration}ms`);
    
    // Move to agent personalization
    setCurrentStep('agent');
  };

  const getAgentGreeting = () => {
    const greetings = {
      warm: `"Hi! I'm ${agentName || 'your agent'}, your Praxis agent. I'm excited to learn about your professional journey and help you discover amazing collaboration opportunities. Ready to chat?"`,
      professional: `"Good day. I'm ${agentName || 'your agent'}, your Praxis Network agent. I'm here to understand your professional expertise and identify meaningful collaboration opportunities. Shall we begin?"`,
      direct: `"I'm ${agentName || 'your agent'}. Let's get straight to understanding what you're working on and how we can connect you with the right people. Ready?"`,
    };
    
    return greetings[agentStyle] || greetings.warm;
  };

  const startInterview = () => {
    setCurrentStep('interview');
    
    // Add initial agent message
    const initialMessage: Message = {
      id: '1',
      role: 'assistant',
      content: "What's got your professional attention these days?",
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
    setTurnCount(1);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const startTime = Date.now();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const responseTime = Date.now() - startTime;
    setResponseTime(responseTime);
    
    // Generate AI response based on turn count
    const aiResponses = [
      "That's fascinating! Tell me more about what specific challenges you're seeing in that space.",
      "I can see why that excites you. How did you first get interested in this area?",
      "That sounds like important work. What would success look like for you in the next year?",
      "Interesting perspective! Who do you think would benefit most from collaborating with you on this?",
      "I'm getting a clear picture of your expertise. What kind of support or resources would accelerate your progress?",
    ];
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponses[turnCount % aiResponses.length],
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
    setTurnCount(prev => prev + 1);
    
    // Update essence metrics
    updateEssenceMetrics();
  };

  const updateEssenceMetrics = () => {
    setEssenceMetrics(prev => ({
      completeness: Math.min(prev.completeness + 15, 75),
      currentFocus: turnCount === 1 ? 'AI accessibility' : prev.currentFocus,
      energy: turnCount === 2 ? 'High enthusiasm for democratization' : prev.energy,
      workingStyle: turnCount >= 3 ? 'Collaborative bridge-builder' : '[Gathering...]'
    }));
  };

  const completeInterview = () => {
    setCurrentStep('review');
  };

  const submitForApproval = () => {
    setCurrentStep('complete');
    
    // In a real implementation, this would trigger the admin notification
    setTimeout(() => {
      alert('Your profile has been submitted for approval! You will receive an email once reviewed.');
    }, 500);
  };

  const getPasswordStrength = () => {
    if (!password) return '';
    if (password.length < 8) return 'Weak';
    if (password.length < 12) return 'Medium';
    return 'Strong';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'register':
        return (
          <Card className="p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create Your Praxis Network Account</h2>
            <div className="w-full h-px bg-accent-primary mb-6"></div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Choose a unique handle</Label>
                <div className="relative mt-1">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@username"
                    className="pr-10"
                  />
                  <div className="absolute right-2 top-2.5">
                    {checkingUsername ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-text-secondary" />
                    ) : username && (
                      isUsernameAvailable ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )
                    )}
                  </div>
                </div>
                {username && !checkingUsername && (
                  <p className={`text-sm mt-1 ${isUsernameAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {isUsernameAvailable ? '✓ Available' : '✗ Already taken'}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="password">Create a password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-1"
                />
                {password && (
                  <p className={`text-sm mt-1 ${
                    getPasswordStrength() === 'Strong' ? 'text-green-500' : 
                    getPasswordStrength() === 'Medium' ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>
                    {getPasswordStrength()}
                  </p>
                )}
              </div>
              
              <Button
                onClick={handleRegister}
                disabled={!username || !password || !isUsernameAvailable || checkingUsername}
                className="w-full"
              >
                Create Account
              </Button>
              
              <div className="text-sm text-text-secondary text-center">
                Real-time feedback:
                <ul className="mt-2 space-y-1">
                  <li>• Username availability check (instant)</li>
                  <li>• Password strength indicator</li>
                  <li>• Account creation confirmation</li>
                </ul>
              </div>
            </div>
          </Card>
        );
        
      case 'agent':
        return (
          <Card className="p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Let's Personalize Your AI Agent</h2>
            <div className="w-full h-px bg-accent-primary mb-6"></div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="agentName">What would you like to name your agent?</Label>
                <Input
                  id="agentName"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Enter a name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>How should your agent communicate?</Label>
                <RadioGroup value={agentStyle} onValueChange={setAgentStyle} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional">Professional & Focused</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="warm" id="warm" />
                    <Label htmlFor="warm">Warm & Conversational</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="direct" id="direct" />
                    <Label htmlFor="direct">Direct & Efficient</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <p className="text-sm text-text-secondary mb-2">Preview your agent's greeting:</p>
                <Card className="p-4 bg-background-secondary">
                  <p className="text-sm italic">{getAgentGreeting()}</p>
                </Card>
              </div>
              
              <Button
                onClick={startInterview}
                disabled={!agentName}
                className="w-full flex items-center justify-center"
              >
                Continue to Interview
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        );
        
      case 'interview':
        return (
          <Card className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Chat with Your Agent</h2>
            <div className="w-full h-px bg-accent-primary mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="h-96 overflow-y-auto bg-background-secondary rounded-lg p-4 mb-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        message.role === 'user' ? 'bg-accent-primary text-white' : 'bg-background-primary'
                      }`}>
                        <div className="flex items-center mb-1">
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 mr-2" />
                          ) : (
                            <Bot className="w-4 h-4 mr-2" />
                          )}
                          <span className="text-xs font-medium">
                            {message.role === 'user' ? 'You' : agentName}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-left">
                      <div className="inline-block p-3 rounded-lg bg-background-primary">
                        <p className="text-sm text-text-secondary">
                          {agentName} is typing...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your response..."
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={isTyping || !inputMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mt-2 text-xs text-text-secondary">
                  Turn {turnCount} of ~10-15 | Response time: {(responseTime / 1000).toFixed(1)}s
                </div>
              </div>
              
              <div>
                <Card className="p-4 bg-background-secondary">
                  <h3 className="font-medium mb-3">Professional Essence Building...</h3>
                  <Progress value={essenceMetrics.completeness} className="mb-3" />
                  <p className="text-sm text-text-secondary mb-3">
                    Completeness: {essenceMetrics.completeness}%
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>Discovered so far:</strong></p>
                    <ul className="space-y-1 text-text-secondary">
                      {essenceMetrics.currentFocus && (
                        <li>• Current Focus: {essenceMetrics.currentFocus}</li>
                      )}
                      {essenceMetrics.energy && (
                        <li>• Energy: {essenceMetrics.energy}</li>
                      )}
                      <li>• Working Style: {essenceMetrics.workingStyle}</li>
                    </ul>
                  </div>
                  
                  {essenceMetrics.completeness >= 60 && (
                    <Button
                      onClick={completeInterview}
                      className="w-full mt-4"
                      size="sm"
                    >
                      Complete Interview
                    </Button>
                  )}
                </Card>
              </div>
            </div>
          </Card>
        );
        
      case 'review':
        return (
          <Card className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Your Professional Essence</h2>
            <div className="w-full h-px bg-accent-primary mb-6"></div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p>Completeness Score:</p>
                <Badge variant="secondary" className="text-lg">
                  {(essenceMetrics.completeness / 100).toFixed(2)} ✓ (Excellent)
                </Badge>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Your Narrative:</h3>
                <p className="text-sm text-text-secondary italic">
                  "A passionate technologist focused on democratizing AI for non-technical 
                  founders. Currently building tools that bridge the gap between complex 
                  AI capabilities and practical business applications..."
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Key Themes Discovered:</h3>
                <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                  <li>Democratization & Accessibility</li>
                  <li>Bridge-building between technical and non-technical</li>
                  <li>Tool creation for empowerment</li>
                  <li>User-centric design philosophy</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Privacy Layers (you can adjust these anytime):</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>[Public]</span>
                    <span className="text-text-secondary">Basic professional identity</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>[Members]</span>
                    <span className="text-text-secondary">Current projects and interests</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>[Trusted]</span>
                    <span className="text-text-secondary">Specific collaboration needs</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={submitForApproval}
                className="w-full flex items-center justify-center"
              >
                Submit for Approval
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        );
        
      case 'complete':
        return (
          <Card className="p-8 max-w-md mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
            <p className="text-text-secondary mb-6">
              Your profile has been submitted for admin review. 
              You'll receive an email notification once your account is approved.
            </p>
            <div className="space-y-2">
              <Button onClick={() => router.push('/proving-ground/1')} className="w-full">
                Back to Proving Ground
              </Button>
              <Button onClick={() => router.push('/proving-ground/1/admin')} variant="outline" className="w-full">
                View Admin Perspective
              </Button>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Proving Ground 1 - Live Demo</h1>
          <p className="text-lg text-text-secondary">Experience the complete onboarding flow</p>
          <div className="mt-4 w-full h-px bg-accent-primary"></div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['register', 'agent', 'interview', 'review', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step ? 'bg-accent-primary text-white' : 
                  ['register', 'agent', 'interview', 'review', 'complete'].indexOf(currentStep) > index ? 
                  'bg-green-500 text-white' : 'bg-background-secondary text-text-secondary'
                }`}>
                  {['register', 'agent', 'interview', 'review', 'complete'].indexOf(currentStep) > index ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                {index < 4 && (
                  <div className={`w-16 h-0.5 ${
                    ['register', 'agent', 'interview', 'review', 'complete'].indexOf(currentStep) > index ? 
                    'bg-green-500' : 'bg-background-secondary'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-8 text-xs text-text-secondary">
            <span>Register</span>
            <span>Agent</span>
            <span>Interview</span>
            <span>Review</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Main Content */}
        {renderStep()}

        {/* System Metrics */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => router.push('/proving-ground/1')}
            variant="outline"
            size="sm"
          >
            ← Back to Main Proving Ground
          </Button>
        </div>
      </div>
    </div>
  );
}