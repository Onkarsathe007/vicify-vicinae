import { useState, useEffect } from 'react';
import { List, ActionPanel, Action, Icon, showToast, Toast } from '@vicinae/api';
import { getSpotifyClient, handleSpotifyError } from './utils/spotify';

export default function AddToPlaylist() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const spotify = await getSpotifyClient();
      
      // Get current track
      const playback = await spotify.player.getCurrentlyPlayingTrack();
      if (!playback || !playback.item) {
        await showToast({
          style: Toast.Style.Failure,
          title: 'No Track Playing',
          message: 'Please start playing a track first',
        });
        setIsLoading(false);
        return;
      }
      setCurrentTrack(playback.item);
      
      // Get user's playlists
      const userPlaylists = await spotify.currentUser.playlists.playlists(50);
      setPlaylists(userPlaylists.items || []);
    } catch (error) {
      await handleSpotifyError(error, 'Failed to load playlists');
    } finally {
      setIsLoading(false);
    }
  }

  async function addToPlaylist(playlistId: string, playlistName: string) {
    if (!currentTrack) return;
    
    try {
      const spotify = await getSpotifyClient();
      await spotify.playlists.addItemsToPlaylist(playlistId, [currentTrack.uri]);
      
      await showToast({
        style: Toast.Style.Success,
        title: 'Added to Playlist',
        message: `${currentTrack.name} added to ${playlistName}`,
      });
    } catch (error) {
      await handleSpotifyError(error, 'Failed to add track to playlist');
    }
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search playlists...">
      {!currentTrack && !isLoading && (
        <List.EmptyView
          icon={Icon.Music}
          title="No Track Playing"
          description="Please start playing a track first"
        />
      )}
      
      {currentTrack && playlists.length === 0 && !isLoading && (
        <List.EmptyView
          icon={Icon.List}
          title="No Playlists Found"
          description="Create a playlist on Spotify first"
        />
      )}
      
      {currentTrack && playlists.map((playlist) => (
        <List.Item
          key={playlist.id}
          title={playlist.name}
          subtitle={`${playlist.tracks?.total || 0} tracks`}
          icon={playlist.images?.[0]?.url || Icon.Music}
          accessories={[
            { text: playlist.owner?.display_name || 'Unknown' }
          ]}
          actions={
            <ActionPanel>
              <Action
                title="Add Track to Playlist"
                icon={Icon.Plus}
                onAction={() => addToPlaylist(playlist.id, playlist.name)}
              />
              <Action.OpenInBrowser
                title="Open in Spotify"
                url={playlist.external_urls?.spotify || ''}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
