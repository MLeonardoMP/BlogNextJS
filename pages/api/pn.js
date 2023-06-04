import axios from "axios";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  const response = await axios.post(`https://accounts.spotify.com/api/token`, data);

  return response.data.access_token;
}

async function getNowPlaying() {
  const accessToken = await getAccessToken();

  const response = await axios.get(`https://api.spotify.com/v1/me/player/currently-playing`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}

export const getNowPlayingSong = async () => {
  const nowPlaying = await getNowPlaying();

  if (nowPlaying.currently_playing) {
    const song = nowPlaying.currently_playing.item;

    return {
      title: song.name,
      artist: song.artists[0].name,
      album: song.album.name,
    };
  } else {
    return null;
  }
};