const { google } = require('googleapis');
const config = require('./config');
const bannedWords = require('./bannedWords');
const { containsBannedWord } = require('./utils');
const { logDeletedMessage, logBannedUser } = require('./logger');

const oauth2Client = new google.auth.OAuth2(
  config.clientId,
  config.clientSecret,
  config.redirectUri
);

oauth2Client.setCredentials({ refresh_token: config.refreshToken });

async function checkChat() {
  try {
    const youtube = google.youtube('v3');
    const response = await youtube.liveChatMessages.list({
      auth: oauth2Client,
      liveChatId: config.liveChatId,
      part: ['id', 'snippet', 'authorDetails'],
    });

    const messages = response.data.items;

    for (const message of messages) {
      const text = message.snippet.displayMessage;
      const messageId = message.id;
      const authorId = message.authorDetails.channelId;
      const username = message.authorDetails.displayName;

      if (containsBannedWord(text, bannedWords)) {
        // Delete the message
        await youtube.liveChatMessages.delete({ auth: oauth2Client, id: messageId });
        logDeletedMessage(username, text);

        // Ban the user
        await youtube.liveChatBans.insert({
          auth: oauth2Client,
          part: ['snippet'],
          requestBody: {
            snippet: {
              liveChatId: config.liveChatId,
              type: 'permanent',
              bannedUserDetails: { channelId: authorId }
            }
          }
        });
        logBannedUser(username, authorId);
      }
    }
  } catch (err) {
    console.error('Error moderating chat:', err);
  }
}

console.log('Astro Admin Bot started. Monitoring chat...');
setInterval(checkChat, 5000);