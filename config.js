require('dotenv').config();

module.exports = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
  redirectUri: process.env.REDIRECT_URI,
  liveChatId: process.env.LIVE_CHAT_ID
};