import { QueueVideo } from "@/store/modules/playList";

const CHANNEL_NAME = "playlist_channel"
const channel = new BroadcastChannel(CHANNEL_NAME)
export default channel

export interface PlayListMessage {
  action: string
  playList?: QueueVideo[]
}

