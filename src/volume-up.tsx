import { showToast, Toast } from '@vicinae/api';
import { getSpotifyClient, handleSpotifyError, safeApiCall } from './utils/spotify';

export default async function Command() {
  try {
    const spotify = await getSpotifyClient();
    const playbackState = await spotify.player.getPlaybackState();
    
    if (!playbackState || !playbackState.device) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'No Active Device',
        message: 'Please start Spotify on a device first',
      });
      return;
    }
    
    const currentVolume = playbackState.device.volume_percent || 0;
    const newVolume = Math.min(100, currentVolume + 10);
    
    await safeApiCall(() => spotify.player.setPlaybackVolume(newVolume, undefined as any));
    
    await showToast({
      style: Toast.Style.Success,
      title: `Volume: ${newVolume}%`,
    });
  } catch (error) {
    await handleSpotifyError(error, 'Failed to increase volume');
  }
}
