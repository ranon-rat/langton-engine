import { DirectionCells, RotationMove, type Vector, movesVectors } from "./core.js"

export class LangtonAnt {
    index: number = 0;
    currentState: RotationMove = RotationMove.NothingYet;
    constructor(
        public x: number,
        public y: number,
    ) { }
    updateRotation(cellMove: RotationMove) {
        this.currentState = cellMove;
    }

    updateIndex() {
        switch (this.currentState) {
            case RotationMove.RotateLeft:
                this.index++;
                break;
            case RotationMove.RotateRight:
                this.index--;
                break;
            case RotationMove.NothingYet:
                //console.log("weird shit")
                break;
        }
        if (this.index >= movesVectors.length) {
            this.index %= movesVectors.length
            return;
        }
        if (this.index < 0) {
            this.index += movesVectors.length
        }

    }
    updatePosition(width: number, height: number) {
        //console.log("index", this.index);
        const vec = movesVectors[this.index]
        //console.log(vec.dx, vec.dy);
        this.x += vec.dx;
        this.y += vec.dy;

        if (this.y >= height) {
            this.y = 0;
        }
        if (this.y < 0) {
            this.y += height;
        }
        if (this.x >= width) {
            this.x = 0;
        }
        if (this.x < 0) {
            this.x += width
        }
    }
    updateMap(index: number, data: number[], maxValue: number) {
        data[index]++;
        data[index] %= maxValue;
        return;

    }
    update(cells: DirectionCells[], data: number[], width: number, height: number) {
        const mapIndex = this.y * width + this.x
        const cellIndex = data[mapIndex];
        //console.log("this is the cell index", cellIndex, this.y, this.x, width, mapIndex);
        const currentRotation: RotationMove = cellIndex === null ?
            RotationMove.RotateRight :
            cells[cellIndex % cells.length].rotation;
        //console.log(cells, currentRotation)
        this.updateRotation(currentRotation);
        this.updateIndex()
        this.updatePosition(width, height);
        this.updateMap(this.y * width + this.x, data, cells.length);
    }

    draw(ctx: CanvasRenderingContext2D, blocksize: number) {
        ctx.fillStyle = "red"
        const padding = blocksize / 4
        const antsize = blocksize / 2
        ctx.fillRect(this.x * blocksize + padding, this.y * blocksize + padding, antsize, antsize)
        //console.log("drawing", this.x * blocksize, this.y * blocksize)
    }
}