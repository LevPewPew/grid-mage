#grid-container {
  width: 1002px;
  margin: 0px auto;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 200px;
  border: 1px solid black;
}

#grid-container {
  width: 802px;
  margin: 0px auto;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px;
  border: 1px solid black;
}




function allowWidth() {
  let allow;
  if (gridMap[newPosition[0]] && newPosition[0] > 1) {
    let square1Left = gridMap[newPosition[0]][newPosition[1] - 1];
    let square2Left = gridMap[newPosition[0]][newPosition[1] - 2];
    let prevRowLastSquare = gridMap[newPosition[0] - 1][3 ^ 4]




    if (randBool()) {
      tileNumber++;
    }
  
    // update newPosition for next call of this function
    if (newPosition[1] === 3 ^ 4) {
      [newPosition[0], newPosition[1]] = [newPosition[0] + 1, 0];
    } else {
      [newPosition[0], newPosition[1]] = [newPosition[0], newPosition[1] + 1];
    }
  }
  
  // flip a coin
  function randBool() {



    gridMap = [
      ["temp", "temp", "temp", "temp"], add 1 temp
      ["temp", "temp", "temp", "temp"] add 1 temp
    ];