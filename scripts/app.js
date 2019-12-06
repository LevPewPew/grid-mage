const style = document.createElement('style');
style.type = 'text/css';
document.getElementsByTagName('head')[0].appendChild(style);
const gridContainer = document.getElementById("grid-container");
const formReload = document.getElementById("form-settings");

// default configuration
let settings = {
  mode: "color"
};

let gridMap;
let newPosition; // y, x (row, column)
let tileNumber;

// TODO do a generation on DOM load
document.addEventListener("DOMContentLoaded", () => {
  generatePage(settings);
});

// TODO genearte this stuff on submit listen
formReload.addEventListener("submit", (event) => {
  event.preventDefault();
  settings.mode = document.querySelector('input[name="mode"]:checked').value;
  generatePage(settings);
});

function generatePage(settings) {
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
  // "temp" value to simplify algorithm for creation of first row, something to compare against that will not match the index being used/checked
  gridMap = [
    ["temp", "temp", "temp", "temp"],
    ["temp", "temp", "temp", "temp"]
  ];
  newPosition = [2, 0]; // y, x (row, column)
  tileNumber = 0;

  // grid on page load, keep i limit multiples of grid width to ensure a perfect rectangle
  for (let i = 0; i < 250; i++) {
    generateGridPieceLocation();
  }
  gridMap = gridMap.slice(2);
  for (let i = 0; i < 250; i++) {
    switch (settings.mode) {
      case "color":
        constructTile(i);
        break;
      case "image":
        constructTileWithImg(i);
        break;
      default:
        constructTile(i);
    }
  }
}

// TODO once it is working, i think it should be easy to modify to be able to dynamically define the width of the grid, and potentially even max dimensions of the tiles. if i can, i can put buttons onto the web page to allow the user to do that themselves, cool. make the buttons a little transparent console thing you can minimize and expand from an fixed position in corner
function generateGridPieceLocation() {
  // need to consider if new row doesn't exist yet, because cannot create new 2D co-ordinate/square in one go due to undefined error
  if (!gridMap[newPosition[0]]) {
    gridMap[newPosition[0]] = ["temp"];
  }

  // in order to allow tiles to get deeper, we must have the tileNumber be able to "jump back" to a previously place tileNumber by looking at the tile in the row above to determine a temp tileNumber value to use. also increase the tileNumber otherwise a rectangle has the potential to "slice" in between a tile.
  let tileNumberAbove;
  if (allowDepth() && forceRectangleContinue()) {
    tileNumberAbove = gridMap[newPosition[0] - 1][newPosition[1]];
    tileNumber++;
  } else if (randBool() && allowDepth() && forceRectangleBegin()) {
    tileNumberAbove = gridMap[newPosition[0] - 1][newPosition[1]];
    tileNumber++;
  }

  if (allowWidth()) {
    gridMap[newPosition[0]][newPosition[1]] = tileNumberAbove || tileNumber;
  } else {
    gridMap[newPosition[0]][newPosition[1]] = tileNumberAbove || ++tileNumber;
  }

  // 50/50 chance for next square to be an extra square of the same tile number, or move to a new tile number (assuming the next square isn't forced to the next tile number by now meeting the allowDepth and allowWidth size restrictions)
  if (randBool()) {
    tileNumber++;
  }

  // update newPosition for next call of this function
  if (newPosition[1] === 3) {
    [newPosition[0], newPosition[1]] = [newPosition[0] + 1, 0];
  } else {
    [newPosition[0], newPosition[1]] = [newPosition[0], newPosition[1] + 1];
  }
}

// flip a coin
function randBool() {
  return Math.random() >= 0.5;
}

function randomHexColor() {
  const maxHex = 0xFFFFFF;
  hex = Math.floor(Math.random() * maxHex).toString(16);
  return `#${hex}`
}

// function to help determine how many squares above the newTile are already mapped to the tile index attempting to generate itself
function allowDepth() {
  let allow;
  let square1Above = gridMap[newPosition[0] - 1][newPosition[1]];
  let square2Above = gridMap[newPosition[0] - 2][newPosition[1]];

  // if the previous 2 squares are the same, allow false to begin on next tile number
  if (square1Above === square2Above) {
    allow = false;
  } else {
    allow = true;
  }

  return allow;
}

// function to help determine how many squares to the left of the newTile are already mapped to the tile index attempting to generate itself
// TODO remake this later to allow for side pieces tht are 1x2
function allowWidth() {
  let allow;
  if (gridMap[newPosition[0]] && newPosition[0] > 1) {
    let square1Left = gridMap[newPosition[0]][newPosition[1] - 1];
    let square2Left = gridMap[newPosition[0]][newPosition[1] - 2];
    let prevRowLastSquare = gridMap[newPosition[0] - 1][3]

    // if the previous 2 squares, or the last square on the previous row, are the same as the current tile number, allow false to begin on next tile number
    if (square1Left === square2Left || prevRowLastSquare === tileNumber) {
      allow = false;
    } else {
      allow = true;
    }
  } else {
    allow = false;
  }

  return allow;
}

// this checks if tileNumber should be increased or not, returning true when setting the current tileNumber to that of the square above won't create a non-rectangular shape;
function forceRectangleBegin() {
  let force;
  let square1Above = gridMap[newPosition[0] - 1][newPosition[1]];
  let square1AbovePrev = gridMap[newPosition[0] - 1][newPosition[1] - 1];
  let squarePrev = gridMap[newPosition[0]][newPosition[1] - 1];

  if (square1AbovePrev === square1Above && square1AbovePrev !== squarePrev) {
    force = false;
  } else {
    force = true;
  }

  return force;
}

// this checks if tileNumber should be increased or not, returning false when continuing the tileNumber sequence would produce a non rectangular shape and true when the new tileNumber should be set to that of the square above;
function forceRectangleContinue() {
  let force;
  let square1Above = gridMap[newPosition[0] - 1][newPosition[1]];
  let square1AbovePrev = gridMap[newPosition[0] - 1][newPosition[1] - 1];
  let squarePrev = gridMap[newPosition[0]][newPosition[1] - 1];

  if (square1AbovePrev === squarePrev && square1Above === squarePrev) {
    force = true;
  } else {
    force = false;
  }

  return force;
}

function constructTileWithImg(index) {
  let {
    id,
    rowStart,
    rowEnd,
    colStart,
    colEnd
  } = constructTileAttributes(index);
  if (id) {
    let columns = colEnd - colStart;
    let rows = rowEnd - rowStart;
    fetch(`https://picsum.photos/${columns * 200}/${rows * 200}`)
      .then((response) => {
        let imageUrl = response.url;
        gridContainer.innerHTML += tileComponentWithImgHTML(id, imageUrl);
        style.innerHTML += tileComponentCSS(id, rowStart, rowEnd, colStart, colEnd);

        return response.json();
      })
      .catch((error) => {
        return error;
      });
  }
}

function constructTile(index) {
  let {
    id,
    rowStart,
    rowEnd,
    colStart,
    colEnd
  } = constructTileAttributes(index);
  if (id) {
    gridContainer.innerHTML += tileComponentHTML(id);
    style.innerHTML += tileComponentCSS(id, rowStart, rowEnd, colStart, colEnd);
  }
}

// searches for gridMap co-ordinates for tile with given id, if any. then returns the css attributes needed to construct this
function constructTileAttributes(id) {
  let coords = [
    [],
    []
  ]
  for (let row = 0; row < gridMap.length; row++) {
    for (let column = 0; column < gridMap[row].length; column++) {
      if (gridMap[row][column] === id) {
        coords[0].push(row);
        coords[1].push(column);
      }
    }
  }

  // remove dupes
  coords[0] = new Set(coords[0]);
  coords[0] = [...coords[0]];
  coords[1] = new Set(coords[1]);
  coords[1] = [...coords[1]];
  let cssAttributes = {
    id: null,
    rowStart: null,
    rowEnd: null,
    colStart: null,
    colEnd: null
  }
  if (typeof(coords[0][0]) === "number") {
    cssAttributes = {
      id: id,
      rowStart: coords[0][0] + 1,
      rowEnd: coords[0][coords[0].length - 1] + 2,
      colStart: coords[1][0] + 1,
      colEnd: coords[1][coords[1].length - 1] + 2
    }
  }

  return cssAttributes;
}

function tileComponentHTML(id) {
  let html = `<div id=tile-${id}></div>`;

  return html;
}

function tileComponentWithImgHTML(id, imageUrl) {
  let html = `
    <div id=tile-${id}>
      <img src=${imageUrl} />
    </div>
  `;

  return html;
}

function tileComponentCSS(id, rowStart, rowEnd, colStart, colEnd) {
  let width = colEnd - colStart;
  let height = rowEnd - rowStart;
  let css = `
    #tile-${id} {
      width: ${width * 200}px;
      height: ${height * 200}px;
      grid-row: ${rowStart} / ${rowEnd};
      grid-column: ${colStart} / ${colEnd};
      background: ${randomHexColor()};
      border: 1px solid black;
    }
  `;

  return css;
}

// TODO as part of the css scanning algorithm, somehow make the search shrink in size based on tiles or nubmers already saerched for or something like that, to prevent longer and longer searches as the page scrolls down.

// TODO add event listener scrolling at bottom creates more