import { QueueVideo } from "@/store/modules/playList";
import { SetLockedRandomGroupPayload } from "@/store/modules/playOptions";

const CHANNEL_NAME = "playlist_channel"
const channel = new BroadcastChannel(CHANNEL_NAME)
export default channel

export interface PlayListMessage {
  action: string
  playList?: QueueVideo[]
  lockedRandomGroup?: SetLockedRandomGroupPayload
}

