export interface BasePiece {
    player: boolean;
    identifier: string;
}

export interface Pawn extends BasePiece {}
export interface Rook extends BasePiece {}
export interface Knight extends BasePiece {}
export interface Queen extends BasePiece {}
export interface King extends BasePiece {}
export interface Bishop extends BasePiece {}

export interface Empty {
    identifier: "empty";
}

export type Piece = Pawn | Rook | Knight | Queen | King | Bishop | Empty;

export interface Message {
    logId: number;
    player: boolean;
    board: Array<Array<string>>;
}

export interface Move {
    from: { row: number; col: number };
    to: { row: number; col: number };
    piece: Piece;
    capturedPiece?: Piece;
}
