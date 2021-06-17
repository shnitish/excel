let addSheetBtn = document.querySelector(".add-sheet");
let sheetsList = document.querySelector(".sheets-list");
let sheetId = 0;

// add sheet function
addSheetBtn.addEventListener("click", function(e){
    sheetId++;
    document.querySelector(".active-sheet").classList.remove("active-sheet");

    let sheetDiv = document.createElement("div");
    sheetDiv.classList.add("sheet");
    sheetDiv.classList.add("active-sheet");
    sheetDiv.setAttribute("sheetId", sheetId);
    sheetDiv.innerHTML = `Sheet ${sheetId + 1}`;

    sheetsList.append(sheetDiv);
    initUI();
    initDB();
})

// swtich b/w sheets
sheetsList.addEventListener("click", function(e){
    let selectedSheet = e.target;

    if(selectedSheet.classList.contains("active-sheet"))
    {
        return;
    }

    document.querySelector(".active-sheet").classList.remove("active-sheet");
    selectedSheet.classList.add("active-sheet");

    // init new UI before switching b/w sheets  
    initUI();
    // set current db to active sheet db and set UI
    let sheetID = selectedSheet.getAttribute("sheetid");
    db = sheetsDB[sheetID].db;
    visitedCells = sheetsDB[sheetID].visitedCells;
    setUI();
})

function setUI()    
{
    for(let i = 0; i < visitedCells.length; i++)
    {
        let {rowId, colId} = visitedCells[i];
        let cellObject = db[rowId][colId];
        document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`).innerHTML = cellObject.value;
    }

}

// for every new sheet
function initUI()
{
    for(let i = 0; i < visitedCells.length; i++)
    {
        let {rowId, colId} = visitedCells[i];
        let cell = document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`);
        cell.innerHTML = "";
    }
}
