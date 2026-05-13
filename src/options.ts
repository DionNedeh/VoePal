import type { Customization } from './types';

export const shellOptions = [
  { id: 'mint', label: 'Mint', color: '#8ad7c1' },
  { id: 'sun', label: 'Sun', color: '#f7cb46' },
  { id: 'coral', label: 'Coral', color: '#f07d68' },
  { id: 'sky', label: 'Sky', color: '#79a7f2' },
  { id: 'orchid', label: 'Orchid', color: '#b68cf0' }
];

export const faceOptions = [
  { id: 'bright', label: 'Bright' },
  { id: 'visor', label: 'Visor' },
  { id: 'sleepy', label: 'Sleepy' },
  { id: 'spark', label: 'Spark' },
  { id: 'retro', label: 'Retro' }
];

export const antennaOptions = [
  { id: 'dot', label: 'Dot' },
  { id: 'halo', label: 'Halo' },
  { id: 'bolt', label: 'Bolt' },
  { id: 'twin', label: 'Twin' },
  { id: 'dish', label: 'Dish' }
];

export const armOptions = [
  { id: 'round', label: 'Round' },
  { id: 'claw', label: 'Claw' },
  { id: 'wave', label: 'Wave' },
  { id: 'stubby', label: 'Stubby' },
  { id: 'spring', label: 'Spring' }
];

export const accessoryOptions = [
  { id: 'none', label: 'None' },
  { id: 'star', label: 'Star pin' },
  { id: 'scarf', label: 'Scarf' },
  { id: 'badge', label: 'Badge' },
  { id: 'headset', label: 'Headset' }
];

export const roomOptions = [
  { id: 'studio', label: 'Studio', color: '#f6f8ef' },
  { id: 'loft', label: 'Loft', color: '#e8f1fb' },
  { id: 'garden', label: 'Garden', color: '#e9f6e9' },
  { id: 'orbit', label: 'Orbit', color: '#eef0ff' },
  { id: 'workbench', label: 'Workbench', color: '#fff1de' }
];

export const defaultCustomization: Customization = {
  shell: 'mint',
  face: 'bright',
  antenna: 'dot',
  arms: 'round',
  accessory: 'none',
  room: 'studio'
};

export function getShellColor(shellId: string) {
  return shellOptions.find((option) => option.id === shellId)?.color ?? shellOptions[0].color;
}

export function getRoomColor(roomId: string) {
  return roomOptions.find((option) => option.id === roomId)?.color ?? roomOptions[0].color;
}
