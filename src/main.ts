import { Server } from "./networking";
import * as WS from "ws";
import fs from "fs";
import { parseBoard } from "./util";
import * as tps from "./types";
import { ChessEngine } from "./engine";

const port = JSON.parse(String(fs.readFileSync("./config.json")))["port"] as number;

const initialBoard = [
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
];

const chessEngine = new ChessEngine(initialBoard);

const host: Server = new Server(
    port,
    (data: tps.Message, socket: WS.WebSocket) => {
        let parsedBoard = parseBoard(data.board as Array<Array<string>>);

        chessEngine.updateBoard(parsedBoard);

        const bestMove = chessEngine.getBestMove(3);

        socket.send(JSON.stringify({
            board: parsedBoard,
            bestMove: bestMove
        }));
    }
);
