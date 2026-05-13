import { describe, expect, it } from 'vitest';
import { createResponse, detectEmotion } from './engine';

describe('VoePal emotion engine', () => {
  it('detects happy check-ins that ask about VoePal', () => {
    const result = detectEmotion('My day is great! How is yours?');

    expect(result.primary).toBe('happy');
    expect(result.intents).toContain('asksAboutPal');
    expect(result.animation).toBe('cheer');
    expect(createResponse(result, () => 0)).toContain('great to hear');
  });

  it('detects sad and hopeful check-ins that ask back', () => {
    const result = detectEmotion('I am not doing the best but I am trying. How about you?');

    expect(result.primary).toBe('sad');
    expect(result.compound).toContain('hopeful');
    expect(result.intents).toContain('asksAboutPal');
    expect(result.animation).toBe('comfort');
    expect(createResponse(result, () => 0)).toContain('trying part');
  });

  it('maps overwhelm to anxious or stressed support', () => {
    const result = detectEmotion("I am so stressed and can't keep up with all this pressure.");

    expect(['stressed', 'anxious']).toContain(result.primary);
    expect(result.intents).toContain('overwhelm');
    expect(result.intensity).toBe('high');
  });

  it('uses a safety override for crisis language', () => {
    const result = detectEmotion('I want to die and I am not safe with myself.');

    expect(result.isCrisis).toBe(true);
    expect(createResponse(result)).toContain('immediate human support');
  });

  it('falls back to neutral for low-signal text', () => {
    const result = detectEmotion('Checking in before lunch.');

    expect(result.primary).toBe('neutral');
    expect(result.intents).toEqual(['general']);
    expect(result.animation).toBe('idle');
  });
});
