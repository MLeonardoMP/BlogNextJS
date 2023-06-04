// /pages/api/spotify.js
import { resolve } from 'path';
import querystring from 'querystring';

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

export const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();
  console.log(access_token);
  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {

      'Authorization': 'Bearer ' + access_token
      
    },
  });

  return response.json();
};

export default async (_, res) => {
  const response = await getNowPlaying();
  var getKeys = function(obj){
    var keys = [];
    for(var key in obj){
       keys.push(key);
    }
    return keys;
 }
  console.log(getKeys(response.item.album));

  if (
    response.status === 204 ||
    response.status > 400  || 
    response.currently_playing_type !== 'track'
  ) {
    return res.status(200).json({ isPlaying: false });
  }

  const data = {
    isPlaying: response.is_playing,
    title: response.item.name,
    album: response.item.album.name,
    artist: response.item.album.artists
      .map((artist) => artist.name)
      .join(', '),
    ai: response.item.album.images[0].url,
    songUrl: response.item.external_urls.spotify,
  };


  console.log(data);

  res.status(200).json(data);
};
