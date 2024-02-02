const state = {
  gameElement: document.querySelector(".game"),
  cells: Array(9).fill(null),
  symbols: ["O", "X"],
  turn: true,
  winningCombs: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],
  gameFinished: false
};

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
var difficulty = 50;


function answer(depth,maxPlayer){

  if(maxPlayer){
    return depth-10;
  }
  else{
    return +10-depth;
  }
}

function minMax(depth,maxPlayer){


  

  if( checkForWinner() ){
    return answer(depth,maxPlayer);     
  }

  if(checkForDraw()){
    return 0;
  }

  

  if (maxPlayer){
    let value = -100;


    for(let i = 0 ; i < 9 ; i++){

     
      if(state.cells[i] === null){
         
          state.cells[i] = "X";
          let answer = minMax(depth+1,false);
          value = Math.max(value,answer);
          state.cells[i] = null;
      }
      
    }
    return value;
  }
  else{
    let value = 100;

    for(let i = 0 ; i < 9 ; i++){
      if(state.cells[i] === null){

          state.cells[i] = "O";
          let answer = minMax(depth+1,true);
          value = Math.min(value,answer);
          state.cells[i] = null;
      }
     
    }
    return value;
  }
  
}


function drawBoard() {


  slider.oninput = function() {
    difficulty = this.value;
    output.innerHTML = difficulty;
  }


  state.gameElement.innerHTML = "";
 
  
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (state.cells[i]) {
      const cellSymbol = document.createElement("p");
      cellSymbol.innerText = state.cells[i];
      cellSymbol.classList.add("symbol");

      cell.append(cellSymbol);
    } else {
      
        cell.addEventListener("click", function () {

          if (state.gameFinished) {
            console.log("GAMEOVER");
            return;
          }
          
          state.turn = false;
          state.cells[i] = "X";

          drawBoard();


          if (checkForWinner()) {
            state.gameFinished = true;
            drawMessage("HUMAN WINS");
            return;

          }

          if (checkForDraw()) {
            state.gameFinished = true;
            drawMessage("DRAW");
            return;
          }  
          ///robot turn
          let value = 100;
          let theI = -1;
          //find the move
          let epsilon = Math.floor(Math.random() * 100);
          if(epsilon <= difficulty){
            console.log("good move")
            //perform good move
              for(let j = 0 ; j < 9 ; j++){
                if(state.cells[j] === null){
                  state.cells[j] = "O";
                  let answer = minMax(0,true);
                  if(value > answer){
                    value = answer;
                    theI = j;
                  }
                  state.cells[j] = null;
              }

            }
            //do the move
            state.cells[theI] = "O";
            
          }else{
            console.log("weak move")
            //weak move
            let lmao = Math.floor(Math.random()*9);
            let breaker = 0;
            console.log(lmao);
            while( state.cells[lmao] !== null){
              lmao++;
              lmao = lmao % 9;
              console.log(lmao);
              breaker++;

              if(breaker >=9 )
                break;
            }

            if(breaker < 9){
              state.cells[lmao] = "O";
            }
          
          }

          state.turn = true;
          drawBoard();


          if (checkForWinner()) {
            state.gameFinished = true;
            drawMessage("ROBOT WINS");
            return;

          }

          if (checkForDraw()) {
            state.gameFinished = true;
            drawMessage("DRAW");
            return;
          }   
            });
          }
       

      state.gameElement.append(cell);
    }
  
   
  } 


function checkForWinner() {
  return state.winningCombs.some(function (combo) {
    const cells = combo.map(function (index) {
      return state.cells[index];
    });

    return !cells.includes(null) && new Set(cells).size === 1;
  });
}

function checkForDraw() {
  return state.cells.every(function (cell) {
    return cell !== null;
  });
}

function drawMessage(message) {
  const banner = document.createElement("div");
  banner.classList.add("banner");

  const h1 = document.createElement("h1");
  h1.innerText = message;
  banner.append(h1);
  state.gameElement.append(banner);
}



drawBoard();
