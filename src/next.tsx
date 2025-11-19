import { List, ActionPanel, Action, Icon, showToast, Toast, closeMainWindow } from '@vicinae/api';
import { getSpotifyClient, handleSpotifyError, safeApiCall } from './utils/spotify';

export default function Command() {
  async function skipNext(closeWindow: boolean = true) {
    try {
      const spotify = await getSpotifyClient();
      await safeApiCall(() => spotify.player.skipToNext(undefined as any));
      
      await showToast({
        style: Toast.Style.Success,
        title: 'Skipped to Next Track',
      });

      if (closeWindow) {
        await closeMainWindow();
      }
    } catch (error) {
      await handleSpotifyError(error, 'Failed to skip to next track');
    }
  }

  return (
    <List>
      <List.Item
        icon={Icon.Forward}
        title="Skip to Next Track"
        actions={
          <ActionPanel>
            <Action
              title="Skip and Close"
              icon={Icon.Forward}
              onAction={() => skipNext(true)}
            />
            <Action
              title="Skip and Keep Open"
              icon={Icon.Forward}
              onAction={() => skipNext(false)}
              shortcut={{ modifiers: ['shift'], key: 'enter' }}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
