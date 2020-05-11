/// <reference types="socket.io-client" />
import { Room } from "../../src/context/interfaces";
interface Connection {
    socket: SocketIOClient.Socket;
    room: Room;
}
export default class IPC {
    static connection: Connection;
    static getUsers: (roomId: string) => Promise<false | any[]>;
    static getTreeData: (path: string) => import("../../../lumi-cli/dist/lib/common/types").Tree[];
    static init(mainWindow: any): void;
}
export {};
