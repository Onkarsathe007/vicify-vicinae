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
    
    const newShuffleState = !playbackState.shuffle_state;
    await safeApiCall(() => spotify.player.togglePlaybackShuffle(newShuffleState, undefined as any));
    
    await showToast({
      style: Toast.Style.Success,
      title: newShuffleState ? 'Shuffle: On' : 'Shuffle: Off',
    });
  } catch (error) {
    await handleSpotifyError(error, 'Failed to toggle shuffle');
  }
}
