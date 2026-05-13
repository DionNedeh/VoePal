import { del, get, set } from 'idb-keyval';
import type { CheckIn, Customization, ProgressState } from './types';
import { defaultCustomization } from './options';

const CHECKINS_KEY = 'voepal:checkins';
const CUSTOMIZATION_KEY = 'voepal:customization';
const PROGRESS_KEY = 'voepal:progress';

export const defaultProgress: ProgressState = {
  xp: 0,
  parts: 0,
  streak: 0,
  lastCheckInDate: null
};

export async function loadCheckIns(): Promise<CheckIn[]> {
  return (await get<CheckIn[]>(CHECKINS_KEY)) ?? [];
}

export async function saveCheckIns(checkIns: CheckIn[]) {
  await set(CHECKINS_KEY, checkIns);
}

export async function addCheckIn(checkIn: CheckIn): Promise<CheckIn[]> {
  const checkIns = await loadCheckIns();
  const next = [checkIn, ...checkIns].slice(0, 100);
  await saveCheckIns(next);
  return next;
}

export async function deleteCheckIn(id: string): Promise<CheckIn[]> {
  const checkIns = await loadCheckIns();
  const next = checkIns.filter((checkIn) => checkIn.id !== id);
  await saveCheckIns(next);
  return next;
}

export async function loadCustomization(): Promise<Customization> {
  return { ...defaultCustomization, ...((await get<Customization>(CUSTOMIZATION_KEY)) ?? {}) };
}

export async function saveCustomization(customization: Customization) {
  await set(CUSTOMIZATION_KEY, customization);
}

export async function loadProgress(): Promise<ProgressState> {
  return { ...defaultProgress, ...((await get<ProgressState>(PROGRESS_KEY)) ?? {}) };
}

export async function saveProgress(progress: ProgressState) {
  await set(PROGRESS_KEY, progress);
}

export async function clearAllLocalData() {
  await Promise.all([del(CHECKINS_KEY), del(CUSTOMIZATION_KEY), del(PROGRESS_KEY)]);
}

export function nextProgress(progress: ProgressState, now = new Date()): ProgressState {
  const today = toDateKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const streak =
    progress.lastCheckInDate === today
      ? progress.streak
      : progress.lastCheckInDate === toDateKey(yesterday)
        ? progress.streak + 1
        : 1;

  return {
    xp: progress.xp + 18,
    parts: progress.parts + 3,
    streak,
    lastCheckInDate: today
  };
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
