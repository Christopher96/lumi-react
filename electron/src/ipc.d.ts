/// <reference types="socket.io-client" />
import { Room } from "../../src/context/interfaces";
interface Connection {
    socket: SocketIOClient.Socket;
    room: Room;
}
export default class IPC {
    static connection: Connection;
    static getUsers: (roomId: string) => Promise<any>;
    static getTreeData: (path: string) => any;
    static init(mainWindow: any): void;
}
export {};
