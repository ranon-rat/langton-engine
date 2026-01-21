import { RotationMove } from "./core.js";
import { LangtonGame } from "./game.js";
let game: LangtonGame | null = null;
let antCells: HTMLElement | null = null;
function deleteCell(identifier: number) {
    console.log("identifier", identifier)
    game!.deleteCell(identifier)
    renderCells()

}
function renderCells() {
    antCells!.innerHTML = game!.cellStates.map(c => (
        `<span class="ant-cell-container">
            <button class="cell-button" 
                style="background-color: ${c.color};" 
                data-identifier="${c.identifier}">
                ${{
            [RotationMove.RotateLeft]: "◂",
            [RotationMove.RotateRight]: "▸",
            [RotationMove.NothingYet]: "?",
        }[c.rotation]
        }
            </button>
            <button class="delete-cell" data-identifier="${c.identifier}">x</button>
        </span>`
    )).join("");

    // Agregar event listeners DESPUÉS de insertar el HTML
    const deleteButtons = antCells!.querySelectorAll('.delete-cell');
    console.log(deleteButtons)
    deleteButtons.forEach((button) => {
        const identifier = parseInt((button as HTMLElement).dataset.identifier!);
        button.addEventListener('click', () => deleteCell(identifier));
    });
    const updateButtons = antCells!.querySelectorAll(".cell-button");
    updateButtons.forEach((element) => {
        const button = element as HTMLElement
        button.addEventListener("contextmenu", e => e.preventDefault());
        const identifier = parseInt((button as HTMLElement).dataset.identifier!);
        let cell = game!.getCell(identifier)
        button.addEventListener("click", (e: MouseEvent) => {
            switch (e.button) {
                case 0:
                    cell.rotation = ({
                        [RotationMove.RotateLeft]: RotationMove.RotateRight,
                        [RotationMove.RotateRight]: RotationMove.RotateLeft,
                        [RotationMove.NothingYet]: RotationMove.RotateLeft,
                    } as Record<RotationMove, RotationMove>)[cell.rotation];
                    button.innerText = {
                        [RotationMove.RotateLeft]: "◂",
                        [RotationMove.RotateRight]: "▸",
                        [RotationMove.NothingYet]: "?",
                    }[cell.rotation]
                    break;
                case 1:
                    alert("weird freak");
                    break;
                case 2:
                    // en el derecho me gustaria 
                    // poder llegar a cambiar el color me pregunto 
                    // a ya se como puedo hacer esto pero tengo que pensar un poco en como hacerlo hmm
                    console.log("Derecho", identifier);
                    break;
            }
        });
    })

}
window.addEventListener("DOMContentLoaded", (_) => {
    // elements
    const canvas = document.getElementById("screen")! as HTMLCanvasElement;
    const restartButton = document.getElementById("ant-restart")!
    const addMore = document.getElementById("add-more")!;
    antCells = document.getElementById("ant-cells")!
    // api 

    const ctx = canvas.getContext("2d")!;
    const [width, height] = [canvas.width, canvas.height];
    const [mapWidth, mapHeight] = [50, 50];
    const blockSize = (canvas.width * canvas.height) / (mapWidth * mapHeight)
    game = new LangtonGame(ctx, mapWidth, mapHeight, Math.sqrt(blockSize));
    game.draw();
    // events
    canvas.onclick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / width;
        const y = (e.clientY - rect.top) / height;
        game!.onClick(x, y);
    }
    restartButton.onclick = (_) => {
        game!.restart();
    }
    addMore.onclick = (_) => {
        game?.addNewCell()
        renderCells();

    }
    renderCells()



});
