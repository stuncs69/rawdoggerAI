import * as ts from "./types";
import { parseBoard } from "./util";

interface Move {
    from: { row: number; col: number };
    to: { row: number; col: number };
    piece: ts.Piece;
    capturedPiece?: ts.Piece;
}

export class ChessEngine {
    private board: Array<Array<ts.Piece>>;
    private currentPlayer: boolean;

    constructor(rawBoard: Array<Array<string>>) {
        this.board = parseBoard(rawBoard);
        this.currentPlayer = true;
    }
    

    public printBoard(): void {
        console.log(this.board.map(row => 
            row.map(piece => piece.identifier[0]).join(' ')
        ).join('\n'));
    }

    public updateBoard(newBoard: Array<Array<ts.Piece>>): void {
        this.board = newBoard;
        this.currentPlayer = true;
    }
    

    setPlayer(player: boolean): void {
        this.currentPlayer = player;
    }

    public move(from: { row: number; col: number }, to: { row: number; col: number }): boolean {
        const piece = this.board[from.row][from.col];

        if (!this.isPieceValid(piece) || piece.player !== this.currentPlayer) {
            console.log("Invalid move: No piece at source or it's not your turn.");
            return false;
        }

        const capturedPiece = this.board[to.row][to.col];
        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = { identifier: "empty" } as ts.Empty;

        this.currentPlayer = !this.currentPlayer;
        return true;
    }

    public getCurrentPlayer(): boolean {
        return this.currentPlayer;
    }

    private isPieceValid(piece: ts.Piece) {
        return piece.identifier !== "empty";
    }

    public generateMoves(): Move[] {
        const moves: Move[] = [];

        this.board.forEach((row, rowIndex) => {
            row.forEach((piece, colIndex) => {
                if (this.isPieceValid(piece) && piece.player === this.currentPlayer) {
                    for (let r = 0; r < 8; r++) {
                        for (let c = 0; c < 8; c++) {
                            if ((r !== rowIndex || c !== colIndex) && this.isValidMove(piece, { row: rowIndex, col: colIndex }, { row: r, col: c })) {
                                moves.push({ from: { row: rowIndex, col: colIndex }, to: { row: r, col: c }, piece });
                            }
                        }
                    }
                }
            });
        });
        return moves;
    }
    private isValidMove(piece: ts.Piece, from: { row: number; col: number }, to: { row: number; col: number }): boolean {
        if (to.row < 0 || to.row >= 8 || to.col < 0 || to.col >= 8) {
            return false;
        }
    
        const targetPiece = this.board[to.row][to.col];
    
        if (targetPiece.identifier !== "empty" && targetPiece.player === piece.player) {
            return false;
        }
    
        switch (piece.identifier) {
            case "pawn":
                const direction = piece.player ? 1 : -1;
                if (from.col === to.col) {
                    if (to.row === from.row + direction && targetPiece.identifier === "empty") {
                        return true;
                    }
                    if ((piece.player && from.row === 1 && to.row === from.row + 2) || 
                        (!piece.player && from.row === 6 && to.row === from.row - 2)) {
                        return this.board[from.row + direction][from.col].identifier === "empty" && targetPiece.identifier === "empty";
                    }
                } else if (Math.abs(from.col - to.col) === 1) {
                    return to.row === from.row + direction && targetPiece.player !== piece.player;
                }
                break;
    
            case "rook":
                if (from.row === to.row || from.col === to.col) {
                    return this.isPathClear(from, to);
                }
                break;
    
            case "knight":
                const rowDiff = Math.abs(from.row - to.row);
                const colDiff = Math.abs(from.col - to.col);
                if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
                    return true;
                }
                break;
    
            case "bishop":
                if (Math.abs(from.row - to.row) === Math.abs(from.col - to.col)) {
                    return this.isPathClear(from, to);
                }
                break;
    
            case "queen":
                if (from.row === to.row || from.col === to.col || Math.abs(from.row - to.row) === Math.abs(from.col - to.col)) {
                    return this.isPathClear(from, to);
                }
                break;
    
            case "king":
                if (Math.abs(from.row - to.row) <= 1 && Math.abs(from.col - to.col) <= 1) {
                    return true;
                }
                break;
    
            default:
                return false;
        }
    
        return false;
    }
    
    private isPathClear(from: { row: number; col: number }, to: { row: number; col: number }): boolean {
        const rowIncrement = (to.row - from.row) === 0 ? 0 : (to.row - from.row) / Math.abs(to.row - from.row);
        const colIncrement = (to.col - from.col) === 0 ? 0 : (to.col - from.col) / Math.abs(to.col - from.col);
    
        let currentRow = from.row + rowIncrement;
        let currentCol = from.col + colIncrement;
    
        while (currentRow !== to.row || currentCol !== to.col) {
            if (this.board[currentRow][currentCol].identifier !== "empty") {
                return false;
            }
            currentRow += rowIncrement;
            currentCol += colIncrement;
        }
    
        return true;
    }
    
    

    public evaluateBoard(): number {
        let score = 0;

        this.board.forEach(row => {
            row.forEach(piece => {
                if (this.isPieceValid(piece)) {
                    if (piece.identifier === "pawn") score += piece.player ? 1 : -1;
                    if (piece.identifier === "rook") score += piece.player ? 5 : -5;
                    if (piece.identifier === "knight") score += piece.player ? 3 : -3;
                    if (piece.identifier === "bishop") score += piece.player ? 3 : -3;
                    if (piece.identifier === "queen") score += piece.player ? 9 : -9;
                    if (piece.identifier === "king") score += piece.player ? 0 : 0;
                }
            });
        });

        return score;
    }

    public minimax(depth: number, alpha: number, beta: number, maximizingPlayer: boolean): number {
        if (depth === 0) {
            return this.evaluateBoard();
        }

        const moves = this.generateMoves();
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (const move of moves) {
                this.makeMove(move);
                const eval1 = this.minimax(depth - 1, alpha, beta, false);
                this.undoMove(move);
                maxEval = Math.max(maxEval, eval1);
                alpha = Math.max(alpha, eval1);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                this.makeMove(move);
                const eval1 = this.minimax(depth - 1, alpha, beta, true);
                this.undoMove(move);
                minEval = Math.min(minEval, eval1);
                beta = Math.min(beta, eval1);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    private makeMove(move: Move): void {
        const { from, to, piece } = move;
        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = { identifier: "empty" } as ts.Empty;
    }

    private undoMove(move: Move): void {
        const { from, to, piece, capturedPiece } = move;
        this.board[from.row][from.col] = piece;
        this.board[to.row][to.col] = capturedPiece || { identifier: "empty" } as ts.Empty;
    }

    public getBestMove(depth: number): Move | null {
        let bestMove: Move | null = null;
        let bestValue = -Infinity;

        const moves = this.generateMoves();
        for (const move of moves) {
            this.makeMove(move);
            const moveValue = this.minimax(depth - 1, -Infinity, Infinity, false);
            this.undoMove(move);

            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = move;
            }
        }
        return bestMove;
    }

    public isCheck(player: boolean): boolean {
        return false;
    }

    public isCheckmate(player: boolean): boolean {
        return false;
    }

    public isStalemate(player: boolean): boolean {
        return false;
    }

    public applyMove(move: Move): Array<Array<ts.Piece>> {
        const { from, to, piece } = move;

        if (!this.isValidMove(piece, from, to)) {
            console.log("Invalid move: Cannot apply the move.");
            return this.board;
        }

        const capturedPiece = this.board[to.row][to.col];

        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = { identifier: "empty" } as ts.Empty;

        this.board[to.row][to.col] = capturedPiece;
        return this.board;
    }
}

let startBoard = [
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'bp', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['bp', 'bp', 'bp', 'bp', 'e', 'bp', 'bp', 'bp'],
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
]

const engine = new ChessEngine(startBoard);

engine.printBoard();

engine.setPlayer(false);
let moves = engine.getBestMove(3);

console.log(moves);