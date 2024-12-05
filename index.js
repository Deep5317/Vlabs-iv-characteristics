// 0->one 1->two 2->three 3->four

wireTerminalCheck = [
  { one: false, resistor: false },
  { resistor: false, seven: false },
  { eight: false, four: false },
  { five: false, three: false },
  { seven: false, five: false },
  { eight: false, resistor: false },
  { resistor: false, six: false },
  { two: false, six: false },
];

terminalMap = {
  0: "one",
  1: "two",
  2: "three",
  3: "four",
  resistor: "resistor",
  4: "five",
  5: "six",
  6: "seven",
  7: "eight",
};

var xValues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];

sequenceNum = 0;

var rowData = { sno: 0, curr: 0, volts: 0 };
localStorage.setItem("rowData", JSON.stringify(rowData));
localStorage.setItem("fullScreen", false);


var btnPressed = [false, false];

setTimeout(() => {

  if(document.querySelector(".forward")){
    wireTerminalCheck = [
      { one: false, resistor: false },
      { resistor: false, seven: false },
      { eight: false, four: false },
      { five: false, three: false },
      { seven: false, five: false },
      { eight: false, resistor: false },
      { resistor: false, six: false },
      { two: false, six: false },
    ];
  }else{
    wireTerminalCheck = [
      { one: false, resistor: false },
      { resistor: false, seven: false },
      { eight: false, four: false },
      { five: false, three: false },
      { seven: false, five: false },
      { eight: false, resistor: false },
      { resistor: false, six: false },
      { two: false, six: false },
    ];
  }
  enablingSequence(sequenceNum);
}, 2000);

function enablingSequence(sequenceNum) {
  sessionStorage.setItem("circuitComplete",false)
  if(document.querySelector(".forward")){
    localStorage.setItem("type",false);
  }else{
    localStorage.setItem("type",true);
  }

  if (sequenceNum <= wireTerminalCheck.length) {
    for (var key in wireTerminalCheck[sequenceNum]) {
      elem = document.getElementsByClassName(key)[0];
      elem.style.stroke = "#FFFF00";
      elem.style.animationName = "pulse";
      elem.style.opacity = "1";
    }
  }
}

function trial(componentSom) {
  componentSomMap = terminalMap[componentSom];
  for (var key in wireTerminalCheck[sequenceNum])
    if (key == componentSomMap) wireTerminalCheck[sequenceNum][key] = true;

  elem = document.getElementsByClassName(componentSomMap)[0];
  elem.style.animationName = "none";
  elem.style.stroke = "none";
  // console.log(checkPair())
  dum = checkPair(sequenceNum);
  // console.log(dum)
  if (dum) {
    wireName = "wire" + (sequenceNum + 1);
    document.getElementById(wireName).style.transition = "display 10s";
    document.getElementById(wireName).style.display = "block";
    ++sequenceNum;
    if (sequenceNum < wireTerminalCheck.length) {
      enablingSequence(sequenceNum);
      // console.log('here')
    } else {
      // console.log('here')
      replacement();
    }
  }
}

function checkPair(sequenceNum) {
  count = 0;
  for (var key in wireTerminalCheck[sequenceNum])
    if (wireTerminalCheck[sequenceNum][key] == true) count++;
  // console.log(count, 'count')
  if (count == 2) return true;
  return false;
}

function keyPut() {
  document.getElementById("key1").style.animation = "none";
  document.getElementById("key1").onclick = function () {};
  document.getElementById("keyBase1").onclick = function () {};
}

function replacement() {
  document.getElementById("black-board").classList.add("hidden");
  document.getElementById("table-board").classList.add("replacement");

  document.getElementById("power-btn").style.stroke = "yellow";
  document.getElementById("power-btn").style.strokeWidth = "0.25%";
  document.getElementById("power-btn").onclick = function () {
    checkbtnPressed(0);
  };

  document.getElementById("key1").style.display = "block";
  document.getElementById("key1").classList.add("key-up-down");
  document.getElementById("key1").onclick = function () {
    checkbtnPressed(1);
    keyPut();
  };
  document.getElementById("keyBase1").onclick = function () {
    checkbtnPressed(1);
    keyPut();
  };
  localStorage.setItem("fullScreen", true);
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkbtnPressed(btnNum) {
  btnPressed[btnNum] = true;
  if (btnNum == 0) {
    document.getElementById("power").textContent = "03.00";
    document.getElementById("volt").textContent = "00.36";
    document.getElementById("power-btn").style.strokeWidth = "0%";
  }
  if (btnPressed[0] && btnPressed[1]) {
    
    sessionStorage.setItem("circuitComplete",true)

    // if(document.querySelector(".forward")){
    //   // startWorkingForward();
    // }
    // else{
    //   // startWorkingReverse();
    // }
  }
}

// function keyOp(){
//     document.getElementById('key1').style.display = "none"
//     document.getElementById('key2').style.animation = "none"
//     document.getElementById('key2').onclick = function(){}
//     document.getElementById('keyBase2').onclick = function(){}
// }

function startWorkingForward() {
  let volttext = document.getElementById("volt");
  let currtext = document.getElementById("curr");
  var srno = 0;
  let i = 0;

  let volt = 0.0;
  let curr = 0.0;
  let intervalId = setInterval(() => {
    
    if (volt < 0.4) {
      volt += 0.1;
      curr = curarr[i++] + getRndInteger(0,0.1);
    } else {
      volt += 0.05;
      curr = curarr[i++] + getRndInteger(0.5, 1.5);
    }
    volttext.textContent = volt.toFixed(2);
    currtext.textContent = curr;
    filldata(srno, volt, curr);
    srno++;
    console.log("fill data callede");

    currtext.textContent = curr.toFixed(2);
    // Stop the interval after reaching a certain temprature
    if (volt >= 0.70) {
      clearInterval(intervalId);
    }
  }, 1000);
}



function startWorkingReverse() {
  let volttext = document.getElementById("volt");
  let currtext = document.getElementById("curr");
  var srno = 0;
  let i = 0;

  let volt = 0.0;
  let curr = 0.0;
  let intervalId = setInterval(() => {
    curr = curarr[i++] - getRndInteger(0.5, 1.5);
    if (volt < 0.4) {
      volt += 0.1;
    } else {
      volt += 0.2;
    }
    volttext.textContent = volt.toFixed(2);
    currtext.textContent = curr;
    filldata(srno, volt, curr);
    srno++;
    console.log("fill data callede");

    currtext.textContent = curr.toFixed(2);
    // Stop the interval after reaching a certain temprature
    if (volt >= 2.5) {
      clearInterval(intervalId);
    }
  }, 1000);


  // alert("reverse ka data hai dont worry bhai")
}


function filldata(srno, volt, curr) {
  rowData = { srno: 0, volt: 0, curr: 0 };
  localStorage.setItem("rowData", JSON.stringify(rowData));
  rowData.srno = srno;
  rowData.volt = volt;
  rowData.curr = curr;
  console.log(srno);
  localStorage.setItem("rowData", JSON.stringify(rowData));
}


//ye wala code range ke sath ke lia hai

setTimeout(() => {
  rangeSelector();
}, 100);
const voltarr =[0.1,0.2,0.3,0.4,0.5,0.55,0.60,0.65,0.70,0.75]
const curarrforward = [
  0,0,0,0,0.4,0.7,2.3,5.5,15.8,18,18.9
];
const currreverse = [1,1,1,0,0.4,0.7,2.3,15.5,15.8,25,35.9]

function rangeSelector(){
  newIndexinterval = setInterval(() => {
    let newIndex = localStorage.getItem("newIndex");// Retrieve newIndex
    newIndex = Math.floor(newIndex / 10); // Map to range [1, 10]
    
    // Ensure newIndex stays within bounds of the array
    if (newIndex < 1 || newIndex > 10) {
      console.error("newIndex out of range");
      return; // Skip this iteration if out of bounds
    }
    

    let volttext = document.getElementById("volt");
    let currtext = document.getElementById("curr");

    volttext.textContent = voltarr[newIndex - 1]; // Adjust for 0-based index
    let curr=0;
    if(localStorage.getItem("type")==="false"){
      curr =Math.abs(curarrforward[newIndex-1] - getRndInteger(0.01,0.03)) 
      currtext.textContent = curr.toFixed(2)
    }else{
      curr =Math.abs(currreverse[newIndex-1] - getRndInteger(0.01,0.03)) 
      currtext.textContent = curr.toFixed(2) 
    }
    let currcopy  = curr.toFixed(2)
    

    localStorage.setItem("current", currcopy)
    localStorage.setItem("voltage", voltarr[newIndex - 1])
},500)
}