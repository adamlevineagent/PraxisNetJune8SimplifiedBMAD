import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserApprovalQueueProps {
  pendingUsers: Array<{
    id: string;
    email: string;
    handle: string;
    disclosureLevel: 'OPEN' | 'STEALTH';
    createdAt: string;
  }>;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onViewProfile: (userId: string) => void;
}

export function UserApprovalQueue({ 
  pendingUsers, 
  onApprove, 
  onReject, 
  onViewProfile 
}: UserApprovalQueueProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Approval Queue</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingUsers.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No pending users to approve.</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div 
                key={user.id} 
                className="p-4 border border-background-secondary rounded-md flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-text-primary">{user.handle}</h3>
                  <p className="text-sm text-text-secondary">{user.email}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Registered on {formatDate(user.createdAt)} • 
                    {user.disclosureLevel === 'OPEN' ? ' Open Networker' : ' Stealth Mode'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewProfile(user.id)}
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-accent-error hover:bg-accent-error/10"
                    onClick={() => onReject(user.id)}
                  >
                    Reject
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => onApprove(user.id)}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ConversationAuditProps {
  conversations: Array<{
    id: string;
    ranAt: string;
    participants: Array<{
      id: string;
      handle: string;
    }>;
    matchScore: number;
  }>;
  onViewConversation: (conversationId: string) => void;
}

export function ConversationAudit({ conversations, onViewConversation }: ConversationAuditProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Audit</CardTitle>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No conversations to display.</p>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id} 
                className="p-4 border border-background-secondary rounded-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-text-primary">
                      {conversation.participants[0].handle} & {conversation.participants[1].handle}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Conversation on {formatDate(conversation.ranAt)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Match Score:</span>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        conversation.matchScore >= 0.8 
                          ? 'bg-accent-success/20 text-accent-success' 
                          : conversation.matchScore >= 0.5 
                            ? 'bg-accent-primary/20 text-accent-primary' 
                            : 'bg-accent-error/20 text-accent-error'
                      }`}
                    >
                      {Math.round(conversation.matchScore * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewConversation(conversation.id)}
                  >
                    View Transcript
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SystemConfigProps {
  config: {
    ai_models: {
      onboarding_interview: string;
      agent_networking: string;
      report_generation: string;
    };
    batch_config: {
      start_time: string;
      max_duration_hours: number;
      conversations_per_agent: number;
      targeted_ratio: number;
      serendipitous_ratio: number;
    };
  };
  onSave: (config: any) => void;
}

export function SystemConfig({ config, onSave }: SystemConfigProps) {
  const [editedConfig, setEditedConfig] = useState(config);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditedConfig(config);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    onSave(editedConfig);
  };
  
  const handleChange = (section: string, field: string, value: any) => {
    setEditedConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Configuration</CardTitle>
        {!isEditing ? (
          <Button variant="outline" onClick={handleEdit}>
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-accent-primary mb-4">AI Models</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Onboarding Interview Model
                </label>
                {isEditing ? (
                  <select
                    value={editedConfig.ai_models.onboarding_interview}
                    onChange={(e) => handleChange('ai_models', 'onboarding_interview', e.target.value)}
                    className="w-full px-4 py-2 bg-background-secondary border border-background-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                ) : (
                  <p className="text-text-primary">{config.ai_models.onboarding_interview}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Agent Networking Model
                </label>
                {isEditing ? (
                  <select
                    value={editedConfig.ai_models.agent_networking}
                    onChange={(e) => handleChange('ai_models', 'agent_networking', e.target.value)}
                    className="w-full px-4 py-2 bg-background-secondary border border-background-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                ) : (
                  <p className="text-text-primary">{config.ai_models.agent_networking}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Report Generation Model
                </label>
                {isEditing ? (
                  <select
                    value={editedConfig.ai_models.report_generation}
                    onChange={(e) => handleChange('ai_models', 'report_generation', e.target.value)}
                    className="w-full px-4 py-2 bg-background-secondary border border-background-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                ) : (
                  <p className="text-text-primary">{config.ai_models.report_generation}</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-accent-primary mb-4">Batch Processing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Start Time (UTC)
                </label>
                {isEditing ? (
                  <Input
                    type="time"
                    value={editedConfig.batch_config.start_time}
                    onChange={(e) => handleChange('batch_config', 'start_time', e.target.value)}
                  />
                ) : (
                  <p className="text-text-primary">{config.batch_config.start_time} UTC</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Maximum Duration (hours)
                </label>
                {isEditing ? (
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={editedConfig.batch_config.max_duration_hours}
                    onChange={(e) => handleChange('batch_config', 'max_duration_hours', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="text-text-primary">{config.batch_config.max_duration_hours} hours</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Conversations Per Agent
                </label>
                {isEditing ? (
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={editedConfig.batch_config.conversations_per_agent}
                    onChange={(e) => handleChange('batch_config', 'conversations_per_agent', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="text-text-primary">{config.batch_config.conversations_per_agent}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Targeted/Serendipitous Ratio
                </label>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={editedConfig.batch_config.targeted_ratio}
                      onChange={(e) => {
                        const targetedRatio = parseFloat(e.target.value);
                        handleChange('batch_config', 'targeted_ratio', targetedRatio);
                        handleChange('batch_config', 'serendipitous_ratio', Math.round((1 - targetedRatio) * 10) / 10);
                      }}
                    />
                    <span className="text-text-secondary">/</span>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={editedConfig.batch_config.serendipitous_ratio}
                      onChange={(e) => {
                        const serendipitousRatio = parseFloat(e.target.value);
                        handleChange('batch_config', 'serendipitous_ratio', serendipitousRatio);
                        handleChange('batch_config', 'targeted_ratio', Math.round((1 - serendipitousRatio) * 10) / 10);
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-text-primary">
                    {config.batch_config.targeted_ratio * 100}% targeted / {config.batch_config.serendipitous_ratio * 100}% serendipitous
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
