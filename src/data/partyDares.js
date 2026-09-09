// Secret Social Dares & Distraction Tasks for Kaminey
// Designed to keep players moving, talking, laughing, and distracted in the living room
// so Kaminey can scheme and execute without being hyper-monitored!

export const PARTY_DARES = [
  {
    id: 'chai_trigger',
    title: 'The Chai Baithak',
    task: "Get anyone in the room to say the word 'Chai' or 'Tea' without you mentioning beverage words first.",
    hint: "Ask someone about their evening or breakfast routine.",
    category: 'Conversation'
  },
  {
    id: 'snack_delivery',
    title: 'Khidmatgar',
    task: "Silently fetch a glass of water, tissue, or snack and hand it politely to someone without them asking for it.",
    hint: "If they ask why, just say 'You looked thirsty/tired.'",
    category: 'Action'
  },
  {
    id: 'samosa_debate',
    title: 'Chutney Controversy',
    task: "Ignite a quick dispute by asserting passionately that sweet red chutney is 100x superior to green spicy chutney (or vice versa).",
    hint: "Get at least 2 people to take sides.",
    category: 'Debate'
  },
  {
    id: 'outfit_compliment',
    title: 'Sherwani Inspector',
    task: "Deliver an overly formal, deadpan compliment to someone about their shoes, socks, or watch.",
    hint: "Maintain intense eye contact for 3 seconds.",
    category: 'Humor'
  },
  {
    id: 'yawn_contagion',
    title: 'The Contagious Yawn',
    task: "Perform 2 dramatic, audible yawns within 90 seconds. Try to make at least one other person yawn too.",
    hint: "Science says it's contagious. Test it!",
    category: 'Physical'
  },
  {
    id: 'hall_patrol',
    title: 'Haveli Chowkidar',
    task: "Excuse yourself to 'inspect the hallway / check if the main door is locked' and return within 45 seconds.",
    hint: "Walk with serious urgency.",
    category: 'Stealth'
  },
  {
    id: 'fake_secret',
    title: 'Kaan Mein Baatein',
    task: "Lean over and whisper a completely made-up ridiculous sentence into someone's ear (e.g., 'The ceiling fan knows too much').",
    hint: "Then pretend nothing happened.",
    category: 'Distraction'
  },
  {
    id: 'song_hum',
    title: 'Sur-Taal',
    task: "Hum the tune of an iconic Bollywood song or melody until at least one person recognizes it or asks what song that is.",
    hint: "Hum quietly while tapping your foot.",
    category: 'Sound'
  },
  {
    id: 'horoscope_guru',
    title: 'Jyotish Uncle',
    task: "Predict someone's immediate future with total confidence (e.g., 'You will receive unexpected good news before midnight').",
    hint: "Use profound hand gestures.",
    category: 'Humor'
  },
  {
    id: 'phone_checker',
    title: 'Urgent Missed Call',
    task: "Gasp quietly, look at your phone screen with wide eyes, and say 'Oh teri... wait, never mind.'",
    hint: "Keep everyone guessing what notification you saw.",
    category: 'Drama'
  },
  {
    id: 'stretch_break',
    title: 'Power Stance',
    task: "Stand up in the room, do a dramatic full-body yoga stretch, and sigh in utter relief.",
    hint: "Act like your spine just realigned.",
    category: 'Physical'
  },
  {
    id: 'high_five',
    title: 'Random Celebration',
    task: "Raise your hand and offer a sudden high-five to someone across the sofa for no reason at all.",
    hint: "If they leave you hanging, high-five yourself.",
    category: 'Action'
  }
];

export function getRandomDare(excludeIds = []) {
  const available = PARTY_DARES.filter(d => !excludeIds.includes(d.id));
  const pool = available.length > 0 ? available : PARTY_DARES;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
