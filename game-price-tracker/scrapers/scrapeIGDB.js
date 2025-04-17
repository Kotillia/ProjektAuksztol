const axios = require('axios');
const { getAccessToken } = require('./igdbClient');

async function getIGDBGameData(gameTitle) {
  const token = await getAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID;

  const response = await axios.post(
    'https://api.igdb.com/v4/games',
    `search "${gameTitle}"; fields name, rating, aggregated_rating, summary, platforms.name; limit 1;`,
    {
      headers: {
        'Client-ID': clientId,
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
      }
    }
  );

  if (response.data.length === 0) return null;

  return response.data[0];
}

module.exports = { getIGDBGameData };
