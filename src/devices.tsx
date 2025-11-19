import { useState, useEffect } from 'react';
import { List, ActionPanel, Action, Icon, showToast, Toast } from '@vicinae/api';
import { getSpotifyClient, handleSpotifyError, safeApiCall } from './utils/spotify';

export default function Devices() {
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDevices();
  }, []);

  async function loadDevices() {
    try {
      setIsLoading(true);
      const spotify = await getSpotifyClient();
      
      const devicesResponse = await spotify.player.getAvailableDevices();
      setDevices(devicesResponse.devices || []);
      
      if (!devicesResponse.devices || devicesResponse.devices.length === 0) {
        await showToast({
          style: Toast.Style.Failure,
          title: 'No Devices Found',
          message: 'Please open Spotify on a device to see available devices',
        });
      }
    } catch (error) {
      await handleSpotifyError(error, 'Failed to load devices');
    } finally {
      setIsLoading(false);
    }
  }

  async function switchToDevice(deviceId: string, deviceName: string) {
    try {
      const spotify = await getSpotifyClient();
      await safeApiCall(() => spotify.player.transferPlayback([deviceId], true));
      
      await showToast({
        style: Toast.Style.Success,
        title: 'Device Switched',
        message: `Playback transferred to ${deviceName}`,
      });
      
      // Reload devices to update active status
      await loadDevices();
    } catch (error) {
      await handleSpotifyError(error, 'Failed to switch device');
    }
  }

  function getDeviceIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'computer':
        return Icon.Desktop;
      case 'smartphone':
        return Icon.Mobile;
      case 'speaker':
        return Icon.SpeakerOn;
      case 'tv':
        return Icon.Monitor;
      default:
        return Icon.SpeakerOn;
    }
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search devices...">
      {devices.length === 0 && !isLoading && (
        <List.EmptyView
          icon={Icon.SpeakerOff}
          title="No Devices Available"
          description="Open Spotify on a device to see available playback devices"
        />
      )}
      
      {devices.map((device) => (
        <List.Item
          key={device.id}
          title={device.name}
          subtitle={device.type}
          icon={getDeviceIcon(device.type)}
          accessories={[
            ...(device.volume_percent !== null 
              ? [{ text: `${device.volume_percent}%` }] 
              : []
            ),
            ...(device.is_active 
              ? [{ icon: Icon.CheckCircle, tooltip: 'Active' }] 
              : []
            ),
          ]}
          actions={
            <ActionPanel>
              {!device.is_active && (
                <Action
                  title="Switch to Device"
                  icon={Icon.SpeakerOn}
                  onAction={() => switchToDevice(device.id, device.name)}
                />
              )}
              {device.is_active && (
                <Action
                  title="Active Device"
                  icon={Icon.CheckCircle}
                  onAction={() => showToast({
                    style: Toast.Style.Success,
                    title: 'Already Active',
                    message: `${device.name} is currently active`,
                  })}
                />
              )}
              <Action
                title="Refresh Devices"
                icon={Icon.ArrowClockwise}
                shortcut={{ modifiers: ['cmd'], key: 'r' }}
                onAction={loadDevices}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
