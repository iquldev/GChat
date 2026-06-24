export type MessageRole = "user" | "model" | "assistant" | "system";

export type MessageStatus =
  | "pending"
  | "sent"
  | "received"
  | "error"
  | "streaming";

export interface TextPart {
  text: string;
}

export interface InlineDataPart {
  inlineData: {
    mimeType: string;
    data: string; // base64
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
  model?: string; // optional for system-like messages
}

// OpenRouter message item shapes
export interface OpenRouterTextItem {
  type: "text";
  text: string;
}

export interface OpenRouterImageItem {
  type: "image_url";
  image_url: {
    url: string;
  };
}

export type OpenRouterContent = string | Array<OpenRouterTextItem | OpenRouterImageItem>;

export interface OpenRouterMessage {
  role: "user" | "assistant" | "system";
  content: OpenRouterContent;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  stream?: boolean;
}

export interface OpenRouterStreamChunkChoiceDelta {
  content?: string;
  role?: string;
}

export interface OpenRouterStreamChunkChoice {
  delta?: OpenRouterStreamChunkChoiceDelta;
  finish_reason?: string | null;
  index: number;
}

export interface OpenRouterStreamChunk {
  choices?: OpenRouterStreamChunkChoice[];
  error?: {
    code: number;
    message: string;
  };
}
