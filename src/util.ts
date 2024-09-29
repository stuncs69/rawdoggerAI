import * as ts from "./types";

export function parseBoard(
    rawBoard: Array<Array<string>>
): Array<Array<ts.Piece>> {
    let parsedBoard: Array<Array<ts.Piece>> = [];

    rawBoard.forEach((verticalRow: Array<string>, rowIndex: number) => {
        if (verticalRow.length !== 8) {
            console.warn(`Row ${rowIndex} does not have 8 pieces:`, verticalRow);
            return;
        }

        parsedBoard[rowIndex] = [];

        verticalRow.forEach((rawPiece: string, pieceIndex: number) => {
            const user = rawPiece.startsWith("w");
            const pieceType = rawPiece.slice(1);

            let piece: ts.Piece;

            switch (pieceType) {
                case "p":
                    piece = { player: user, identifier: "pawn" } as ts.Pawn;
                    break;
                case "r":
                    piece = { player: user, identifier: "rook" } as ts.Rook;
                    break;
                case "b":
                    piece = { player: user, identifier: "bishop" } as ts.Bishop;
                    break;
                case "n":
                    piece = { player: user, identifier: "knight" } as ts.Knight;
                    break;
                case "q":
                    piece = { player: user, identifier: "queen" } as ts.Queen;
                    break;
                case "k":
                    piece = { player: user, identifier: "king" } as ts.King;
                    break;
                case "e":
                default:
                    piece = { identifier: "empty" } as ts.Empty;
                    break;
            }

            parsedBoard[rowIndex][pieceIndex] = piece;
        });
    });

    return parsedBoard;
}
