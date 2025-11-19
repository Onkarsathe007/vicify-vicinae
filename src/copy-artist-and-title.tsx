import { showToast, Toast, Clipboard } from '@vicinae/api';
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
    const text = `${artistNames} - ${trackName}`;
    
    await Clipboard.copy(text);
    
    await showToast({
      style: Toast.Style.Success,
      title: 'Copied to Clipboard',
      message: text,
    });
  } catch (error) {
    await handleSpotifyError(error, 'Failed to copy track info');
  }
}
