import { parseBoard } from "../src/util";

const board = [[],[],[],[],[],[],[],[]]

let collection = ["empty", "wk", "bq", "wp", "bp"]

board.forEach((array: any) => {
    for (let index = 0; index < 8; index++) {
        //@ts-ignore
        board[index].push(collection[Math.floor(Math.random() * collection.length)])   
    }
})

console.log(board);
console.log(parseBoard(board))