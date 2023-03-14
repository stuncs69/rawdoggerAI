import * as ts from "./types";

export function parseBoard(
    rawBoard: Array<Array<string>>
): Array<Array<ts.Piece>> {
    let parsedBoard: any = [];
    rawBoard.forEach((verticalRow: Array<String>, index: number) => {
        parsedBoard[index] = [];
        verticalRow.forEach((rawPiece: String, pieceIndex: number) => {
            let user: boolean;
            switch (rawPiece.startsWith("w")) {
                case true:
                    user = true;
                    break;

                default:
                    user = false;
                    break;
            }

            switch (rawPiece.slice(1)) {
                case "p":
                    // Pawn
                    parsedBoard[index][pieceIndex] = {
                        player: user,
                        identifier: "pawn",
                    } as ts.Pawn;
                    break;

                case "r":
                    // Rook
                    parsedBoard[index][pieceIndex] = {
                        player: user,
                        identifier: "rook",
                    } as ts.Rook;
                    break;

                case "b":
                    // Bishop
                    parsedBoard[index][pieceIndex] = {
                        player: user,
                        identifier: "bishop",
                    } as ts.Bishop;
                    break;

                case "n":
                    // Knight
                    parsedBoard[index][pieceIndex] = {
                        player: user,
                        identifier: "knight",
                    } as ts.Knight;
                    break;

                case "q":
                    // Queen
                    parsedBoard[index][pieceIndex] = {
                        player: user,
                        identifier: "queen",
                    } as ts.Queen;
                    break;

                case "k":
                    // King
                    parsedBoard[index][pieceIndex] = {
                        player: user,
                        identifier: "king",
                    } as ts.King;
                    break;
                default:
                    parsedBoard[index][pieceIndex] = {} as ts.Empty;
                    break;
            }
        });
    });
    return parsedBoard as Array<Array<ts.Piece>>;
}
