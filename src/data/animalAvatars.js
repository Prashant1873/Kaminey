// Animal Avatars for Kaminey
export const ANIMAL_AVATARS = [
  { id: 'lion', name: 'Sher', emoji: '🦁', title: 'The King', color: '#FF9F0A' },
  { id: 'wolf', name: 'Bhediya', emoji: '🐺', title: 'The Prowler', color: '#709bfe' },
  { id: 'fox', name: 'Lomdi', emoji: '🦊', title: 'The Sly Mind', color: '#DE350B' },
  { id: 'tiger', name: 'Bagh', emoji: '🐯', title: 'The Fierce', color: '#FF5630' },
  { id: 'owl', name: 'Ullu', emoji: '🦉', title: 'The Watcher', color: '#0052cc' },
  { id: 'snake', name: 'Saanp', emoji: '🐍', title: 'The Stealth', color: '#00F090' },
  { id: 'bear', name: 'Bhalu', emoji: '🐻', title: 'The Heavy', color: '#8D6E63' },
  { id: 'crow', name: 'Kauwa', emoji: '🦅', title: 'The Informant', color: '#434654' },
  { id: 'monkey', name: 'Bandar', emoji: '🐵', title: 'The Trickster', color: '#B76E00' },
  { id: 'rabbit', name: 'Khargosh', emoji: '🐰', title: 'The Quick Foot', color: '#FF80AB' },
  { id: 'dog', name: 'Kutta', emoji: '🐶', title: 'The Loyal', color: '#285ab9' },
  { id: 'cat', name: 'Billi', emoji: '🐱', title: 'The Silent Stepper', color: '#AB47BC' },
  { id: 'panda', name: 'Panda', emoji: '🐼', title: 'The Clueless', color: '#263238' },
  { id: 'deer', name: 'Hiran', emoji: '🦌', title: 'The Nimble', color: '#8D6E63' },
  { id: 'elephant', name: 'Haathi', emoji: '🐘', title: 'The Mammoth', color: '#78909C' },
  { id: 'peacock', name: 'Mor', emoji: '🦚', title: 'The Showstopper', color: '#00875A' }
];

export function getAvatarById(id) {
  return ANIMAL_AVATARS.find(a => a.id === id) || ANIMAL_AVATARS[0];
}
