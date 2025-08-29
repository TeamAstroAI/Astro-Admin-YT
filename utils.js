function containsBannedWord(text, bannedWords) {
  text = text.toLowerCase();
  return bannedWords.some(word => text.includes(word));
}

module.exports = { containsBannedWord };