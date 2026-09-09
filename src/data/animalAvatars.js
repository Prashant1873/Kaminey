// Animal Avatars for Kaminey Guests (Sher, Bhalu, etc.)
export const ANIMAL_AVATARS = [
  { id: 'lion', name: 'Sher', emoji: '🦁', title: 'The King', color: '#FFB800' },
  { id: 'wolf', name: 'Bhediya', emoji: '🐺', title: 'The Prowler', color: '#60A5FA' },
  { id: 'fox', name: 'Lomdi', emoji: '🦊', title: 'The Sly Mind', color: '#F97316' },
  { id: 'tiger', name: 'Bagh', emoji: '🐯', title: 'The Fierce', color: '#EF4444' },
  { id: 'owl', name: 'Ullu', emoji: '🦉', title: 'The Watcher', color: '#818CF8' },
  { id: 'snake', name: 'Saanp', emoji: '🐍', title: 'The Stealth', color: '#10B981' },
  { id: 'bear', name: 'Bhalu', emoji: '🐻', title: 'The Heavy', color: '#A8A29E' },
  { id: 'crow', name: 'Kauwa', emoji: '🦅', title: 'The Informant', color: '#94A3B8' },
  { id: 'monkey', name: 'Bandar', emoji: '🐵', title: 'The Trickster', color: '#FBBF24' },
  { id: 'rabbit', name: 'Khargosh', emoji: '🐰', title: 'The Quick Foot', color: '#F472B6' },
  { id: 'dog', name: 'Kutta', emoji: '🐶', title: 'The Loyal', color: '#38BDF8' },
  { id: 'cat', name: 'Billi', emoji: '🐱', title: 'The Silent Stepper', color: '#C084FC' },
  { id: 'panda', name: 'Panda', emoji: '🐼', title: 'The Clueless', color: '#E2E8F0' },
  { id: 'deer', name: 'Hiran', emoji: '🦌', title: 'The Nimble', color: '#F59E0B' },
  { id: 'elephant', name: 'Haathi', emoji: '🐘', title: 'The Mammoth', color: '#94A3B8' },
  { id: 'peacock', name: 'Mor', emoji: '🦚', title: 'The Showstopper', color: '#34D399' }
];

export function getAvatarById(id) {
  return ANIMAL_AVATARS.find(a => a.id === id) || ANIMAL_AVATARS[0];
}
