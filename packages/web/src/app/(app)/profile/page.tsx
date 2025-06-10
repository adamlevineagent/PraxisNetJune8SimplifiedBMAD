"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User as UserIcon, Shield, Globe, Users, Lock, Edit, Save, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import type { User } from '@/lib/auth-service';

interface ProfessionalEssence {
  narrative: string;
  currentFocus: string[];
  seekingConnections: string[];
  offeringExpertise: string[];
  metadata: {
    completeness: number;
    lastUpdated: string;
  };
}

interface PrivacySettings {
  narrativeLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
  currentFocusLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
  seekingConnectionsLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
  offeringExpertiseLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
}

const privacyIcons = {
  PUBLIC: Globe,
  MEMBER: Users,
  TRUSTED: Lock,
};

const privacyColors = {
  PUBLIC: 'text-green-500',
  MEMBER: 'text-blue-500',
  TRUSTED: 'text-purple-500',
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [essence, setEssence] = useState<ProfessionalEssence | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEssence, setEditedEssence] = useState<ProfessionalEssence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('essence');

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }
    fetchProfileData();
  }, [user, token]);

  const fetchProfileData = async () => {
    try {
      const [essenceRes, privacyRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/essence`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/privacy`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (essenceRes.ok) {
        const essenceData = await essenceRes.json();
        setEssence(essenceData);
      }

      if (privacyRes.ok) {
        const privacyData = await privacyRes.json();
        setPrivacySettings(privacyData);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditedEssence(essence);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedEssence(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedEssence || !token) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/essence`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedEssence),
      });

      if (response.ok) {
        const updatedEssence = await response.json();
        setEssence(updatedEssence);
        setIsEditing(false);
        setEditedEssence(null);
      }
    } catch (error) {
      console.error('Failed to save essence:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateEditedEssence = (field: keyof ProfessionalEssence, value: any) => {
    if (!editedEssence) return;
    setEditedEssence({ ...editedEssence, [field]: value });
  };

  const handleArrayUpdate = (field: 'currentFocus' | 'seekingConnections' | 'offeringExpertise', index: number, value: string) => {
    if (!editedEssence) return;
    const updated = [...editedEssence[field]];
    updated[index] = value;
    updateEditedEssence(field, updated);
  };

  const handleArrayAdd = (field: 'currentFocus' | 'seekingConnections' | 'offeringExpertise') => {
    if (!editedEssence) return;
    updateEditedEssence(field, [...editedEssence[field], '']);
  };

  const handleArrayRemove = (field: 'currentFocus' | 'seekingConnections' | 'offeringExpertise', index: number) => {
    if (!editedEssence) return;
    const updated = editedEssence[field].filter((_, i) => i !== index);
    updateEditedEssence(field, updated);
  };

  const PrivacyBadge = ({ layer }: { layer: keyof typeof privacyIcons }) => {
    const Icon = privacyIcons[layer];
    return (
      <Badge variant="outline" className={`${privacyColors[layer]} border-current`}>
        <Icon className="w-3 h-3 mr-1" />
        {layer.toLowerCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <p className="text-text-secondary">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-4xl mx-auto pt-20">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-accent-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.handle}</h1>
                <p className="text-text-secondary">{user?.email}</p>
                <Badge variant={user?.status === 'APPROVED' ? 'default' : 'secondary'} className="mt-2">
                  {user?.status}
                </Badge>
              </div>
            </div>
            <Badge variant={user?.disclosureLevel === 'OPEN' ? 'default' : 'outline'}>
              {user?.disclosureLevel}
            </Badge>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="essence">Professional Essence</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Settings</TabsTrigger>
          </TabsList>

          {/* Professional Essence Tab */}
          <TabsContent value="essence">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Professional Essence</h2>
                <div className="flex items-center space-x-2">
                  {essence && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round((essence.metadata?.completeness || 0) * 100)}% Complete
                    </Badge>
                  )}
                  {!isEditing ? (
                    <Button onClick={handleEdit} size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        size="sm"
                        disabled={isSaving}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Narrative */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Professional Narrative</h3>
                    {privacySettings && <PrivacyBadge layer={privacySettings.narrativeLayer} />}
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editedEssence?.narrative || ''}
                      onChange={(e) => updateEditedEssence('narrative', e.target.value)}
                      className="w-full p-3 bg-background-secondary rounded-lg resize-none focus:ring-2 focus:ring-accent-primary"
                      rows={4}
                      placeholder="Tell your professional story..."
                    />
                  ) : (
                    <p className="text-text-secondary whitespace-pre-wrap">
                      {essence?.narrative || 'No narrative yet'}
                    </p>
                  )}
                </div>

                {/* Current Focus */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Current Focus</h3>
                    {privacySettings && <PrivacyBadge layer={privacySettings.currentFocusLayer} />}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      {editedEssence?.currentFocus.map((focus, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            value={focus}
                            onChange={(e) => handleArrayUpdate('currentFocus', index, e.target.value)}
                            className="flex-1 p-2 bg-background-secondary rounded"
                            placeholder="Project or initiative..."
                          />
                          <Button
                            onClick={() => handleArrayRemove('currentFocus', index)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={() => handleArrayAdd('currentFocus')}
                        variant="outline"
                        size="sm"
                      >
                        Add Focus Area
                      </Button>
                    </div>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-text-secondary">
                      {essence?.currentFocus.length ? (
                        essence.currentFocus.map((focus, index) => (
                          <li key={index}>{focus}</li>
                        ))
                      ) : (
                        <li>No focus areas added</li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Seeking Connections */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Seeking Connections</h3>
                    {privacySettings && <PrivacyBadge layer={privacySettings.seekingConnectionsLayer} />}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      {editedEssence?.seekingConnections.map((seeking, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            value={seeking}
                            onChange={(e) => handleArrayUpdate('seekingConnections', index, e.target.value)}
                            className="flex-1 p-2 bg-background-secondary rounded"
                            placeholder="Type of collaboration..."
                          />
                          <Button
                            onClick={() => handleArrayRemove('seekingConnections', index)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={() => handleArrayAdd('seekingConnections')}
                        variant="outline"
                        size="sm"
                      >
                        Add Connection Type
                      </Button>
                    </div>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-text-secondary">
                      {essence?.seekingConnections.length ? (
                        essence.seekingConnections.map((seeking, index) => (
                          <li key={index}>{seeking}</li>
                        ))
                      ) : (
                        <li>No connections specified</li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Offering Expertise */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Offering Expertise</h3>
                    {privacySettings && <PrivacyBadge layer={privacySettings.offeringExpertiseLayer} />}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      {editedEssence?.offeringExpertise.map((expertise, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            value={expertise}
                            onChange={(e) => handleArrayUpdate('offeringExpertise', index, e.target.value)}
                            className="flex-1 p-2 bg-background-secondary rounded"
                            placeholder="Skill or knowledge..."
                          />
                          <Button
                            onClick={() => handleArrayRemove('offeringExpertise', index)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={() => handleArrayAdd('offeringExpertise')}
                        variant="outline"
                        size="sm"
                      >
                        Add Expertise
                      </Button>
                    </div>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-text-secondary">
                      {essence?.offeringExpertise.length ? (
                        essence.offeringExpertise.map((expertise, index) => (
                          <li key={index}>{expertise}</li>
                        ))
                      ) : (
                        <li>No expertise listed</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {essence?.metadata?.lastUpdated && (
                <p className="text-xs text-text-secondary mt-6">
                  Last updated: {new Date(essence.metadata.lastUpdated).toLocaleDateString()}
                </p>
              )}
            </Card>
          </TabsContent>

          {/* Privacy Settings Tab */}
          <TabsContent value="privacy">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Privacy Settings</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Control who can see different parts of your Professional Essence
                  </p>
                </div>
                <Shield className="w-6 h-6 text-accent-primary" />
              </div>

              {privacySettings && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <span>Professional Narrative</span>
                    <PrivacyBadge layer={privacySettings.narrativeLayer} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <span>Current Focus</span>
                    <PrivacyBadge layer={privacySettings.currentFocusLayer} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <span>Seeking Connections</span>
                    <PrivacyBadge layer={privacySettings.seekingConnectionsLayer} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <span>Offering Expertise</span>
                    <PrivacyBadge layer={privacySettings.offeringExpertiseLayer} />
                  </div>
                </div>
              )}

              <Button
                onClick={() => router.push('/settings/privacy')}
                className="w-full mt-6"
                variant="outline"
              >
                Edit Privacy Settings
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
