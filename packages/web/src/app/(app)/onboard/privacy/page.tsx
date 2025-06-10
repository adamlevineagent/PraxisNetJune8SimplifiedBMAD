"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, Globe, Users, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

type PrivacyLayer = 'PUBLIC' | 'MEMBER' | 'TRUSTED';

interface PrivacySettings {
  narrativeLayer: PrivacyLayer;
  currentFocusLayer: PrivacyLayer;
  seekingConnectionsLayer: PrivacyLayer;
  offeringExpertiseLayer: PrivacyLayer;
}

const privacyLayers = [
  {
    value: 'PUBLIC' as PrivacyLayer,
    label: 'Public',
    description: 'Visible to all logged-in users',
    icon: Globe,
    color: 'text-green-500',
  },
  {
    value: 'MEMBER' as PrivacyLayer,
    label: 'Members Only',
    description: 'Visible to approved members',
    icon: Users,
    color: 'text-blue-500',
  },
  {
    value: 'TRUSTED' as PrivacyLayer,
    label: 'Trusted Connections',
    description: 'Only visible to users with mutual matches',
    icon: Lock,
    color: 'text-purple-500',
  },
];

export default function PrivacyConfigurationPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    narrativeLayer: 'MEMBER',
    currentFocusLayer: 'MEMBER',
    seekingConnectionsLayer: 'MEMBER',
    offeringExpertiseLayer: 'MEMBER',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  const handleLayerChange = (section: keyof PrivacySettings, value: PrivacyLayer) => {
    setPrivacySettings(prev => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!user || !token) return;

    setIsSaving(true);
    setError('');

    try {
      // Save privacy settings
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/privacy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(privacySettings),
      });

      if (!response.ok) {
        throw new Error('Failed to save privacy settings');
      }

      // Update disclosure level based on most restrictive setting
      const mostRestrictive = Object.values(privacySettings).includes('PUBLIC') ? 'OPEN' : 'STEALTH';
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ disclosureLevel: mostRestrictive }),
      });

      // Update onboarding stage
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/onboarding-stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: 'AGENT_NAMING' }),
      });

      // Proceed to agent naming
      router.push('/onboard/agent');
    } catch (err) {
      setError('Failed to save privacy settings. Please try again.');
      console.error('Privacy settings error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    {
      key: 'narrativeLayer' as keyof PrivacySettings,
      title: 'Professional Narrative',
      description: 'Your story, journey, and professional background',
    },
    {
      key: 'currentFocusLayer' as keyof PrivacySettings,
      title: 'Current Focus',
      description: 'Projects and initiatives you\'re working on',
    },
    {
      key: 'seekingConnectionsLayer' as keyof PrivacySettings,
      title: 'Seeking Connections',
      description: 'Types of collaborations you\'re looking for',
    },
    {
      key: 'offeringExpertiseLayer' as keyof PrivacySettings,
      title: 'Offering Expertise',
      description: 'Skills and knowledge you can share',
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <Card className="p-8">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Shield className="w-6 h-6 mr-2 text-accent-primary" />
              <h1 className="text-2xl font-bold">Configure Your Privacy</h1>
            </div>
            <p className="text-text-secondary">
              Control who can see different parts of your Professional Essence
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.key} className="space-y-3">
                <div>
                  <h3 className="font-semibold">{section.title}</h3>
                  <p className="text-sm text-text-secondary">{section.description}</p>
                </div>
                
                <RadioGroup
                  value={privacySettings[section.key]}
                  onValueChange={(value) => handleLayerChange(section.key, value as PrivacyLayer)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {privacyLayers.map((layer) => {
                      const Icon = layer.icon;
                      return (
                        <label
                          key={layer.value}
                          className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            privacySettings[section.key] === layer.value
                              ? 'border-accent-primary bg-accent-primary/10'
                              : 'border-background-secondary hover:border-text-secondary'
                          }`}
                        >
                          <RadioGroupItem value={layer.value} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center">
                              <Icon className={`w-4 h-4 mr-1 ${layer.color}`} />
                              <span className="font-medium text-sm">{layer.label}</span>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                              {layer.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>
            ))}

            <div className="pt-4 border-t border-background-secondary">
              <div className="bg-background-secondary p-4 rounded-lg">
                <p className="text-sm text-text-secondary">
                  <span className="font-medium">Note:</span> You can always change these settings later 
                  from your profile. Start with more restrictive settings if you're unsure.
                </p>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="w-full"
              size="lg"
            >
              {isSaving ? 'Saving...' : 'Continue to Agent Setup'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}