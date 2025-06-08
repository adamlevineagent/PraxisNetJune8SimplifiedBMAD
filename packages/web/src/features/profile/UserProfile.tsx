import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OpportunityCardProps {
  opportunity: {
    id: string;
    summary: string;
    status: 'PENDING' | 'INTERESTED' | 'NOT_INTERESTED' | 'MUTUAL' | 'INTRODUCED';
    targetUser: {
      handle: string;
      disclosureLevel: 'OPEN' | 'STEALTH';
    };
    createdAt: string;
  };
  onStatusChange: (id: string, status: 'INTERESTED' | 'NOT_INTERESTED') => void;
}

export function OpportunityCard({ opportunity, onStatusChange }: OpportunityCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getStatusBadge = () => {
    switch (opportunity.status) {
      case 'PENDING':
        return <span className="px-2 py-1 text-xs rounded-full bg-background-primary text-text-secondary">Pending</span>;
      case 'INTERESTED':
        return <span className="px-2 py-1 text-xs rounded-full bg-accent-primary/20 text-accent-primary">Interested</span>;
      case 'NOT_INTERESTED':
        return <span className="px-2 py-1 text-xs rounded-full bg-accent-error/20 text-accent-error">Not Interested</span>;
      case 'MUTUAL':
        return <span className="px-2 py-1 text-xs rounded-full bg-accent-success/20 text-accent-success">Mutual Interest</span>;
      case 'INTRODUCED':
        return <span className="px-2 py-1 text-xs rounded-full bg-accent-success bg-opacity-90 text-background-primary">Introduced</span>;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {opportunity.targetUser.disclosureLevel === 'OPEN' 
              ? opportunity.targetUser.handle 
              : 'Anonymous User'}
          </CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-text-secondary">
          Discovered on {formatDate(opportunity.createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-text-primary">{opportunity.summary}</p>
      </CardContent>
      {opportunity.status === 'PENDING' && (
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onStatusChange(opportunity.id, 'NOT_INTERESTED')}
          >
            Not Interested
          </Button>
          <Button 
            onClick={() => onStatusChange(opportunity.id, 'INTERESTED')}
          >
            Express Interest
          </Button>
        </CardFooter>
      )}
      {opportunity.status === 'MUTUAL' && (
        <CardFooter>
          <p className="text-accent-success text-sm">
            Mutual interest detected! An introduction email has been sent to both parties.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

interface UserProfileProps {
  user: {
    handle: string;
    disclosureLevel: 'OPEN' | 'STEALTH';
    status: 'PENDING' | 'APPROVED';
  };
  opportunities: Array<{
    id: string;
    summary: string;
    status: 'PENDING' | 'INTERESTED' | 'NOT_INTERESTED' | 'MUTUAL' | 'INTRODUCED';
    targetUser: {
      handle: string;
      disclosureLevel: 'OPEN' | 'STEALTH';
    };
    createdAt: string;
  }>;
  positionMatrix: any;
}

export function UserProfile({ user, opportunities, positionMatrix }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'profile'>('opportunities');
  const [filteredOpportunities, setFilteredOpportunities] = useState(opportunities);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'INTERESTED' | 'MUTUAL'>('ALL');
  
  const handleFilterChange = (newFilter: 'ALL' | 'PENDING' | 'INTERESTED' | 'MUTUAL') => {
    setFilter(newFilter);
    
    if (newFilter === 'ALL') {
      setFilteredOpportunities(opportunities);
    } else {
      setFilteredOpportunities(opportunities.filter(opp => opp.status === newFilter));
    }
  };
  
  const handleStatusChange = (id: string, status: 'INTERESTED' | 'NOT_INTERESTED') => {
    // In a real implementation, this would make an API call
    const updatedOpportunities = opportunities.map(opp => 
      opp.id === id ? { ...opp, status } : opp
    );
    
    // For demo purposes, simulate a mutual match for the first "INTERESTED" selection
    if (status === 'INTERESTED' && !opportunities.some(opp => opp.status === 'MUTUAL')) {
      updatedOpportunities[0] = { ...updatedOpportunities[0], status: 'MUTUAL' };
    }
    
    setFilteredOpportunities(
      filter === 'ALL' 
        ? updatedOpportunities 
        : updatedOpportunities.filter(opp => opp.status === filter)
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Welcome, {user.handle}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Status:</span>
          {user.status === 'APPROVED' ? (
            <span className="px-2 py-1 text-xs rounded-full bg-accent-success/20 text-accent-success">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 text-xs rounded-full bg-background-primary text-text-secondary">
              Pending Approval
            </span>
          )}
        </div>
      </div>
      
      <div className="flex border-b border-background-secondary">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'opportunities'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('opportunities')}
        >
          Opportunities
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'profile'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
      </div>
      
      {activeTab === 'opportunities' && (
        <div>
          <div className="flex space-x-2 mb-6">
            <Button
              variant={filter === 'ALL' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('ALL')}
            >
              All
            </Button>
            <Button
              variant={filter === 'PENDING' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('PENDING')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'INTERESTED' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('INTERESTED')}
            >
              Interested
            </Button>
            <Button
              variant={filter === 'MUTUAL' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('MUTUAL')}
            >
              Mutual
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map(opportunity => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <div className="md:col-span-2 py-12 text-center">
                <p className="text-text-secondary">No opportunities found with the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'profile' && (
        <div className="mt-6">
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary">Handle</h3>
                    <p className="text-text-primary">{user.handle}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary">Disclosure Level</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-text-primary">
                        {user.disclosureLevel === 'OPEN' ? 'Open Networker' : 'Stealth Mode'}
                      </span>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {user.disclosureLevel === 'OPEN'
                        ? 'Your handle is visible to other users when opportunities are shared.'
                        : 'Your identity remains private until you approve an introduction.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Position Matrix</h3>
            <PositionMatrix positionMatrix={positionMatrix} editable={true} />
          </div>
        </div>
      )}
    </div>
  );
}
