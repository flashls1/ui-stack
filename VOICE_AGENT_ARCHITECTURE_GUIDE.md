# 🎙️ Google Gemini Live Voice Agent - Universal Implementation Guide

> **Purpose:** Complete, reusable template for implementing AI voice agents with Google Gemini Live API  
> **Version:** 1.0  
> **Last Updated:** 2026-02-04

---

## 🚨 CRITICAL RULES (Read First)

### SDK PROHIBITION
**THE GOOGLE GEN AI SDK (`@google/genai`) IS STRICTLY PROHIBITED FOR VOICE.**

| Rule | Why |
|------|-----|
| NO SDK | SDK abstracts audio handling, breaking PCM processing |
| RAW WEBSOCKET ONLY | All voice logic MUST use native `WebSocket` API |
| REASON | Need direct control: 48kHz→16kHz resampling, PCM16 byte handling, jitter buffer |

### AUDIO REQUIREMENTS (NON-NEGOTIABLE)

| Parameter | Input (Mic → Gemini) | Output (Gemini → Speaker) |
|-----------|---------------------|---------------------------|
| **Sample Rate** | 16,000 Hz | 24,000 Hz |
| **Bit Depth** | 16-bit signed int | 16-bit signed int |
| **Channels** | Mono | Mono |
| **Format** | PCM16LE | PCM16LE |
| **Frame Size** | 320 samples (20ms) | Variable |

---

## 📋 TABLE OF CONTENTS

1. [Architecture Overview](#1-architecture-overview)
2. [API Configuration](#2-api-configuration)
3. [Database Schema](#3-database-schema)
4. [Server-Side Implementation](#4-server-side-implementation)
5. [Client-Side Implementation](#5-client-side-implementation)
6. [AudioWorklet Processor](#6-audioworklet-processor)
7. [Tool System](#7-tool-system)
8. [Voice Options](#8-voice-options)
9. [System Instruction Design](#9-system-instruction-design)
10. [WebSocket Message Formats](#10-websocket-message-formats)
11. [Error Handling](#11-error-handling)
12. [Setup Checklist](#12-setup-checklist)

---

## 1. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VOICE AGENT ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐         ┌─────────────┐         ┌─────────────────────┐  │
│   │   BROWSER   │◄──WS───►│   SERVER    │◄──WSS──►│  GEMINI LIVE API   │  │
│   │   CLIENT    │         │   (Proxy)   │         │  (Google Cloud)     │  │
│   └─────────────┘         └─────────────┘         └─────────────────────┘  │
│                                                                             │
│   User Input:             Server Functions:        AI Processing:          │
│   - Mic capture           - API key security       - Voice synthesis       │
│   - 16kHz PCM16           - Auth/permissions       - 24kHz PCM16 output   │
│   - AudioWorklet          - Tool execution         - Tool calls            │
│   - WebSocket client      - Session management     - Personality/persona   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why This Architecture?

1. **API Key Security** - Keys stay server-side, never exposed to browser
2. **Tool Execution** - Server can execute tools with database access
3. **Permission Control** - Server validates user can access tools/agents
4. **Session Tracking** - Log all interactions for debugging/analytics

---

## 2. API CONFIGURATION

### Gemini WebSocket URL

```javascript
// Use v1beta for stability (v1alpha is unstable)
const GEMINI_WS_URL = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';
```

### Model Name

```javascript
const GEMINI_MODEL = 'models/gemini-2.5-flash-native-audio-preview-12-2025';

// Fallback (non-native audio)
const GEMINI_MODEL_FALLBACK = 'models/gemini-2.0-flash-exp';
```

### Environment Variables

```env
# Required
GEMINI_API_KEY=AIza...

# Database (adjust for your backend)
DATABASE_URL=postgresql://...

# Optional integrations
YOUTUBE_API_KEY=AIza...
```

---

## 3. DATABASE SCHEMA

### 3.1 voice_agents (Core Agent Configuration)

```sql
CREATE TABLE voice_agents (
  agent_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  voice_name text NOT NULL DEFAULT 'Aoede',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  roles_enabled text[] DEFAULT ARRAY['user']::text[],
  admin_only boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX voice_agents_status_idx ON voice_agents(status);
```

### 3.2 voice_agent_personas (Personality/Bio)

```sql
CREATE TABLE voice_agent_personas (
  agent_id uuid PRIMARY KEY REFERENCES voice_agents(agent_id) ON DELETE CASCADE,
  bio text NOT NULL,  -- This becomes the system instruction
  personality_traits text[],
  communication_style text,
  greeting_message text,  -- Optional custom greeting
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 3.3 role_tool_permissions (Tool Access Control)

```sql
CREATE TABLE role_tool_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  tool_name text NOT NULL,
  allowed boolean NOT NULL DEFAULT false,
  rate_class text DEFAULT 'realtime_safe' CHECK (rate_class IN ('realtime_safe', 'background_only')),
  description text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT role_tool_permissions_unique UNIQUE (role, tool_name)
);

CREATE INDEX role_tool_permissions_role_idx ON role_tool_permissions(role);
```

### 3.4 voice_sessions (Session Tracking)

```sql
CREATE TABLE voice_sessions (
  session_id text PRIMARY KEY,
  user_id uuid NOT NULL,
  agent_id uuid REFERENCES voice_agents(agent_id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'error')),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  end_reason text,
  error_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX voice_sessions_user_idx ON voice_sessions(user_id);
CREATE INDEX voice_sessions_status_idx ON voice_sessions(status);
```

### 3.5 user_memory_items (Persistent Memory)

```sql
CREATE TABLE user_memory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'general',
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  source text DEFAULT 'voice',
  session_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX user_memory_items_user_idx ON user_memory_items(user_id);
CREATE INDEX user_memory_items_type_idx ON user_memory_items(type);
```

### 3.6 tool_audit_log (Tool Call Tracking)

```sql
CREATE TABLE tool_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  session_id text,
  role text NOT NULL,
  tool_name text NOT NULL,
  input_payload jsonb,
  output_status text NOT NULL,
  error_message text,
  latency_ms integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX tool_audit_log_created_idx ON tool_audit_log(created_at DESC);
```

---

## 4. SERVER-SIDE IMPLEMENTATION

### 4.1 Session Config Endpoint

Returns configuration for starting a voice session.

```typescript
// Pseudocode - adapt to your framework (Express, Deno, etc.)

interface VoiceSessionConfig {
  model: string;
  voice: string;
  systemInstruction: string;
  tools: ToolDeclaration[];
  apiKey: string;
}

async function getVoiceSessionConfig(
  agentId: string,
  userId: string,
  userRole: string
): Promise<VoiceSessionConfig> {
  
  // 1. Get agent from database
  const agent = await db.query(`
    SELECT a.*, p.bio, p.personality_traits, p.communication_style
    FROM voice_agents a
    LEFT JOIN voice_agent_personas p ON a.agent_id = p.agent_id
    WHERE a.agent_id = $1 AND a.status = 'active'
  `, [agentId]);
  
  // 2. Validate user can access this agent
  if (agent.admin_only && userRole !== 'admin') {
    throw new Error('Agent requires admin access');
  }
  
  // 3. Get tools user is allowed to use
  const tools = await db.query(`
    SELECT tool_name, description
    FROM role_tool_permissions
    WHERE role = $1 AND allowed = true
  `, [userRole]);
  
  // 4. Build system instruction
  const systemInstruction = buildSystemInstruction(agent);
  
  // 5. Return config
  return {
    model: 'models/gemini-2.5-flash-native-audio-preview-12-2025',
    voice: agent.voice_name,
    systemInstruction,
    tools: [{ function_declarations: formatToolsForGemini(tools) }],
    apiKey: process.env.GEMINI_API_KEY
  };
}

function buildSystemInstruction(agent: Agent): string {
  return `
[SYSTEM CAPABILITY: ACTIVE]
You are ${agent.name}.

## Personality
${agent.personality_traits?.join(', ') || 'Friendly and helpful'}

## Communication Style
${agent.communication_style || 'Conversational and warm'}

## Core Instructions
${agent.bio}

## Rules
- Stay in character at all times
- Use available tools when appropriate
- Be concise in voice responses (users are listening, not reading)
`.trim();
}
```

### 4.2 Tool Invoke Endpoint

Executes tool calls from the AI.

```typescript
interface ToolRequest {
  tool_name: string;
  session_id: string;
  input: Record<string, unknown>;
}

interface ToolResponse {
  ok: boolean;
  requestId: string;
  data: unknown | null;
  error: { code: string; message: string } | null;
}

async function toolInvoke(
  req: ToolRequest,
  userId: string,
  userRole: string
): Promise<ToolResponse> {
  
  const requestId = `req_${Date.now().toString(36)}`;
  const startTime = Date.now();
  
  // 1. Check permission
  const permission = await db.query(`
    SELECT allowed FROM role_tool_permissions
    WHERE role = $1 AND tool_name = $2
  `, [userRole, req.tool_name]);
  
  if (!permission?.allowed) {
    await logToolAudit(userId, req, 'forbidden', Date.now() - startTime);
    return {
      ok: false,
      requestId,
      data: null,
      error: { code: 'FORBIDDEN', message: `Tool '${req.tool_name}' not allowed` }
    };
  }
  
  // 2. Execute tool
  try {
    const result = await executeTool(req.tool_name, req.input, userId);
    await logToolAudit(userId, req, 'success', Date.now() - startTime);
    return { ok: true, requestId, data: result, error: null };
  } catch (err) {
    await logToolAudit(userId, req, 'error', Date.now() - startTime, err.message);
    return {
      ok: false,
      requestId,
      data: null,
      error: { code: 'TOOL_ERROR', message: err.message }
    };
  }
}

async function executeTool(
  toolName: string,
  input: Record<string, unknown>,
  userId: string
): Promise<unknown> {
  
  switch (toolName) {
    case 'memory_save':
      return await saveMemory(userId, input.type, input.content, input.tags);
    
    case 'memory_list':
      return await listMemories(userId, input.search, input.limit);
    
    // Add your custom tools here
    case 'design_preference_save':
      return await saveDesignPreference(userId, input.category, input.value);
    
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
```

---

## 5. CLIENT-SIDE IMPLEMENTATION

### Complete GeminiLiveClient.js

```javascript
/**
 * Gemini Live Voice Client
 * 
 * PURE WEBSOCKET - NO SDK
 * 
 * Audio Architecture:
 * - INPUT: Hardware native rate → Downsample to 16kHz → PCM16 → Base64 → Gemini
 * - OUTPUT: Gemini → Base64 → PCM16 → Float32 → 24kHz AudioContext → Speaker
 */

const GEMINI_WS_URL = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';
const GEMINI_MODEL = 'models/gemini-2.5-flash-native-audio-preview-12-2025';

// AudioWorklet code (embedded as string)
const WORKLET_CODE = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(0);
    this.frameSize = 320;  // 20ms at 16kHz
    this.targetRate = 16000;
  }
  
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    
    const sourceRate = globalThis.sampleRate;
    const downsampled = this.downsample(input[0], sourceRate, this.targetRate);
    
    // Accumulate
    const newBuffer = new Float32Array(this.buffer.length + downsampled.length);
    newBuffer.set(this.buffer);
    newBuffer.set(downsampled, this.buffer.length);
    this.buffer = newBuffer;
    
    // Send complete frames
    while (this.buffer.length >= this.frameSize) {
      const frame = this.buffer.slice(0, this.frameSize);
      this.buffer = this.buffer.slice(this.frameSize);
      const int16 = this.float32ToInt16(frame);
      this.port.postMessage(int16.buffer, [int16.buffer]);
    }
    
    return true;
  }
  
  downsample(input, sourceRate, targetRate) {
    if (sourceRate === targetRate) return input;
    const ratio = sourceRate / targetRate;
    const outputLength = Math.floor(input.length / ratio);
    const output = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      const srcIndex = i * ratio;
      const floor = Math.floor(srcIndex);
      const ceil = Math.min(floor + 1, input.length - 1);
      const frac = srcIndex - floor;
      output[i] = input[floor] * (1 - frac) + input[ceil] * frac;
    }
    return output;
  }
  
  float32ToInt16(float32) {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const clamped = Math.max(-1, Math.min(1, float32[i]));
      int16[i] = Math.round(clamped * 32767);
    }
    return int16;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;

export class GeminiLiveClient {
  constructor(config, callbacks = {}) {
    // Config
    this.apiKey = config.apiKey;
    this.model = config.model || GEMINI_MODEL;
    this.voice = config.voice || 'Aoede';
    this.systemInstruction = config.systemInstruction || '';
    this.tools = config.tools || [];
    
    // Callbacks
    this.onSetupComplete = callbacks.onSetupComplete || (() => {});
    this.onAudio = callbacks.onAudio || (() => {});
    this.onToolCall = callbacks.onToolCall || (() => {});
    this.onTranscript = callbacks.onTranscript || (() => {});
    this.onTurnComplete = callbacks.onTurnComplete || (() => {});
    this.onInterrupted = callbacks.onInterrupted || (() => {});
    this.onError = callbacks.onError || (() => {});
    this.onDisconnect = callbacks.onDisconnect || (() => {});
    
    // State
    this.ws = null;
    this.inputContext = null;
    this.playbackContext = null;
    this.audioQueue = [];
    this.nextStartTime = 0;
    this.isPlaying = false;
    this.activeSources = [];
  }
  
  // ==================== CONNECTION ====================
  
  async connect() {
    // Create playback context at 24kHz (Gemini output rate)
    this.playbackContext = new AudioContext({ sampleRate: 24000 });
    await this.playbackContext.resume();
    this.nextStartTime = this.playbackContext.currentTime;
    
    // Connect to Gemini
    const wsUrl = `${GEMINI_WS_URL}?key=${this.apiKey}`;
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => this._sendSetupMessage();
    this.ws.onmessage = (e) => this._handleMessage(JSON.parse(e.data));
    this.ws.onerror = (e) => this.onError(e);
    this.ws.onclose = (e) => this.onDisconnect(e.code, e.reason);
  }
  
  _sendSetupMessage() {
    const setup = {
      setup: {
        model: this.model,
        generation_config: {
          response_modalities: ['AUDIO'],  // CRITICAL: Only AUDIO
          speech_config: {
            voice_config: {
              prebuilt_voice_config: {
                voice_name: this.voice
              }
            }
          }
        },
        system_instruction: {
          parts: [{ text: this.systemInstruction }]
        },
        // Optional: Add tools if provided
        ...(this.tools.length > 0 && { tools: this.tools }),
        // Optional: Enable transcriptions
        input_audio_transcription: {},
        output_audio_transcription: {}
      }
    };
    
    this.ws.send(JSON.stringify(setup));
  }
  
  _sendProactiveGreeting() {
    // "Spark" turn - triggers AI to greet (v1beta doesn't have proactivity)
    const spark = {
      client_content: {
        turns: [{
          role: 'user',
          parts: [{ text: 'System connected. Introduce yourself.' }]
        }],
        turn_complete: true
      }
    };
    this.ws.send(JSON.stringify(spark));
  }
  
  // ==================== MESSAGE HANDLING ====================
  
  _handleMessage(data) {
    if (data.setupComplete) {
      this._sendProactiveGreeting();
      this.onSetupComplete();
      return;
    }
    
    if (data.serverContent) {
      this._handleServerContent(data.serverContent);
    }
    
    if (data.toolCall) {
      this.onToolCall(data.toolCall);
    }
  }
  
  _handleServerContent(content) {
    // Handle interruption (user spoke during AI response)
    if (content.interrupted) {
      this._clearAudioQueue();
      this.onInterrupted();
      return;
    }
    
    // Handle transcriptions
    if (content.inputTranscription?.text) {
      this.onTranscript('user', content.inputTranscription.text);
    }
    if (content.outputTranscription?.text) {
      this.onTranscript('assistant', content.outputTranscription.text);
    }
    
    // Handle model response parts
    if (content.modelTurn?.parts) {
      for (const part of content.modelTurn.parts) {
        if (part.inlineData) {
          this._playAudio(part.inlineData.data);
        }
        if (part.functionCall) {
          this.onToolCall(part.functionCall);
        }
      }
    }
    
    if (content.turnComplete) {
      this.onTurnComplete();
    }
  }
  
  // ==================== AUDIO PLAYBACK ====================
  
  _playAudio(base64Audio) {
    // Decode base64 to bytes
    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // Convert PCM16 to Float32
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }
    
    // Queue and play
    this.audioQueue.push(float32);
    if (!this.isPlaying) {
      this._drainAudioQueue();
    }
  }
  
  _drainAudioQueue() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }
    
    this.isPlaying = true;
    const ctx = this.playbackContext;
    
    // Merge all queued chunks
    const total = this.audioQueue.reduce((sum, c) => sum + c.length, 0);
    const merged = new Float32Array(total);
    let offset = 0;
    for (const chunk of this.audioQueue) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    this.audioQueue = [];
    
    // Create and play buffer
    const buffer = ctx.createBuffer(1, merged.length, 24000);
    buffer.getChannelData(0).set(merged);
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    const now = ctx.currentTime;
    const startTime = Math.max(now + 0.01, this.nextStartTime);
    source.start(startTime);
    
    this.nextStartTime = startTime + (merged.length / 24000);
    this.activeSources.push(source);
    
    source.onended = () => {
      this.activeSources = this.activeSources.filter(s => s !== source);
      if (this.audioQueue.length > 0) {
        this._drainAudioQueue();
      } else {
        this.isPlaying = false;
      }
    };
  }
  
  _clearAudioQueue() {
    this.audioQueue = [];
    for (const source of this.activeSources) {
      try { source.stop(); } catch {}
    }
    this.activeSources = [];
    if (this.playbackContext) {
      this.nextStartTime = this.playbackContext.currentTime;
    }
    this.isPlaying = false;
  }
  
  // ==================== MICROPHONE ====================
  
  async startMicrophone() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    // Create input context at hardware native rate
    this.inputContext = new AudioContext();
    await this.inputContext.resume();
    
    // Load AudioWorklet
    const blob = new Blob([WORKLET_CODE], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    await this.inputContext.audioWorklet.addModule(url);
    
    const worklet = new AudioWorkletNode(this.inputContext, 'pcm-processor');
    
    worklet.port.onmessage = (event) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const base64 = this._toBase64(new Uint8Array(event.data));
        this.ws.send(JSON.stringify({
          realtimeInput: {
            audio: {
              mimeType: 'audio/pcm;rate=16000',
              data: base64
            }
          }
        }));
      }
    };
    
    const source = this.inputContext.createMediaStreamSource(stream);
    source.connect(worklet);
  }
  
  stopMicrophone() {
    if (this.inputContext) {
      this.inputContext.close();
      this.inputContext = null;
    }
  }
  
  _toBase64(buffer) {
    let binary = '';
    for (let i = 0; i < buffer.length; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
  }
  
  // ==================== TOOL RESPONSES ====================
  
  sendToolResponse(callId, name, response) {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    
    this.ws.send(JSON.stringify({
      toolResponse: {
        functionResponses: [{
          id: callId,
          name: name,
          response: { result: response }
        }]
      }
    }));
  }
  
  // ==================== UTILITIES ====================
  
  sendText(text) {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    
    this.ws.send(JSON.stringify({
      client_content: {
        turns: [{ role: 'user', parts: [{ text }] }],
        turn_complete: true
      }
    }));
  }
  
  disconnect() {
    this.stopMicrophone();
    if (this.playbackContext) {
      this.playbackContext.close();
      this.playbackContext = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

---

## 6. AUDIOWORKLET PROCESSOR

If you prefer a separate file instead of embedded:

**`/public/pcm-processor.js`**

```javascript
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(0);
    this.frameSize = 320;  // 20ms at 16kHz
    this.targetRate = 16000;
    this.NOISE_GATE_THRESHOLD = 0.005;  // Skip very quiet frames
    this.silentFramesSent = 0;
  }
  
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    
    const sourceRate = globalThis.sampleRate;
    const downsampled = this.downsample(input[0], sourceRate, this.targetRate);
    
    // Check noise gate
    const rms = Math.sqrt(downsampled.reduce((sum, x) => sum + x * x, 0) / downsampled.length);
    if (rms < this.NOISE_GATE_THRESHOLD) {
      this.silentFramesSent++;
      // Send one frame every 50 to keep connection alive
      if (this.silentFramesSent < 50) return true;
      this.silentFramesSent = 0;
    } else {
      this.silentFramesSent = 0;
    }
    
    // Accumulate
    const newBuffer = new Float32Array(this.buffer.length + downsampled.length);
    newBuffer.set(this.buffer);
    newBuffer.set(downsampled, this.buffer.length);
    this.buffer = newBuffer;
    
    // Send complete frames
    while (this.buffer.length >= this.frameSize) {
      const frame = this.buffer.slice(0, this.frameSize);
      this.buffer = this.buffer.slice(this.frameSize);
      const int16 = this.float32ToInt16(frame);
      this.port.postMessage(int16.buffer, [int16.buffer]);
    }
    
    return true;
  }
  
  downsample(input, sourceRate, targetRate) {
    if (sourceRate === targetRate) return input;
    const ratio = sourceRate / targetRate;
    const len = Math.floor(input.length / ratio);
    const output = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const idx = i * ratio;
      const floor = Math.floor(idx);
      const ceil = Math.min(floor + 1, input.length - 1);
      const frac = idx - floor;
      output[i] = input[floor] * (1 - frac) + input[ceil] * frac;
    }
    return output;
  }
  
  float32ToInt16(float32) {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      int16[i] = Math.round(Math.max(-1, Math.min(1, float32[i])) * 32767);
    }
    return int16;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
```

---

## 7. TOOL SYSTEM

### 7.1 Tool Declaration Format

```javascript
const TOOLS = [{
  function_declarations: [
    {
      name: 'tool_name',
      description: 'What this tool does and when to use it',
      parameters: {
        type: 'OBJECT',
        properties: {
          param1: { type: 'STRING', description: 'Description' },
          param2: { type: 'NUMBER', description: 'Description' },
          param3: { type: 'BOOLEAN', description: 'Description' },
          param4: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Description' }
        },
        required: ['param1']
      }
    }
  ]
}];
```

### 7.2 Common Tool Types

```javascript
// Memory tools
const MEMORY_TOOLS = [
  {
    name: 'memory_save',
    description: 'Save important information about the user to long-term memory. Use when user shares preferences, facts, or asks you to remember something.',
    parameters: {
      type: 'OBJECT',
      properties: {
        type: { type: 'STRING', description: 'Category: preference, fact, goal, relationship' },
        content: { type: 'STRING', description: 'What to remember' },
        tags: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Optional tags' }
      },
      required: ['type', 'content']
    }
  },
  {
    name: 'memory_list',
    description: 'Search your memories about this user.',
    parameters: {
      type: 'OBJECT',
      properties: {
        search: { type: 'STRING', description: 'Search term' },
        type: { type: 'STRING', description: 'Filter by type' },
        limit: { type: 'INTEGER', description: 'Max results (default 10)' }
      },
      required: []
    }
  }
];

// Session tools
const SESSION_TOOLS = [
  {
    name: 'session_end',
    description: 'End the voice session. Use when user says goodbye or wants to disconnect.',
    parameters: {
      type: 'OBJECT',
      properties: {
        reason: { type: 'STRING', description: 'Why session ended: user_requested, session_timeout, error' }
      },
      required: ['reason']
    }
  }
];
```

### 7.3 Handling Tool Calls (React Example)

```jsx
function VoiceChat() {
  const clientRef = useRef(null);
  
  const handleToolCall = async (toolCall) => {
    const { id, name, args } = toolCall;
    
    // Call your backend
    const response = await fetch('/api/tool-invoke', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tool_name: name,
        session_id: sessionId,
        input: args
      })
    });
    
    const result = await response.json();
    
    // Send response back to Gemini
    clientRef.current.sendToolResponse(id, name, result.data);
  };
  
  const startVoice = async () => {
    const client = new GeminiLiveClient(
      {
        apiKey: config.apiKey,
        voice: 'Aoede',
        systemInstruction: 'You are a helpful assistant...',
        tools: [{ function_declarations: [...MEMORY_TOOLS, ...SESSION_TOOLS] }]
      },
      {
        onSetupComplete: () => console.log('Connected!'),
        onToolCall: handleToolCall,
        onError: (e) => console.error(e)
      }
    );
    
    await client.connect();
    await client.startMicrophone();
    clientRef.current = client;
  };
  
  return <button onClick={startVoice}>Start Voice</button>;
}
```

---

## 8. VOICE OPTIONS

### Available Prebuilt Voices

| Voice | Description | Best For |
|-------|-------------|----------|
| `Aoede` | Warm, friendly female | Supportive, emotional |
| `Callirrhoe` | Professional, neutral female | Business, assistants |
| `Leda` | Young, expressive female | Casual, energetic |
| `Kore` | Valley girl, California | Casual, social |
| `Zephyr` | Calm, measured female | Professional, quiet |
| `Laomedeia` | Strong, assertive female | Confident, direct |
| `Charon` | Deep male | Serious, authoritative |
| `Fenrir` | Gruff male | Edgy, character |
| `Puck` | Playful, lighter male | Fun, casual |

### Setting Voice in Config

```javascript
generation_config: {
  response_modalities: ['AUDIO'],
  speech_config: {
    voice_config: {
      prebuilt_voice_config: {
        voice_name: 'Aoede'  // Pick from table above
      }
    }
  }
}
```

---

## 9. SYSTEM INSTRUCTION DESIGN

### Best Practices

1. **Start with identity** - Tell the AI what it is
2. **Define personality** - Be specific about tone
3. **Set boundaries** - What should/shouldn't it do
4. **Include tool instructions** - When to use each tool
5. **Keep it concise for voice** - Users are listening, not reading

### Template

```javascript
const systemInstruction = `
[SYSTEM CAPABILITY: ACTIVE]
You are ${agentName}, ${roleDescription}.

## Core Personality
- Trait 1
- Trait 2
- Trait 3

## Communication Style
${styleDescription}

## Your Mission
${missionDescription}

## Tool Usage
- Use memory_save when user shares personal information
- Use session_end when user wants to disconnect
- ${customToolInstructions}

## Rules
- Always stay in character
- Be concise - users are listening, not reading
- ${customRules}
`;
```

### Example: Design Consultant

```javascript
const designConsultantPrompt = `
[SYSTEM CAPABILITY: ACTIVE]
You are a friendly AI design consultant helping users create websites.

## Personality
- Enthusiastic about design
- Patient and encouraging
- Uses simple, non-technical language

## Your Process
1. Ask about their business/purpose
2. Explore color preferences
3. Discuss typography style
4. Understand layout preferences
5. Summarize and confirm before generating

## Rules
- Ask ONE question at a time
- Use design_preference_save after each answer
- Be encouraging regardless of their design knowledge
- Keep responses under 30 seconds of speech
`;
```

---

## 10. WEBSOCKET MESSAGE FORMATS

### Client → Gemini

**Audio Input:**
```json
{
  "realtimeInput": {
    "audio": {
      "mimeType": "audio/pcm;rate=16000",
      "data": "<base64-pcm16>"
    }
  }
}
```

**Text Input:**
```json
{
  "client_content": {
    "turns": [{
      "role": "user",
      "parts": [{ "text": "Hello" }]
    }],
    "turn_complete": true
  }
}
```

**Tool Response:**
```json
{
  "toolResponse": {
    "functionResponses": [{
      "id": "<call-id>",
      "name": "<tool-name>",
      "response": { "result": { ... } }
    }]
  }
}
```

### Gemini → Client

**Setup Complete:**
```json
{ "setupComplete": {} }
```

**Audio Output:**
```json
{
  "serverContent": {
    "modelTurn": {
      "parts": [{
        "inlineData": {
          "mimeType": "audio/pcm;rate=24000",
          "data": "<base64-pcm16>"
        }
      }]
    }
  }
}
```

**Tool Call:**
```json
{
  "serverContent": {
    "modelTurn": {
      "parts": [{
        "functionCall": {
          "id": "<call-id>",
          "name": "<tool-name>",
          "args": { ... }
        }
      }]
    }
  }
}
```

**Turn Complete:**
```json
{
  "serverContent": {
    "turnComplete": true
  }
}
```

**Interruption:**
```json
{
  "serverContent": {
    "interrupted": true
  }
}
```

---

## 11. ERROR HANDLING

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| WebSocket 1007 | Invalid setup message | Check for unsupported fields |
| WebSocket 1000 after setup | Auth failed | Verify API key |
| No audio output | Wrong sample rate | Ensure 24kHz playback context |
| Choppy audio | No gapless scheduling | Use nextStartTime pattern |
| Silent AI | Content filtered | Simplify system instruction |

### Invalid Setup Fields (v1beta)

**DO NOT include in setup message:**
- `proactivity` - Not supported on v1beta
- `enable_affective_dialog` - Causes errors
- `tool_config` - Not a valid field
- `safety_settings` - Not supported for voice model

### Debug Logging

```javascript
// Log setup message (remove apiKey for security)
console.log('Setup:', JSON.stringify({
  ...setupMessage,
  setup: { ...setupMessage.setup, apiKey: '[REDACTED]' }
}, null, 2));

// Log audio stats
console.log(`Playback: ${playbackContext.sampleRate}Hz`);
console.log(`Input: ${inputContext.sampleRate}Hz`);
console.log(`Queue length: ${audioQueue.length}`);
```

---

## 12. SETUP CHECKLIST

### Before You Start

- [ ] Gemini API key obtained
- [ ] Database tables created
- [ ] Server endpoints implemented
- [ ] Client code in place

### Audio Configuration

- [ ] Playback AudioContext at 24000 Hz
- [ ] Input uses hardware native rate
- [ ] AudioWorklet downsamples to 16kHz
- [ ] Binary/base64 conversion correct

### Setup Message

- [ ] Model: `models/gemini-2.5-flash-native-audio-preview-12-2025`
- [ ] `response_modalities: ['AUDIO']` (not `['TEXT', 'AUDIO']`)
- [ ] Voice name from supported list
- [ ] System instruction included
- [ ] NO unsupported fields (proactivity, tool_config, safety_settings)

### Integration

- [ ] Tool permissions seeded in database
- [ ] Tool invoke endpoint handles all declared tools
- [ ] Audit logging in place
- [ ] Error handling complete

### Testing

- [ ] Connection establishes (setupComplete received)
- [ ] Can hear AI greeting
- [ ] Microphone audio reaches AI
- [ ] Tools execute and respond correctly
- [ ] Interruption clears audio properly

---

*This is a complete, reusable template for Google Gemini Live Voice agents. Copy this file to your new project and follow the setup checklist.*
