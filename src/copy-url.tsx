import { showToast, Toast, Clipboard } from '@vicinae/api';
import { getSpotifyClient, handleSpotifyError } from './utils/spotify';

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
    
    const url = (currentTrack.item as any).external_urls?.spotify || '';
    
    if (!url) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'URL Not Available',
      });
      return;
    }
    
    await Clipboard.copy(url);
    
    await showToast({
      style: Toast.Style.Success,
      title: 'Copied URL to Clipboard',
    });
  } catch (error) {
    await handleSpotifyError(error, 'Failed to copy URL');
  }
}
