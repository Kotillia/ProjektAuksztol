const axios = require('axios');
require('dotenv').config();

let accessToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  const now = Date.now();

  if (accessToken && tokenExpiry && now < tokenExpiry) {
    return accessToken;
  }

  const response = await axios.post(
    'https://id.twitch.tv/oauth2/token',
    null,
    {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    }
  );

  accessToken = response.data.access_token;
  tokenExpiry = now + response.data.expires_in * 1000;
  return accessToken;
}

module.exports = { getAccessToken };