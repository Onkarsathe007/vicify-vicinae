import { showToast, Toast } from '@vicinae/api';
import { getSpotifyClient, handleSpotifyError, safeApiCall } from './utils/spotify';

export default async function Command() {
  try {
    const spotify = await getSpotifyClient();
    await safeApiCall(() => spotify.player.setPlaybackVolume(25, undefined as any));
    
    await showToast({
      style: Toast.Style.Success,
      title: 'Volume Set to 25%',
    });
  } catch (error) {
    await handleSpotifyError(error, 'Failed to set volume');
  }
}
