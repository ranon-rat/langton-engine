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
            <input type="color" class="color-cell-picker" data-identifier="${c.identifier}" id="${c.identifier}" value="${c.color}">
        </span>`
    )).join("");

    // Agregar event listeners DESPUÉS de insertar el HTML
    const deleteButtons = antCells!.querySelectorAll('.delete-cell');
    const colorUpdate = antCells!.querySelectorAll(".color-cell-picker");
    const updateButtons = antCells!.querySelectorAll(".cell-button");
    deleteButtons.forEach((button) => {
        const identifier = parseInt((button as HTMLElement).dataset.identifier!);
        button.addEventListener('click', () => deleteCell(identifier));
    });
    colorUpdate.forEach((element) => {
        const input = element as HTMLInputElement
        const identifier = parseInt(input.dataset.identifier!);
        const cell = game!.getCell(identifier);
        input.value = cell.color;
        input.addEventListener("input", (e) => {
            cell.color = input.value;
            const cellButton = antCells!.querySelector<HTMLButtonElement>(`.cell-button[data-identifier="${identifier}"]`);
            cellButton!.style.backgroundColor = cell.color;
        })
    })
    updateButtons.forEach((element) => {
        const button = element as HTMLElement
        const identifier = parseInt((button as HTMLElement).dataset.identifier!);
        let cell = game!.getCell(identifier)
        button.addEventListener("contextmenu", e => {
            e.preventDefault()
            const input = antCells!.querySelector(`input[data-identifier="${identifier}"]`) as HTMLInputElement
            const rect = button.getBoundingClientRect();

            input.style.left = `${rect.right + 6}px`;
            input.style.top = `${rect.top}px`;

            input.style.opacity = "1";
            input.style.pointerEvents = "auto";

            input.click();
        });

        button.addEventListener("click", (e: MouseEvent) => {

            cell.rotation = ({
                [RotationMove.RotateLeft]: RotationMove.RotateRight,
                [RotationMove.RotateRight]: RotationMove.RotateLeft,
                [RotationMove.NothingYet]: RotationMove.RotateLeft,
            } as Record<RotationMove, RotationMove>)[cell.rotation];
            button.innerText = {
                [RotationMove.RotateLeft]: "◂",
                [RotationMove.RotateRight]: "▸",
                [RotationMove.NothingYet]: "?",
            }[cell.rotation];

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
