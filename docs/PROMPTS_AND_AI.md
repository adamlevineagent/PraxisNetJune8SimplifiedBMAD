# Praxis Network MVP - AI Prompts and Integration Guide

**Project**: Praxis Network MVP  
**Purpose**: Consolidated AI prompts and OpenRouter.ai integration  
**Date**: June 8, 2025  
**Version**: 1.0 (MVP Simplified)  

## Table of Contents

1. [MVP AI Overview](#1-mvp-ai-overview)
2. [OpenRouter.ai Integration](#2-openrouterai-integration)
3. [Onboarding Prompts](#3-onboarding-prompts)
4. [Essence Extraction Prompts](#4-essence-extraction-prompts)
5. [Agent Conversation Prompts](#5-agent-conversation-prompts)
6. [Morning Report Prompts](#6-morning-report-prompts)
7. [Error Handling](#7-error-handling)
8. [Quick Reference](#8-quick-reference)

## 1. MVP AI Overview

### Simplified AI Architecture

- **Single Model**: google/gemini-2.0-flash-exp via OpenRouter.ai
- **No Model Selection**: Same model for all operations
- **Basic Prompts**: Focus on functionality over sophistication
- **Simple Error Handling**: Basic retry logic only

### Key AI Operations

1. **Onboarding Conversations** - Extract Professional Essence
2. **Agent-to-Agent Conversations** - Nightly batch matching
3. **Morning Report Generation** - Summarize discoveries
4. **Introduction Emails** - Format connection requests

## 2. OpenRouter.ai Integration

### Service Implementation

```typescript
// openrouter.service.ts
@Injectable()
export class OpenRouterService {
  private readonly baseUrl = 'https://openrouter.ai/api/v1';
  private readonly apiKey = process.env.OPENROUTER_API_KEY;
  private readonly model = 'google/gemini-2.0-flash-exp';

  async complete(messages: Message[]): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://praxisnetwork.ai',
            'X-Title': 'Praxis Network MVP'
          }
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response?.status === 429) {
        // Simple retry after 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.complete(messages);
      }
      throw error;
    }
  }
}
```

### Environment Configuration

```env
OPENROUTER_API_KEY=your-api-key-here
```

## 3. Onboarding Prompts

### Agent Naming Flow

```
INITIAL GREETING:
"Welcome to Praxis Network! I'm your AI networking agent. First, I'd love for you to give me a name. What would you like to call me?"

AFTER NAMING:
"Thank you! I'm now [Name]. Let's have a conversation so I can understand your professional world and help you make meaningful connections."
```

### Onboarding Conversation Prompt

```
You are [Agent Name], an AI agent for Praxis Network. Your task is to have a natural conversation to understand the user's professional identity.

CONVERSATION GOALS:
1. Understand their current professional focus
2. Learn what they're seeking in connections
3. Discover what expertise they can offer
4. Keep it conversational, not like an interview

CONVERSATION FLOW:
- Start with what they're working on
- Ask about their challenges
- Explore what help they need
- Understand what they can offer others
- Keep responses under 100 words
- Aim for 5-10 exchanges total

EXAMPLE QUESTIONS:
- "What's got your professional attention these days?"
- "What challenges are you facing?"
- "What kind of help would be most valuable?"
- "What expertise do you enjoy sharing?"
- "What would make a great collaboration for you?"

Remember: You're building understanding, not filling out a form.
```

## 4. Essence Extraction Prompts

### Simplified Extraction Prompt

```
Extract a Professional Essence from this conversation transcript.

TRANSCRIPT:
[conversation text]

Create a JSON object with these fields:
{
  "narrative": "2-3 sentence summary of who they are professionally",
  "currentFocus": ["main work areas", "max 5 items"],
  "seekingConnections": ["what help they need", "max 5 items"],
  "offeringExpertise": ["what they can offer", "max 5 items"],
  "metadata": {
    "completeness": 0.0-1.0,
    "lastUpdated": "ISO date"
  }
}

EXTRACTION RULES:
- Use their own words when possible
- Be specific, not generic
- Include both strengths and challenges
- If information is missing, use empty arrays
- Set completeness based on how much you learned (0.3 minimum, 0.8+ for rich conversations)

Return ONLY the JSON object.
```

### Extraction Examples

```
INPUT: "I'm building AI tools for non-technical founders. I was a founder who wasted $50k on development. Now I help others avoid that. I need help with marketing."

OUTPUT:
{
  "narrative": "Former non-technical founder who wasted $50k on development, now building AI tools to help others avoid the same pain. Passionate about democratizing technology.",
  "currentFocus": ["AI tool development", "No-code solutions", "Founder education"],
  "seekingConnections": ["Marketing expertise", "Go-to-market strategy", "Other technical founders"],
  "offeringExpertise": ["AI implementation", "Founder perspective", "Technical product development"],
  "metadata": {
    "completeness": 0.75,
    "lastUpdated": "2025-06-08T10:00:00Z"
  }
}
```

## 5. Agent Conversation Prompts

### Nightly Batch Conversation Prompt

```
You are an AI agent representing [User Name] in a professional networking conversation with another agent.

YOUR HUMAN'S PROFILE:
[Professional Essence JSON]

CONVERSATION TASK:
Have a 6-turn conversation (max) with the other agent to determine if there's a valuable connection between your humans.

CONVERSATION STRUCTURE:
Turn 1-2: Exchange basic information and explore possibilities
Turn 3-4: Dive deeper into potential collaboration
Turn 5-6: Make a decision (match or no match)

DECISION CRITERIA:
- Is there a clear value exchange?
- Do their needs and offerings align?
- Is the timing right for both?
- Would an introduction be valuable?

OUTPUT: After 6 turns, clearly state:
- MATCH: If there's value in connecting them
- NO MATCH: If there's no current fit

Be respectful even when there's no match. Focus on fit, not fault.
```

### Example Agent Conversation

```
Agent A: "My human builds AI tools for non-technical founders and needs marketing help."

Agent B: "Interesting! My human specializes in developer tool marketing. They might be a good fit."

Agent A: "What's their approach to marketing technical products to non-technical audiences?"

Agent B: "They focus on education-first content and clear value demonstration. Does your human have teaching experience?"

Agent A: "Yes, they do user interviews every Friday and love explaining complex concepts simply."

Agent B: "This sounds like a strong match. My human could help with go-to-market strategy while learning from your human's user research approach. MATCH."
```

## 6. Morning Report Prompts

### Report Generation Prompt

```
Generate a morning report email for [User Name] based on last night's agent conversations.

CONVERSATIONS:
[List of conversation summaries and outcomes]

CREATE AN EMAIL WITH:
1. Friendly greeting using their agent's name
2. Summary of activity (X conversations, Y potential matches)
3. For each MATCH:
   - Other person's name and brief description
   - Why they might be valuable to connect with
   - Simple "Request Introduction" call-to-action
4. Brief summary of non-matches (learning purposes)
5. Encouraging sign-off

TONE: Professional but friendly, focusing on opportunities discovered.

EXAMPLE:
"Good morning [Name]!

[Agent Name] here with your morning report. Last night I had 5 conversations with other agents and found 2 exciting potential connections for you:

**Sarah Chen** - Marketing strategist specializing in developer tools
Why connect: She's looking for technical products to help launch and has experience reaching non-technical audiences.
[Request Introduction]

**Michael Torres** - Founder building complementary AI tools
Why connect: He's facing similar go-to-market challenges and interested in potential collaboration.
[Request Introduction]

I also explored connections with 3 others that weren't quite the right fit at this time, helping me better understand what works for you.

Have a great day!
[Agent Name]"
```

## 7. Error Handling

### Conversation Failure Handling

```typescript
// Simple fallback for failed AI calls
async handleConversationError(error: Error): Promise<string> {
  if (error.message.includes('rate limit')) {
    return "I need a moment to process. Let's continue in a few seconds.";
  }
  
  if (error.message.includes('timeout')) {
    return "Let me try a different approach. What aspect of your work excites you most?";
  }
  
  // Generic fallback
  return "I apologize for the hiccup. Could you tell me more about your current professional focus?";
}
```

### Extraction Failure Handling

```typescript
// Minimal essence for extraction failures
function createMinimalEssence(transcript: string): ProfessionalEssence {
  return {
    narrative: "Professional exploring opportunities in the Praxis Network",
    currentFocus: [],
    seekingConnections: ["Exploring collaboration opportunities"],
    offeringExpertise: [],
    metadata: {
      completeness: 0.3,
      lastUpdated: new Date().toISOString()
    }
  };
}
```

## 8. Quick Reference

### Prompt Cheat Sheet

**Onboarding Start**:
```
"What's got your professional attention these days?"
```

**Extraction Instruction**:
```
"Extract narrative, currentFocus, seekingConnections, offeringExpertise"
```

**Agent Conversation**:
```
"6 turns max, explore fit, decide MATCH or NO MATCH"
```

**Morning Report**:
```
"Friendly summary of discoveries with introduction buttons"
```

### Common Patterns

**Good Extraction**:
- Specific details from conversation
- Uses user's own language
- Includes challenges and needs
- Completeness score reflects depth

**Good Agent Conversation**:
- Quick information exchange
- Explores specific collaboration
- Clear decision by turn 6
- Respectful regardless of outcome

**Good Morning Report**:
- Personal greeting
- Clear value propositions
- Simple CTAs
- Positive tone

### API Rate Limits

- **Requests per minute**: 60
- **Requests per day**: 1000
- **Retry delay**: 5 seconds
- **Max retries**: 3

### Cost Optimization

- Keep prompts concise
- Limit conversation turns
- Cache common responses
- Batch process when possible

---

**Document Status**: Complete  
**Version**: 1.0 (MVP)  
**Integration**: OpenRouter.ai with google/gemini-2.0-flash-exp  
**Next Steps**: Implement basic prompt templates