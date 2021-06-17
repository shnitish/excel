function getRowIdColIdFromElement(element)
{
    let rowId = element.getAttribute("rowid");
    let colId = element.getAttribute("colid");

    return {rowId, colId};
}

// replace cell with it's value in the formula bar
function solveFormula(formula, selfCellObject)
{
    // "( A1 + A2 )" => "(10 + 10)"
    let formulaComponents = formula.split(" ");
    // ["(", "A1", "+", "A2", ")"]
    
    // this loop replaces value of A1 and A2 in formula with their cell value
    for(let i = 0; i < formulaComponents.length; i++)
    {   
        // extract A from "A1" and A from "A2"
        let formulaComponent = formulaComponents[i];
        if(formulaComponent[0] >= "A" && formulaComponent[0] <= "Z")
        {
            // extract value present at A1 and A2
            let {rowId, colId} = getRowIdColIdFromAddress(formulaComponent);
            let cellObject = db[rowId][colId];
            let value = cellObject.value;

            if(selfCellObject)
            {
                // push yourself in the childrens and parents array of fomrmula comp cellobj
                cellObject.childrens.push(selfCellObject.name);
                selfCellObject.parents.push(cellObject.name);

            }
            formula = formula.replace(formulaComponent, value);
        } 
    }

    let computedValue = eval(formula);
    return computedValue;
}

// update every children if a cell value is updated
function updateChildren(cellObject)
{
    for(let i = 0; i < cellObject.childrens.length; i++)
    {
        let childrenName = cellObject.childrens[i];
        let {rowId, colId} = getRowIdColIdFromAddress(childrenName);
        let childrenCellObject = db[rowId][colId];
        let newValue = solveFormula(childrenCellObject.formula);

        document.querySelector(`div[rowid='${rowId}'][colid='${colId}']`).textContent = newValue;
        childrenCellObject.value = newValue;
        updateChildren(childrenCellObject);
    }
}

function removeFormula(cellObject)
{
    cellObject.formula = "";
    for(let i = 0; i < cellObject.parents.length; i++)
    {
        let parentName = cellObject.parents[i];
        let {rowId, colId} = getRowIdColIdFromAddress(parentName);
        let parentCellObject = db[rowId][colId];

        let updatedChildrens = parentCellObject.childrens.filter(function(children)
        {
            return children != cellObject.name;
        })

        parentCellObject.childrens = updatedChildrens;
    }
    cellObject.parents = [];
}


function getRowIdColIdFromAddress(address)
{
    let rowId =  Number(address.substring(1)) - 1;
    let colId = address.charCodeAt(0) - 65;

    return {rowId, colId};
}

