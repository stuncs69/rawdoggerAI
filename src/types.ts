export interface Pawn {
    player: boolean
}

export interface Rook {
    player: boolean
}

export interface Knight {
    player: boolean
}

export interface Queen {
    player: boolean
}

export interface King {
    player: boolean
}

export interface Bishop {
    player: boolean
}

export interface Empty {
    // Empty
}

export interface Piece {
    piece: Pawn | Rook | Knight | Queen | King | Bishop | Empty
}

export interface Message {
    logId: number,
    // 0 for white, 1 for black
    player: boolean,
    // 8 An array for horizontal rows, containing arrays for vertical rows containing Pieces
    board: Array<Array<Piece>>
}