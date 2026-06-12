export type MessageRole = "user" | "model";

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

export interface OpenRouterMessage {
  role: "user" | "assistant" | "system";
  content: string | Array<{
    type: "text" | "image_url";
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  stream?: boolean;
}

export interface OpenRouterStreamChunk {
  choices?: {
    delta?: {
      content?: string;
      role?: string;
    };
    finish_reason?: string | null;
    index: number;
  }[];
  error?: {
    code: number;
    message: string;
  };
}
