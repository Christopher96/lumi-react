import Paths from "../pages/paths";

export interface LumiState {
  room: Room | null;
  connected: boolean;
  title: string;
  loading: boolean;
  treeData: any;
  update: (obj: any) => void;
}

export interface Room {
  source: string;
  roomId: string;
  users: any;
}

export interface Window {
  width: number;
  height: number;
  path: Paths;
}
