import { showToast, Toast, open } from '@vicinae/api';
import { getSpotifyClient, handleSpotifyError, formatArtists } from './utils/spotify';

export default async function Command() {
  try {
    const spotify = await getSpotifyClient();
    const currentTrack = await spotify.player.getCurrentlyPlayingTrack();
    
    if (!currentTrack || !currentTrack.item) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'No Track Playing',
        message: 'Please start playing a track first',
      });
      return;
    }
    
    const trackName = currentTrack.item.name;
    const artistNames = formatArtists((currentTrack.item as any).artists || []);
    const searchQuery = encodeURIComponent(`${artistNames} ${trackName} lyrics`);
    const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
    
    await open(googleSearchUrl);
    
    await showToast({
      style: Toast.Style.Success,
      title: 'Searching for Lyrics',
      message: `${trackName} - ${artistNames}`,
    });
  } catch (error) {
    await handleSpotifyError(error, 'Failed to search for lyrics');
  }
}
