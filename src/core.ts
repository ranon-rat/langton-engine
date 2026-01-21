export enum Status {
    Okay = 0,
    OutOfBoundsWidth,
    OutOfBoundsHeight,
}
export enum RotationMove {
    RotateLeft,
    RotateRight,
    NothingYet,
}
export interface Vector {
    dx: number,
    dy: number
}



export const movesVectors: Vector[] = [
    { dx: -1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
]
export class DirectionCells {
    identifier: number = 0;
    static index: number = 0;
    constructor(public color: string, public rotation: RotationMove) {
        this.identifier = DirectionCells.index++;
    }
}