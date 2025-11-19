import { showToast, Toast } from '@vicinae/api';
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
    
    const trackId = currentTrack.item.id;
    await spotify.currentUser.tracks.removeSavedTracks([trackId]);
    
    const trackName = currentTrack.item.name;
    const artistNames = formatArtists((currentTrack.item as any).artists || []);
    
    await showToast({
      style: Toast.Style.Success,
      title: 'Removed from Liked Songs',
      message: `${trackName} - ${artistNames}`,
    });
  } catch (error) {
    await handleSpotifyError(error, 'Failed to remove track from liked songs');
  }
}
