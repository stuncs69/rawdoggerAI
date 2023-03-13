import { Server } from "./networking";
import * as WS from 'ws';
import fs from "fs"

const port = JSON.parse(String(fs.readFileSync("./config.json")))["port"] as number

interface Piece {
    piece: any
}

interface Message {
    logId: number,
    // 0 for white, 1 for black
    player: boolean,
    // 8 An array for horizontal rows, containing arrays for vertical rows containing Pieces
    board: Array<Array<Piece>>
}

const host: Server = new Server(port, (data: Message, socket: WS.WebSocket) => {
    
})