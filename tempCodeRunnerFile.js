const adjectives = ['admin', 'fast', 'bold', 'dark', 'bright', 'sharp'];
const roles = ['kaalis']; // Fixed role
const randomSuffix = Date.now().toString().slice(-4); // Unique based on current time

// Helper to pick a random element from an array
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];

// Generate compact username and email
const username = `${randomChoice(adjectives)}_${randomChoice(roles)}_${randomSuffix}`;
const email = `${username}@kaalis.com`.toLowerCase();

console.log("Username:", username);
console.log("Email:", email);
