import { RotationMove, DirectionCells } from "./core.js";
import { LangtonAnt } from "./ant.js";
export class LangtonGame {
    // okay esto esta bastante bien
    private readonly FPS = 60
    private readonly frameDelay = 1000 / this.FPS
    private lastFrameTime: number = 0

    data: number[] = [];
    cellStates: DirectionCells[] = [
        new DirectionCells(
            "white", RotationMove.RotateLeft,
        ),
        new DirectionCells(
            "black", RotationMove.RotateRight,
        ),
        new DirectionCells(
            "red", RotationMove.RotateRight,

        ),
        new DirectionCells(
            "purple", RotationMove.RotateLeft,
        ),
        new DirectionCells(
            "blue", RotationMove.RotateRight,
        )];
    ants: LangtonAnt[] = []
    constructor(
        public ctx: CanvasRenderingContext2D,
        public width: number,
        public height: number,
        public blockSize: number, // (cw*ch)/(mw*mh)
    ) {
        this.data = new Array(width * height).fill(0);
    }
    // 
    draw() {

        const currentTime = performance.now()
        const deltaTime = currentTime - this.lastFrameTime
        if (deltaTime >= this.frameDelay) {
            for (let i = 0; i < this.data.length; i++) {
                const x = i % this.width;
                const y = Math.floor(i / this.width);
                const value = this.data[i]
                this.ctx.fillStyle = this.cellStates[value % this.cellStates.length].color;
                this.ctx.fillRect(x * this.blockSize,
                    y * this.blockSize,
                    this.blockSize,
                    this.blockSize);

            }
            for (let ant of this.ants) {
                ant.update(this.cellStates, this.data, this.width, this.height);
                ant.draw(this.ctx, this.blockSize);
            }
            this.lastFrameTime = currentTime

        }
        requestAnimationFrame(() => this.draw())
    }
    deleteCell(id: number) {
        if (this.cellStates.length === 1) {
            return;
        }
        const index = this.cellStates.findIndex((v) => v.identifier === id);
        console.log(index, id)

        this.cellStates.splice(index, 1);
    }
    addNewCell() {
        this.cellStates.push(new DirectionCells(
            `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
            RotationMove.RotateLeft));

    }
    updateCell(id: number, cell: DirectionCells) {
        const index = this.cellStates.findIndex((v) => v.identifier === id);
        console.log(index, id)
        this.cellStates[index] = cell;
    }
    getCell(id: number): DirectionCells {
        const index = this.cellStates.findIndex((v) => v.identifier === id);
        return this.cellStates[index];
    }
    restart() {
        this.data = new Array(this.width * this.height).fill(0)
        this.ants = []
    }
    onClick(xScreenRatio: number, yScreenRatio: number) {
        const x = Math.floor(xScreenRatio * this.width);
        const y = Math.floor(yScreenRatio * this.height);
        this.ants.push(new LangtonAnt(x, y));
    }


}