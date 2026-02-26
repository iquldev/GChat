export type MessageRole = "user" | "model";

export type MessageStatus = "pending" | "sent" | "received" | "error";

export interface TextPart {
  text: string;
}

export interface InlineDataPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export type ContentPart = TextPart | InlineDataPart;

export interface Chat {
  id: number;
  title: string;
  content: ChatMessage[];
}

export interface ChatMessage {
  id: number;
  role: MessageRole;
  parts: ContentPart[];
  timestamp: string;
  status: MessageStatus;
  model: string;
}

export interface GeminiRequest {
  contents: {
    role: MessageRole;
    parts: ContentPart[];
  }[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };
  safetySettings?: {
    category: string;
    threshold: string;
  }[];
}

export interface GeminiStreamChunk {
  candidates?: {
    content: {
      parts: ContentPart[];
      role: MessageRole;
    };
    finishReason?: string;
    index: number;
    safetyRatings?: {
      category: string;
      probability: string;
    }[];
  }[];
  promptFeedback?: {
    safetyRatings: {
      category: string;
      probability: string;
    }[];
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: ContentPart[];
      role: MessageRole;
    };
    finishReason: string;
    index: number;
    safetyRatings: {
      category: string;
      probability: string;
    }[];
  }[];
  promptFeedback?: {
    safetyRatings: {
      category: string;
      probability: string;
    }[];
  };
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface GeminiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}
