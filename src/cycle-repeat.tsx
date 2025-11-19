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
    
    const currentRepeat = playbackState.repeat_state;
    let newRepeat: 'off' | 'track' | 'context';
    let message: string;
    
    switch (currentRepeat) {
      case 'off':
        newRepeat = 'context';
        message = 'Repeat: All';
        break;
      case 'context':
        newRepeat = 'track';
        message = 'Repeat: Track';
        break;
      case 'track':
      default:
        newRepeat = 'off';
        message = 'Repeat: Off';
        break;
    }
    
    await safeApiCall(() => spotify.player.setRepeatMode(newRepeat, undefined as any));
    
    await showToast({
      style: Toast.Style.Success,
      title: message,
    });
  } catch (error) {
    await handleSpotifyError(error, 'Failed to change repeat mode');
  }
}
