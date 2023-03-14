export interface Pawn {
    player: boolean;
    identifier: string;
}

export interface Rook {
    player: boolean;
    identifier: string;
}

export interface Knight {
    player: boolean;
    identifier: string;
}

export interface Queen {
    player: boolean;
    identifier: string;
}

export interface King {
    player: boolean;
    identifier: string;
}

export interface Bishop {
    player: boolean;
    identifier: string;
}

export interface Empty {
    // Empty
}

export interface Piece {
    piece: Pawn | Rook | Knight | Queen | King | Bishop | Empty;
}

export interface Message {
    logId: number;
    // 0 for white, 1 for black
    player: boolean;
    // 8 An array for horizontal rows, containing arrays for vertical rows containing Pieces
    board: Array<Array<String>>;
}
