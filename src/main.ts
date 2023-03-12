import { Server } from "./networking";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let port: number = 8080

rl.question("Please be so kind to input the desired port on which the bot shall be run on: ", (ans: string) => {
    port = parseInt(ans)
    rl.close()
})

const host: Server = new Server(port)