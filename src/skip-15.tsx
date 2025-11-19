import { showToast, Toast } from '@vicinae/api';
import { getSpotifyClient, handleSpotifyError, safeApiCall } from './utils/spotify';

export default async function Command() {
  try {
    const spotify = await getSpotifyClient();
    const playbackState = await spotify.player.getPlaybackState();
    
    if (!playbackState) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'No Active Device',
        message: 'Please start Spotify on a device first',
      });
      return;
    }
    
    const currentPosition = playbackState.progress_ms || 0;
    const newPosition = Math.min(currentPosition + 15000, playbackState.item?.duration_ms || 0);
    
    await safeApiCall(() => spotify.player.seekToPosition(newPosition, undefined as any));
    
    await showToast({
      style: Toast.Style.Success,
      title: 'Skipped Forward 15 Seconds',
    });
  } catch (error) {
    await handleSpotifyError(error, 'Failed to skip forward');
  }
}
