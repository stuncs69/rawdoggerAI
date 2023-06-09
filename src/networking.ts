import * as WS from "ws";
import * as http from "http";
//@ts-ignore
import express from "express";
import colors from "colors";

class Logger {
    constructor() {}

    critical(message: String) {
        console.log(colors.red(`[CRITICAL] ${message}`));
    }

    warn(message: String) {
        console.log(colors.yellow(`[WARN] ${message}`));
    }

    generic(message: String) {
        console.log(colors.green(`[GENERIC] ${message}`));
    }
}

interface Data {
    footprint: String;
    data: any;
}

export class Server {
    port: number;
    server: WS.WebSocketServer;
    //@ts-ignore
    socket: WS.WebSocket;
    log: Logger;
    callbackfn: Function;
    latestData: Data;

    constructor(port: number, callback: Function) {
        this.callbackfn = callback;
        this.latestData = {
            footprint: "NULL",
            data: {},
        };
        this.port = port;
        this.log = new Logger();
        //@ts-ignore
        let exp_server = express();
        let server = http.createServer(exp_server);
        this.server = new WS.Server({ server });

        this.server.on("connection", (WebSocket: WS.WebSocket) => {
            this.socket = WebSocket;
            this.log.generic("New Connection");
            this.socket.on("message", (rawData: string) => {
                this.callbackfn(JSON.parse(rawData), this.socket);
            });
        });
        this.server.on("close", () => {
            this.log.generic("Disconnected user");
        });

        server.listen(this.port || 8080, () => {
            this.log.warn(`STARTED SERVER ON ${this.port}`);
        });
    }
}
