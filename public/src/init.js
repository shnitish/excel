let cellsContentDiv = document.querySelector(".cells-content");

function initCell()
{
    // top most fixed row
    let cellsContent = `<div class="top-left-cell"></div>`;
    cellsContent += `<div class="top-row">`;
    for(let i = 0; i < 26; i++)
    {
        cellsContent += `<div class="top-row-cell" trid="${i}">${String.fromCharCode(65 + i)}</div>`;
    }
    cellsContent += `</div>`;

    // leftmost fixed col
    cellsContent += `<div class = "left-col">`;
    for(let i = 0; i < 100; i++)
    {
        cellsContent += `<div class="left-col-cell" lcid="${i}">${i + 1}</div>`;
    }
    cellsContent += `</div>`;
    cellsContent += `<div class="cells">`;
    // inner cells
    for(let i = 0; i < 100; i++)
    {
        cellsContent += `<div class="row">`;
        for(let j = 0; j < 26; j++)
        {
            cellsContent += `<div class="cell" rowid="${i}" colid="${j}" contenteditable="true"></div>`;
        }
        cellsContent += `</div>`;
    }
    cellsContent += `</div>`;

    cellsContentDiv.innerHTML = cellsContent;
}
initCell();

let sheetsDB = [];
let db = []; //active DB
let visitedCells;
function initDB()
{
    newSheetDB = [];
    for(let i = 0; i < 100; i++)
    {
        let row = [];
        for(let j = 0; j < 26; j++)
        {
            let name = String.fromCharCode(j + 65) + (i + 1) + "";
            let cellObject = {
                name: name,
                value: "",
                formula: "",
                childrens: [],
                parents: [],
                visited: false,
                fontStyle: {bold: false, underline: false, italic: false},
                textAlign: "left"
            }
            row.push(cellObject);
        }
        newSheetDB.push(row);
    }
    visitedCells = [];
    sheetsDB.push({db: newSheetDB, visitedCells: visitedCells});
    db = newSheetDB;
}

initDB();