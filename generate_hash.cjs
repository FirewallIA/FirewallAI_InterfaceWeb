const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(scrypt);
const password = 'root';
const salt = 'devtestsalt12345';

async function hashPass() {
  const buf = await scryptAsync(password, salt, 64);
  console.log(`${buf.toString('hex')}.${salt}`);
}

hashPass();
