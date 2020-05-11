import Paths from "../pages/paths";
export interface LumiState {
    room: Room | null;
    connected: boolean;
    title: string;
    loading: boolean;
    update: (obj: any) => void;
}
export interface Room {
    source: string;
    roomId: string;
}
export interface Window {
    width: number;
    height: number;
    path: Paths;
}
