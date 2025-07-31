import axios from 'axios';

const getSpotifyAccessToken = async () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const credentials = btoa(`${clientId}:${clientSecret}`);

  try {
    const response = await axios.post(
      tokenUrl,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Spotify');
  }
};

export default getSpotifyAccessToken;