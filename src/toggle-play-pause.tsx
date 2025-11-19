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
    
    if (playbackState.is_playing) {
      await safeApiCall(() => spotify.player.pausePlayback(playbackState.device?.id as any));
      await showToast({
        style: Toast.Style.Success,
        title: 'Playback Paused',
      });
    } else {
      await safeApiCall(() => spotify.player.startResumePlayback(playbackState.device?.id as any));
      await showToast({
        style: Toast.Style.Success,
        title: 'Playback Started',
      });
    }
  } catch (error) {
    await handleSpotifyError(error, 'Failed to toggle playback');
  }
}
