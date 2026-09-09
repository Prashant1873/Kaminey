// Animal Avatars for Kaminey - Modern Flat Icon Design
export const ANIMAL_AVATARS = [
  { id: 'lion', name: 'Sher', icon: 'Crown', title: 'The King', color: '#FFB800' },
  { id: 'wolf', name: 'Bhediya', icon: 'Moon', title: 'The Prowler', color: '#60A5FA' },
  { id: 'fox', name: 'Lomdi', icon: 'Zap', title: 'The Sly Mind', color: '#F97316' },
  { id: 'tiger', name: 'Bagh', icon: 'Flame', title: 'The Fierce', color: '#EF4444' },
  { id: 'owl', name: 'Ullu', icon: 'Eye', title: 'The Watcher', color: '#818CF8' },
  { id: 'snake', name: 'Saanp', icon: 'ShieldAlert', title: 'The Stealth', color: '#10B981' },
  { id: 'bear', name: 'Bhalu', icon: 'Shield', title: 'The Heavy', color: '#A8A29E' },
  { id: 'crow', name: 'Kauwa', icon: 'Feather', title: 'The Informant', color: '#94A3B8' },
  { id: 'monkey', name: 'Bandar', icon: 'Sparkles', title: 'The Trickster', color: '#FBBF24' },
  { id: 'rabbit', name: 'Khargosh', icon: 'Footprints', title: 'The Quick Foot', color: '#F472B6' },
  { id: 'dog', name: 'Kutta', icon: 'Award', title: 'The Loyal', color: '#38BDF8' },
  { id: 'cat', name: 'Billi', icon: 'Ghost', title: 'The Silent Stepper', color: '#C084FC' },
  { id: 'panda', name: 'Panda', icon: 'Smile', title: 'The Clueless', color: '#E2E8F0' },
  { id: 'deer', name: 'Hiran', icon: 'Compass', title: 'The Nimble', color: '#F59E0B' },
  { id: 'elephant', name: 'Haathi', icon: 'Target', title: 'The Mammoth', color: '#94A3B8' },
  { id: 'peacock', name: 'Mor', icon: 'Gem', title: 'The Showstopper', color: '#34D399' }
];

export function getAvatarById(id) {
  return ANIMAL_AVATARS.find(a => a.id === id) || ANIMAL_AVATARS[0];
}
