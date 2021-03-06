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
  path: Paths | string;
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

export interface LogsQueryParams {
  reverse?: "1" | "0";
  offset?: string;
}

export interface logData {
  event: any;
  user?: any;
  date: Date;
  path?: any;
}
