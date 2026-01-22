import { Action, MatchState } from '../types';

const CHANNEL_NAME = 'football_scoreboard_v1';

export const broadcastChannel = new BroadcastChannel(CHANNEL_NAME);

export const sendAction = (action: Action) => {
  broadcastChannel.postMessage(action);
};

export const subscribe = (callback: (action: Action) => void) => {
  const handler = (event: MessageEvent) => {
    callback(event.data);
  };
  broadcastChannel.addEventListener('message', handler);
  return () => broadcastChannel.removeEventListener('message', handler);
};
