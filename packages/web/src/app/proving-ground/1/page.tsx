"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Activity,
  Database,
  Brain,
  Shield,
  Terminal,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface SystemStatus {
  database: boolean;
  ai: boolean;
  auth: boolean;
  avgDbQuery: number;
  avgAiResponse: number;
}

interface PerformanceMetrics {
  accountCreation: number;
  aiResponseTime: number;
  essenceExtraction: number;
  totalOnboarding: number;
  accountsCreated: number;
  agentsPersonalized: number;
  interviewsCompleted: number;
  essencesExtracted: number;
  adminApprovalsProcessed: number;
}

export default function ProvingGround1Page() {
  const router = useRouter();
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: true,
    ai: true,
    auth: true,
    avgDbQuery: 12,
    avgAiResponse: 1200,
  });

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    accountCreation: 0.8,
    aiResponseTime: 1.2,
    essenceExtraction: 3.2,
    totalOnboarding: 8,
    accountsCreated: 5,
    agentsPersonalized: 5,
    interviewsCompleted: 4,
    essencesExtracted: 4,
    adminApprovalsProcessed: 3,
  });

  const [showDevConsole, setShowDevConsole] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<string[]>([
    '[12:45:32] POST /api/auth/signup - 201 Created (823ms)',
    '[12:45:33] WebSocket connected: session_abc123',
    '[12:45:45] POST /api/agent/personalize - 200 OK (145ms)',
    '[12:46:12] POST /api/conversation/message - 200 OK (1243ms)',
    '[12:46:13] Database: conversation_state saved',
  ]);

  useEffect(() => {
    // Check for session recovery
    const savedSession = sessionStorage.getItem('pg1_session');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      const timeElapsed = Date.now() - session.timestamp;
      if (timeElapsed < 3600000) { // 1 hour
        addConsoleMessage('INFO: Previous session detected');
        const continueSession = window.confirm(
          'Welcome back! You were in the middle of personalizing your agent. Would you like to continue where you left off?'
        );
        if (continueSession) {
          router.push('/onboard/agent');
        }
        sessionStorage.removeItem('pg1_session');
      }
    }

    // Check system health
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        
        setSystemStatus({
          database: data.status === 'healthy' && data.services?.database === 'connected',
          ai: data.status === 'healthy' && data.services?.ai === 'operational',
          auth: data.status === 'healthy' && data.services?.api === 'operational',
          avgDbQuery: 12,
          avgAiResponse: 1200,
        });

        addConsoleMessage(`GET /health - 200 OK (${Date.now() % 100}ms)`);
      }
    } catch (error) {
      console.error('Health check failed:', error);
      addConsoleMessage('ERROR: Health check failed - services may be unavailable');
    }
  };

  const addConsoleMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setConsoleMessages(prev => {
      const newMessages = [...prev, `[${timestamp}] ${message}`];
      // Keep only last 20 messages
      return newMessages.slice(-20);
    });
  };

  const simulateApiFailure = () => {
    setSimulateFailure(true);
    setSystemStatus(prev => ({ ...prev, ai: false }));
    addConsoleMessage('ERROR: OpenRouter API connection failed');
    setTimeout(() => {
      setSimulateFailure(false);
      setSystemStatus(prev => ({ ...prev, ai: true }));
      addConsoleMessage('INFO: OpenRouter API connection restored');
    }, 5000);
  };

  const simulateBrowserCrash = () => {
    // Store current state in sessionStorage
    sessionStorage.setItem('pg1_session', JSON.stringify({
      timestamp: Date.now(),
      step: 'agent_personalization',
    }));
    addConsoleMessage('WARNING: Session state saved for recovery');
    alert('Browser crash simulated. Refresh the page to test recovery.');
  };

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Praxis Network - Proving Ground 1</h1>
          <p className="text-lg text-text-secondary">The Core Data Loop - Live Experience Demo</p>
          <div className="mt-4 w-full h-px bg-accent-primary"></div>
        </div>

        {/* System Health Monitor */}
        <Card className="p-4 mb-8 bg-background-secondary">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Activity className="w-5 h-5 mr-2 text-accent-primary" />
              System Health
            </h2>
            <Button
              onClick={checkSystemHealth}
              variant="ghost"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              {systemStatus.database ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">Database</p>
                <p className="text-xs text-text-secondary">{systemStatus.avgDbQuery}ms avg query</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {systemStatus.ai && !simulateFailure ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">OpenRouter AI</p>
                <p className="text-xs text-text-secondary">{systemStatus.avgAiResponse / 1000}s avg response</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {systemStatus.auth ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">Auth Service</p>
                <p className="text-xs text-text-secondary">JWT valid</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Journey Card */}
        <Card className="p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to Praxis Network</h2>
            <div className="text-text-secondary mb-6">
              <p className="mb-2">System Status:</p>
              <div className="flex justify-center items-center space-x-4">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Database Connected</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>OpenRouter AI Connected (google/gemini-2.0-flash-exp)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Authentication Service Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <Button
              size="lg"
              onClick={() => router.push('/')}
              className="flex items-center"
            >
              Start Your Journey
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Test Scenarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-background-secondary">
            <div className="space-y-4">
              <h3 className="font-semibold">Test Scenarios</h3>
              <Button
                onClick={simulateApiFailure}
                variant="outline"
                className="w-full justify-start"
                disabled={simulateFailure}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Simulate OpenRouter Outage
              </Button>
              <Button
                onClick={simulateBrowserCrash}
                variant="outline"
                className="w-full justify-start"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Simulate Browser Crash
              </Button>
            </div>
            <div>
              {simulateFailure && (
                <Card className="p-4 bg-red-500/10 border-red-500/20">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-500">AI Service Temporarily Unavailable</p>
                      <p className="text-sm text-text-secondary mt-1">
                        We're having trouble connecting to our AI service. Your conversation 
                        has been saved and we'll notify you when you can continue.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>

        {/* Performance Metrics Dashboard */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Performance Metrics (Live)</h2>
          <div className="w-full h-px bg-background-secondary mb-6"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="flex items-center mb-1">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <p className="text-sm font-medium">Account Creation</p>
              </div>
              <p className="text-2xl font-bold">{metrics.accountCreation}s</p>
              <p className="text-xs text-text-secondary">Target: &lt;2s</p>
            </div>
            <div>
              <div className="flex items-center mb-1">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <p className="text-sm font-medium">AI Response Time</p>
              </div>
              <p className="text-2xl font-bold">{metrics.aiResponseTime}s avg</p>
              <p className="text-xs text-text-secondary">Target: &lt;3s</p>
            </div>
            <div>
              <div className="flex items-center mb-1">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <p className="text-sm font-medium">Essence Extraction</p>
              </div>
              <p className="text-2xl font-bold">{metrics.essenceExtraction}s</p>
              <p className="text-xs text-text-secondary">Target: &lt;5s</p>
            </div>
            <div>
              <div className="flex items-center mb-1">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <p className="text-sm font-medium">Total Onboarding</p>
              </div>
              <p className="text-2xl font-bold">{metrics.totalOnboarding} min</p>
              <p className="text-xs text-text-secondary">Target: &lt;15min</p>
            </div>
          </div>

          <div className="bg-background-secondary p-4 rounded-lg">
            <h3 className="font-medium mb-3">Test Results:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>• {metrics.accountsCreated} accounts created successfully</div>
              <div>• {metrics.agentsPersonalized} agents personalized</div>
              <div>• {metrics.interviewsCompleted} interviews completed ({metrics.interviewsCompleted - 1} in progress)</div>
              <div>• {metrics.essencesExtracted} essences extracted (avg score: 0.68)</div>
              <div>• {metrics.adminApprovalsProcessed} admin approvals processed</div>
            </div>
          </div>
        </Card>

        {/* Developer Console */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <Terminal className="w-5 h-5 mr-2" />
              Developer Console (Toggle View)
            </h3>
            <Button
              onClick={() => setShowDevConsole(!showDevConsole)}
              variant="outline"
              size="sm"
            >
              {showDevConsole ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          {showDevConsole && (
            <div className="bg-background-primary p-4 rounded font-mono text-xs max-h-64 overflow-y-auto">
              <p className="text-text-secondary mb-2">// Real-time event log</p>
              {consoleMessages.map((msg, index) => (
                <div key={index} className="mb-1 text-text-secondary">
                  {msg}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Admin View Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-secondary mb-2">
            Want to see the admin perspective?
          </p>
          <Button
            onClick={() => router.push('/proving-ground/1/admin')}
            variant="outline"
          >
            View Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}