let topRow = document.querySelector(".top-row");
let leftCol = document.querySelector(".left-col");
let topLeftCell = document.querySelector(".top-left-cell");
let allCells = document.querySelectorAll(".cell");
let lastSelectedCell;
let formulaInput = document.querySelector("#formula");
let addressInput = document.querySelector("#address");

let username = prompt("Enter your name!");
socket.emit("userConnected", username);

// fix top row and left most col 
cellsContentDiv.addEventListener("scroll", function(e){
    let top = e.target.scrollTop;
    let left = e.target.scrollLeft;

    topRow.style.top = top + "px";
    topLeftCell.style.top = top + "px";
    topLeftCell.style.left = left + "px";
    leftCol.style.left = left + "px";
})

let rowId;
let colId;
// get row and col cell where input was given
for(let i = 0; i < allCells.length; i++)
{
    allCells[i].addEventListener("click", function(e){

        // add active class on a cell
        if(lastSelectedCell)
        {
            lastSelectedCell.classList.remove("active-cell");
            document.querySelector(`div[trid="${colId}"]`).classList.remove("cell-selected");
            document.querySelector(`div[lcid="${rowId}"]`).classList.remove("cell-selected");
        }
        rowId = Number(e.target.getAttribute("rowid"));
        colId = Number(e.target.getAttribute("colid"));
        e.target.classList.add("active-cell");
        document.querySelector(`div[trid="${colId}"]`).classList.add("cell-selected");
        document.querySelector(`div[lcid="${rowId}"]`).classList.add("cell-selected");

        let cellObject = db[rowId][colId];
        let address = String.fromCharCode(65 + colId) + (rowId + 1) + "";
        addressInput.value = address;
        formulaInput.value = cellObject.formula;

        // bold underline italic
        cellObject.fontStyle.bold ? document.querySelector(".bold").classList.add("active-font-style") : document.querySelector(".bold").classList.remove("active-font-style");

        cellObject.fontStyle.underline ? document.querySelector(".underline").classList.add("active-font-style") : document.querySelector(".underline").classList.remove("active-font-style");

        cellObject.fontStyle.italic ? document.querySelector(".italic").classList.add("active-font-style") : document.querySelector(".italic").classList.remove("active-font-style");

        // set alignments
        if(lastSelectedCell)
        {
            document.querySelector(".font-alignment .active-font-style").classList.remove("active-font-style");
        }
        let textAlignment = cellObject.textAlign;
        document.querySelector(`.${textAlignment}`).classList.add("active-font-style");

        socket.emit("cellClicked", {rowId, colId});
    })
    
    allCells[i].addEventListener("blur", function(e)
    {
        lastSelectedCell = e.target;
        let cellValue = e.target.textContent;
        let cellObject = db[rowId][colId];

        if(cellObject.value == cellValue)
        {
            return;
        }

        // if manually update a cell value then, remove it's dependent formula if any, and also remove himself from the parents list
        if(cellObject.formula)
        {
            removeFormula(cellObject);
            formulaInput.value = "";
        }

        // update val on db
        cellObject.value = cellValue;
        updateChildren(cellObject);

        if(cellObject.visited)
        {
            return;
        }

        // store visitedCells of particular DB and mark it visited
        cellObject.visited = true;
        visitedCells.push({rowId: rowId, colId: colId});
    })

    // if backspace is used on a cell 
    allCells[i].addEventListener("keydown", function(e){
        if(e.key == "Backspace")
        {
            let cell = e.target;
            let {rowId, colId} = getRowIdColIdFromElement(cell);
            let cellObject = db[rowId][colId];
            if(cellObject.formula)
            {
                cellObject.formula = "";
                formulaInput.value = "";
                removeFormula(cellObject);
                cell.textContent = "";
            }
        }
    })
    
    allCells[i].addEventListener("keyup", function(e)
    {
        let cellValue = allCells[i].textContent;
        socket.emit("cellValue", cellValue);
    })
}

// event on formula input box
formulaInput.addEventListener("blur", function(e){
    let formula = e.target.value;
    if(formula)
    {
        let {rowId, colId} = getRowIdColIdFromElement(lastSelectedCell);
        let cellObject = db[rowId][colId]; 

        if(cellObject.formula)
        {
            removeFormula(cellObject);
        }
        
        let computedValue = solveFormula(formula, cellObject);

        cellObject.formula = formula;

        // update value on UI
        lastSelectedCell.textContent = computedValue;
        // update db after calc
        cellObject.value = computedValue;

        updateChildren(cellObject);

        // store visitedCells of particular DB and mark it visited
        // this mark cell visited when a particular formula is applied to a cell and it's value changes
        cellObject.visited = true;
        visitedCells.push({rowId: rowId, colId: colId});
    }
})