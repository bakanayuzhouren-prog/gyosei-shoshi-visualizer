export interface DiagramResponse {
  title: string;
  summary: string;
  mermaidCode: string;
  keyPoints: {
    point: string;
    explanation: string;
  }[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  READING = 'READING',
  THINKING = 'THINKING',
  DRAWING = 'DRAWING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  inputPreview: string;
  result: DiagramResponse;
}