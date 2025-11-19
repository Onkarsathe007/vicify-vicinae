import { List, ActionPanel, Action, Icon, showToast, Toast, closeMainWindow } from '@vicinae/api';
import { getSpotifyClient, handleSpotifyError, safeApiCall } from './utils/spotify';

export default function Command() {
  async function skipPrevious(closeWindow: boolean = true) {
    try {
      const spotify = await getSpotifyClient();
      await safeApiCall(() => spotify.player.skipToPrevious(undefined as any));
      
      await showToast({
        style: Toast.Style.Success,
        title: 'Skipped to Previous Track',
      });

      if (closeWindow) {
        await closeMainWindow();
      }
    } catch (error) {
      await handleSpotifyError(error, 'Failed to skip to previous track');
    }
  }

  return (
    <List>
      <List.Item
        icon={Icon.Rewind}
        title="Skip to Previous Track"
        actions={
          <ActionPanel>
            <Action
              title="Skip and Close"
              icon={Icon.Rewind}
              onAction={() => skipPrevious(true)}
            />
            <Action
              title="Skip and Keep Open"
              icon={Icon.Rewind}
              onAction={() => skipPrevious(false)}
              shortcut={{ modifiers: ['shift'], key: 'enter' }}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
