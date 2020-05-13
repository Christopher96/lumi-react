import Paths from "../pages/paths";

export interface LumiState {
  room: RoomData | null;
  connected: boolean;
  title: string;
  loading: boolean;
  update: (obj: any) => void;
}

export interface Window {
  width: number;
  height: number;
  path: Paths;
}

export interface RoomData {
  source: string;
  roomId: string;
}

export interface UserData {
  id: string;
  username: string;
  avatar: Buffer;
}
