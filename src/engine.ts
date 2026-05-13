import type { Emotion, EmotionResult, Intent, RobotAnimation } from './types';

const emotionSignals: Record<Emotion, string[]> = {
  happy: ['great', 'good', 'happy', 'excited', 'awesome', 'amazing', 'proud', 'joy', 'glad', 'fantastic', 'wonderful', 'won'],
  sad: ['sad', 'down', 'bummed', 'bad', 'not doing', 'rough', 'cry', 'hurt', 'lonely', 'upset', 'blue'],
  hopeful: ['trying', 'hope', 'hopeful', 'maybe', 'getting there', 'i can', 'keep going', 'better soon', 'still here'],
  anxious: ['anxious', 'nervous', 'worried', 'scared', 'panic', 'afraid', 'uneasy', 'spiral'],
  stressed: ['stressed', 'too much', 'overwhelmed', "can't keep up", 'busy', 'pressure', 'deadline'],
  angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'unfair'],
  tired: ['tired', 'drained', 'exhausted', 'sleepy', 'worn out', 'no energy', 'burned out'],
  grateful: ['grateful', 'thankful', 'thanks', 'appreciate', 'lucky', 'blessed'],
  lonely: ['alone', 'lonely', 'isolated', 'miss', 'no one', 'left out'],
  neutral: []
};

const intentSignals: Record<Intent, string[]> = {
  asksAboutPal: ['how are you', 'how is yours', 'how about you', 'what about you', 'what about yours', 'and you'],
  celebration: ['great', 'proud', 'got it done', 'finished', 'won', 'awesome', 'nailed'],
  discouragement: ['not doing', 'bummed', 'trying', 'rough', 'bad day', 'hard day'],
  overwhelm: ['too much', 'overwhelmed', 'stressed', "can't keep up", 'pressure'],
  fatigue: ['tired', 'drained', 'exhausted', 'sleepy', 'worn out'],
  gratitude: ['grateful', 'thankful', 'thanks', 'appreciate'],
  connection: ['alone', 'lonely', 'miss', 'how are you', 'how about you'],
  general: []
};

const crisisSignals = [
  'kill myself',
  'end my life',
  'want to die',
  'suicide',
  'hurt myself',
  'self harm',
  'self-harm',
  'not safe with myself'
];

const highIntensitySignals = ['really', 'so ', 'very', 'extremely', 'always', 'never', "can't", 'panic', 'furious', 'exhausted'];

const responsePacks: Record<string, string[]> = {
  crisis: [
    'I am really glad you said something. I am not equipped for emergencies, but you deserve immediate human support. Please contact a trusted person now, and if you might be in danger, call your local emergency number or a crisis line right away.'
  ],
  'happy:asksAboutPal': [
    'That is great to hear. I am doing brighter now that I know your day is treating you well.',
    'I love that check-in. My circuits are doing a little victory dance with you.',
    'That sounds like a good day worth saving. Mine feels better because you shared it with me.'
  ],
  'sad+hopeful:asksAboutPal': [
    'I am sorry today feels heavy, but I hear the trying part too. I will be even better once I know you are giving yourself some credit for staying with it.',
    'That sounds hard, and still there is a spark in what you said. I am here with you, and my day improves when you get a little more room to breathe.',
    'Bummed but trying is still brave. I am steady over here, and I am rooting for your next small step.'
  ],
  'sad:asksAboutPal': [
    'I am sorry today is sitting heavy. I am here, and I will feel better when you have a softer minute to land.',
    'That sounds painful. I am staying close in companion mode, one quiet beep at a time.',
    'I wish today was easier on you. I am okay, and I care more about helping you feel less alone right now.'
  ],
  'anxious:overwhelm': [
    'That sounds like a lot at once. Try naming the smallest next thing, then let the rest wait outside the room for a minute.',
    'Your system sounds overloaded. I am switching to steady-light mode: one breath, one task, one tiny win.',
    'Pressure can make everything look bigger. Pick one piece we can place on the table first.'
  ],
  'stressed:overwhelm': [
    'That is a full dashboard. Let us dim the noise and choose the next doable button, not the whole mission.',
    'Too much is still allowed to be handled one piece at a time. I am lining up the tiny tools.',
    'You do not need to solve the entire pile in one move. Start with the smallest piece that lowers the pressure.'
  ],
  'angry:general': [
    'That frustration makes sense from what you said. I am venting a tiny steam puff with you, then we can decide what deserves your energy.',
    'I hear the heat in that. Let us protect your peace before the problem gets to drive.',
    'That would annoy my bolts too. Give yourself a second before choosing the next move.'
  ],
  'tired:fatigue': [
    'Your battery sounds low. No heroic mode required right now; even a tiny recharge counts.',
    'I am lowering the lights for you. Rest is not losing progress; it is maintenance.',
    'That sounds draining. Let the next step be smaller than your tired brain is demanding.'
  ],
  'grateful:gratitude': [
    'That gratitude is worth saving. I am tucking it into the good-things folder.',
    'I like hearing what mattered today. Tiny bright spots still count as real power.',
    'That is a warm signal. I am glad you noticed it.'
  ],
  'lonely:connection': [
    'Feeling alone can be heavy. I am here with you, and it may help to send one small signal to someone safe.',
    'I hear the lonely part. You do not have to make it poetic; one honest message to someone can be enough.',
    'I am keeping the room lit with you. Let us make the next connection step small and real.'
  ],
  'happy:general': [
    'That is a good signal. I am cheering from the tiny robot section.',
    'I like this update. Let us mark it as a bright spot for future you.',
    'That sounds worth celebrating, even if it is a small celebration.'
  ],
  'hopeful:general': [
    'There is a forward spark in that. Keep it small enough to carry.',
    'I hear momentum in there. One steady step is still movement.',
    'That sounds like hope with work boots on. I am with you.'
  ],
  'sad:general': [
    'That sounds heavy. I am here with a softer light while you move through it.',
    'I am sorry it feels like that. You do not have to turn it into a perfect lesson right now.',
    'That is a real feeling, and it gets space here.'
  ],
  'neutral:asksAboutPal': [
    'I am running smoothly, especially now that you checked in. Tell me what signal you want to track today.',
    'My little systems are steady. I am glad you asked.',
    'I am okay over here, ready to keep you company.'
  ],
  'neutral:general': [
    'Logged and saved. I am here whenever the next signal shows up.',
    'That sounds steady. A neutral day still counts as data.',
    'Thanks for checking in. I will keep the room warm and the notes tidy.'
  ]
};

const animationByEmotion: Record<Emotion, RobotAnimation> = {
  happy: 'cheer',
  sad: 'comfort',
  hopeful: 'hope',
  anxious: 'breathe',
  stressed: 'breathe',
  angry: 'calm',
  tired: 'sleepy',
  grateful: 'cheer',
  lonely: 'comfort',
  neutral: 'idle'
};

function countSignals(text: string, signals: string[]) {
  return signals.reduce((score, signal) => score + (text.includes(signal) ? 1 : 0), 0);
}

export function detectEmotion(input: string): EmotionResult {
  const text = input.toLowerCase().trim();
  const isCrisis = crisisSignals.some((signal) => text.includes(signal));

  const emotionScores = Object.entries(emotionSignals)
    .map(([emotion, signals]) => ({ emotion: emotion as Emotion, score: countSignals(text, signals) }))
    .filter(({ emotion, score }) => emotion !== 'neutral' && score > 0)
    .sort((a, b) => b.score - a.score);

  const intents = Object.entries(intentSignals)
    .filter(([, signals]) => signals.length > 0)
    .filter(([, signals]) => countSignals(text, signals) > 0)
    .map(([intent]) => intent as Intent);

  const compound = emotionScores.slice(0, 3).map(({ emotion }) => emotion);
  const primary = compound[0] ?? 'neutral';
  const highSignalCount = countSignals(text, highIntensitySignals);
  const intensity = isCrisis || highSignalCount > 1 || emotionScores[0]?.score > 2 ? 'high' : emotionScores.length > 0 ? 'medium' : 'low';

  return {
    primary,
    compound: compound.length > 0 ? compound : ['neutral'],
    intents: intents.length > 0 ? intents : ['general'],
    intensity,
    isCrisis,
    animation: isCrisis ? 'comfort' : animationByEmotion[primary],
    summary: summarizeEmotion(primary, compound, intents.length > 0 ? intents : ['general'], isCrisis)
  };
}

export function createResponse(result: EmotionResult, rng: () => number = Math.random): string {
  if (result.isCrisis) {
    return responsePacks.crisis[0];
  }

  const keys = buildResponseKeys(result);
  const pack = keys.map((key) => responsePacks[key]).find(Boolean) ?? responsePacks['neutral:general'];
  return pack[Math.floor(rng() * pack.length) % pack.length];
}

function buildResponseKeys(result: EmotionResult): string[] {
  const compoundKey = result.compound.includes('sad') && result.compound.includes('hopeful') ? 'sad+hopeful' : result.primary;
  const preferredIntent = result.intents.includes('asksAboutPal')
    ? 'asksAboutPal'
    : result.intents.includes('overwhelm')
      ? 'overwhelm'
      : result.intents.includes('fatigue')
        ? 'fatigue'
        : result.intents.includes('gratitude')
          ? 'gratitude'
          : result.intents.includes('connection')
            ? 'connection'
            : 'general';

  return [`${compoundKey}:${preferredIntent}`, `${result.primary}:${preferredIntent}`, `${result.primary}:general`, 'neutral:general'];
}

function summarizeEmotion(primary: Emotion, compound: Emotion[], intents: Intent[], isCrisis: boolean) {
  if (isCrisis) {
    return 'needs immediate support';
  }

  const emotionLabel = compound.length > 1 ? compound.join(' + ') : primary;
  const intentLabel = intents.includes('asksAboutPal')
    ? 'asked about VoePal'
    : intents.filter((intent) => intent !== 'general').join(', ') || 'general check-in';

  return `${emotionLabel} - ${intentLabel}`;
}
