import { useState } from 'react';
import { UserApprovalQueue, ConversationAudit, SystemConfig } from '@/features/admin/AdminComponents';

// Mock data for demonstration
const mockPendingUsers = [
  {
    id: "user-1",
    email: "builder@example.com",
    handle: "builder_42",
    disclosureLevel: "OPEN" as const,
    createdAt: "2025-06-05T10:30:00Z"
  },
  {
    id: "user-2",
    email: "visionary@example.com",
    handle: "future_thinker",
    disclosureLevel: "STEALTH" as const,
    createdAt: "2025-06-06T14:15:00Z"
  },
  {
    id: "user-3",
    email: "specialist@example.com",
    handle: "crypto_expert",
    disclosureLevel: "OPEN" as const,
    createdAt: "2025-06-07T09:45:00Z"
  }
];

const mockConversations = [
  {
    id: "conv-1",
    ranAt: "2025-06-06T02:15:00Z",
    participants: [
      { id: "profile-1", handle: "builder_42" },
      { id: "profile-2", handle: "protocol_visionary" }
    ],
    matchScore: 0.85
  },
  {
    id: "conv-2",
    ranAt: "2025-06-06T02:30:00Z",
    participants: [
      { id: "profile-1", handle: "builder_42" },
      { id: "profile-3", handle: "design_specialist" }
    ],
    matchScore: 0.72
  },
  {
    id: "conv-3",
    ranAt: "2025-06-06T02:45:00Z",
    participants: [
      { id: "profile-2", handle: "protocol_visionary" },
      { id: "profile-4", handle: "anonymous" }
    ],
    matchScore: 0.93
  }
];

const mockSystemConfig = {
  ai_models: {
    onboarding_interview: "gpt-4",
    agent_networking: "claude-3-opus",
    report_generation: "gpt-4"
  },
  batch_config: {
    start_time: "01:00",
    max_duration_hours: 6,
    conversations_per_agent: 5,
    targeted_ratio: 0.6,
    serendipitous_ratio: 0.4
  }
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'approvals' | 'conversations' | 'config'>('approvals');
  const [pendingUsers, setPendingUsers] = useState(mockPendingUsers);
  const [conversations] = useState(mockConversations);
  const [systemConfig, setSystemConfig] = useState(mockSystemConfig);
  
  const handleApproveUser = (userId: string) => {
    // In a real implementation, this would make an API call
    setPendingUsers(pendingUsers.filter(user => user.id !== userId));
  };
  
  const handleRejectUser = (userId: string) => {
    // In a real implementation, this would make an API call
    setPendingUsers(pendingUsers.filter(user => user.id !== userId));
  };
  
  const handleViewProfile = (userId: string) => {
    // In a real implementation, this would navigate to a profile view
    console.log(`View profile for user ${userId}`);
  };
  
  const handleViewConversation = (conversationId: string) => {
    // In a real implementation, this would open a conversation transcript view
    console.log(`View conversation ${conversationId}`);
  };
  
  const handleSaveConfig = (newConfig: any) => {
    // In a real implementation, this would make an API call
    setSystemConfig(newConfig);
  };
  
  return (
    <div className="min-h-screen bg-background-primary">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-background-secondary">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-accent-primary">Praxis Network</h1>
            <span className="ml-4 px-2 py-1 text-xs rounded-full bg-accent-primary text-background-primary">
              Admin
            </span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-text-primary hover:text-accent-primary">Dashboard</a>
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
            <h2 className="text-3xl font-bold">Admin Dashboard</h2>
            <p className="text-text-secondary mt-2">
              Manage users, audit conversations, and configure system settings.
            </p>
          </div>
          
          <div className="flex border-b border-background-secondary mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'approvals'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('approvals')}
            >
              User Approvals
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'conversations'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('conversations')}
            >
              Conversation Audit
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'config'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('config')}
            >
              System Config
            </button>
          </div>
          
          {activeTab === 'approvals' && (
            <UserApprovalQueue
              pendingUsers={pendingUsers}
              onApprove={handleApproveUser}
              onReject={handleRejectUser}
              onViewProfile={handleViewProfile}
            />
          )}
          
          {activeTab === 'conversations' && (
            <ConversationAudit
              conversations={conversations}
              onViewConversation={handleViewConversation}
            />
          )}
          
          {activeTab === 'config' && (
            <SystemConfig
              config={systemConfig}
              onSave={handleSaveConfig}
            />
          )}
        </div>
      </main>
    </div>
  );
}
