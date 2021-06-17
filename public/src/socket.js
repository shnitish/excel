socket.on("setRealTimeCell", function(realTimeCellInfo)
{
  let {username, rowId, colId} = realTimeCellInfo;
  if(document.querySelector(".realtime-cell"))
  {
    document.querySelector(".realtime-cell").classList.remove("realtime-cell");
    document.querySelector(".username-div").remove();
  }
  
  let usernameDiv = document.createElement("div");
  usernameDiv.textContent = username;
  usernameDiv.classList.add("username-div");
  let realtimeCell = document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`);
  realtimeCell.classList.add("realtime-cell");
  realtimeCell.append(usernameDiv);
})

socket.on("setCellValue", function(cellValue)
{
  let realtimeCell = document.querySelector(".realtime-cell");
  let childNodes =  realtimeCell.childNodes;
  if(childNodes.length == 1)
  {
    let usernameDiv = childNodes[0];
    realtimeCell.innerHTML = cellValue;
    realtimeCell.append(usernameDiv);
  }
  else
  {
    let usernameDiv = childNodes[1];
    realtimeCell.innerHTML = cellValue;
    realtimeCell.append(usernameDiv);
  }
})