function logDeletedMessage(username, message) {
  console.log(`[DELETED] ${username}: ${message}`);
}

function logBannedUser(username, userId) {
  console.log(`[BANNED] ${username} (ID: ${userId})`);
}

module.exports = { logDeletedMessage, logBannedUser };