import { Server } from "./networking";
import * as WS from 'ws';
import fs from "fs"
import { parseBoard } from "./util";
import * as tps from "./types"

const port = JSON.parse(String(fs.readFileSync("./config.json")))["port"] as number

const host: Server = new Server(port, (data: tps.Message, socket: WS.WebSocket) => {
    let result = parseBoard(data.board as Array<Array<string>>)
    console.log(result)
})  