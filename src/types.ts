export type Emotion =
  | 'happy'
  | 'sad'
  | 'hopeful'
  | 'anxious'
  | 'stressed'
  | 'angry'
  | 'tired'
  | 'grateful'
  | 'lonely'
  | 'neutral';

export type Intent =
  | 'asksAboutPal'
  | 'celebration'
  | 'discouragement'
  | 'overwhelm'
  | 'fatigue'
  | 'gratitude'
  | 'connection'
  | 'general';

export type RobotAnimation =
  | 'cheer'
  | 'comfort'
  | 'hope'
  | 'breathe'
  | 'calm'
  | 'sleepy'
  | 'idle';

export interface EmotionResult {
  primary: Emotion;
  compound: Emotion[];
  intents: Intent[];
  intensity: 'low' | 'medium' | 'high';
  isCrisis: boolean;
  animation: RobotAnimation;
  summary: string;
}

export interface CheckIn {
  id: string;
  createdAt: string;
  transcript: string;
  response: string;
  result: EmotionResult;
  audioBlob?: Blob;
}

export interface Customization {
  shell: string;
  face: string;
  mouth: string;
  antenna: string;
  arms: string;
  accessory: string;
  room: string;
}

export interface ProgressState {
  xp: number;
  parts: number;
  streak: number;
  lastCheckInDate: string | null;
}
