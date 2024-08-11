// var tableDat1 = document.getElementById("table1")
// var tableDat2 = document.getElementById("table2")

// yValuesdum = []
// voltTriggger = 0
// var xValues = [0,30,60,90,120,150,180,210,240,270,300,330,360];

// setTimeout(() => {
//    fillTable(tableDat1)  
//    fillTableDischarge(tableDat2)  
// }, 3000);

// function fillTable(tabledata){
//     filltableintrval = setInterval(() => {
//         if(localStorage.getItem("fullScreen") == 'true'){
//             snackbarFunction("Put the key and press on the Power Supply button and Stopwatch button to begin.")
//             localStorage.setItem("fullScreen", false)
//             setTimeout(() => {
//                 snackbarFunction("Readings are automatically recorded in the Table and Graph will be plotted.")
//             }, 13000);
//         }
//         if(localStorage.getItem("transitionDis") == 'true'){
//             snackbarFunction("Since the Supercapcitor is Fully Charged, put the Discharge key to discharge the Supercapacitor")
//             localStorage.setItem("transitionDis", false)
//         }
//         var rowData = JSON.parse(localStorage.getItem('rowData'))
//         if(rowData.volts && rowData.sno < 8){
//             if(voltTriggger < rowData.volts){
//                 voltTriggger = rowData.volts
//                 chartRenderData(voltTriggger)
//             }
//             srno = document.getElementsByClassName("srno")[rowData.sno]
//             time = document.getElementsByClassName("time")[rowData.sno]
//             voltage = document.getElementsByClassName("voltage")[rowData.sno]
//             srno.value = rowData.sno + 1
//             time.value = rowData.time
//             voltage.value = rowData.volts
//             // x = tabledata.rows[rowData.sno + 2].cells
//             // x[0].textContent = rowData.sno + 1
//             // x[1].textContent = rowData.time
//             // x[2].textContent = rowData.volts
//         }
//         if(rowData.sno == 12){
//             clearInterval(filltableintrval)
//         }
//     }, 500);
// }

// function chartRenderData(yValue){
//     yValuesdum.push(yValue)
//     chart.config.data.datasets[0].data = yValuesdum
//     chart.update()
// }

// var chart = new Chart("myChart", {
//     type: "line",
//     data: {
//         labels: xValues,
//         datasets: [{
//             fill: false,
//             lineTension: 0,
//             pointBackgroundColor: "#39FF14",
//             borderColor: "#000",
//             data: []
//         }]
//     },
//     options: {
//         // title:{
//         //     display: true,
//         //     text: 'Plot of Charging and Discharging Characteristic',
//         //     fontSize: 18,
//         //     // padding: 25,
//         //     fontColor: 'black',
//         //     // backgroundColor: '#007bff'
//         // },
//         legend: {display: false},
//         scales: {
//             yAxes: [ {
//                 ticks: {min:0, max:2, maxTicksLimit:5, fontColor:"black"},
//                 scaleLabel: {
//                     display: true,
//                     labelString:'Voltage (V)',
//                     fontSize: 14,
//                     fontColor: "#000"
//                 }
//             }],
//             xAxes: [ {
//                 ticks: {maxTicksLimit:5, fontColor:"black"},
//                 scaleLabel: {
//                     display: true,
//                     labelString:'Time (s)',
//                     fontSize: 14,
//                     fontColor: "#000",
//                 }
//             }],
//         },
//         animation:{
//             duration:1
//         }
//     }
// });

// snackbarFunction("Follow the Indicators and Click on the Terminals to make the connection.")

// function snackbarFunction(instruction) {
//     var x = document.getElementById("snackbar");
//     x.textContent = instruction
//     x.className = "show";
//     setTimeout(function(){ x.className = x.className.replace("show", ""); }, 7000);
// }

// var elem = document.getElementsByTagName('body')[0]
// function openFullscreen() {
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//   } else if (elem.webkitRequestFullscreen) { /* Safari */
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) { /* IE11 */
//     elem.msRequestFullscreen();
//   }
// }




currtrigger = 0;
// var xValues = [0, 2.95, 3.0, 3.05, 3.1, 3.15, 3.2, 3.25, 3.3];
var xValues = [0.0,0.2,0.4,0.6,0.8,1.0,1.2,1.4,1.6,1.8];
var logValues = [];
var count = 0;
let trigger =0;
let type;
setTimeout(() => {
  fillTable();
}, 3700);

function fillTable() {
  filltableintrval = setInterval(() => {
    if (localStorage.getItem("fullScreen") == "true") {
      snackbarFunction(
        "Put the key and press on the Power Supply button and Heater button to begin."
      );
      localStorage.setItem("fullScreen", false);
      setTimeout(() => {
        snackbarFunction(
          "Readings are automatically recorded in the Table and Graph will be plotted."
        );
      }, 13000);
    }

    if(localStorage.getItem("type")== "false"){
      idx=1;
    }
    else{
      idx=2;
    }
    var rowData = JSON.parse(localStorage.getItem("rowData"));
    if ( rowData.volt && rowData.srno < 15) {
      srno = document.getElementsByClassName(`srno${idx}`)[rowData.srno];
      current = document.getElementsByClassName(`curr${idx}`)[rowData.srno];
      voltage = document.getElementsByClassName(`voltage${idx}`)[rowData.srno];
      
      


      srno.value = rowData.srno + 1;
      current.value = rowData.curr.toFixed(2);
      voltage.value = rowData.volt.toFixed(2);


      if (rowData.curr > currtrigger) {
        currtrigger = rowData.curr;
        logValues.push(currtrigger.toFixed(3));
        console.log(logValues);
        // drawGraph()
        myChart.update();
        count++;
        console.log(`count hu mai ${count}`)
      }


      // logValues=[...set];
      // set.add(temp.toFixed(3));
      // if(set.size > trigger){
      //   trigger = set.size;
        
      //   console.log(logValues);
      //   myChart.update();
      //   count++;
      // }


      let f=0;
      if (count == 16) {
        if(f==0){
          f=1;
          snackbarFunction(
            "For Calculation Take the Value of Slope from graph "
          );
        }
        document.querySelector(".slope-div").style.display = "block";
        document.querySelector("#download").style.display = "block";
      }
    }
    if(rowData.srno==14 && idx == 1){
      setTimeout(()=>{
        let svgObject = document.getElementById("main-svg");
        svgObject.data = "./assets/reverse.svg";
        fillTable();
      },2000)
    }

    if (rowData.srno == 14) {
      
      clearInterval(filltableintrval);
    }
  }, 500);
}

let ctx = document.getElementById("myChart").getContext("2d");
let myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: xValues,
    datasets: [
      {
        label: "log(Is / T^2) vs 1/T",
        data: logValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      xAxes: [
        {
            scaleLabel: {
            display: true,
            labelString: "1/T (1/K)",
          },
        },
      ],
      yAxes: [
        {
            ticks: {
                beginAtZero: true, // Start y-axis from 0
                // min: 0, // Set minimum value for y-axis
                // max: 10,
              },
            scaleLabel: {
            display: true,
            labelString: "log(Is / T^2)",
            beginAtZero: true,
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    animation:{
        duration:1
    }
  },
});


// let ctx = document.getElementById("myChart").getContext("2d");
// let myChart = new Chart(ctx, {
//   type: "line",
//   data: {
//     labels: xValues,
//     datasets: [
//       {
//         label: "log(Is / T^2) vs 1/T",
//         data: logValues,
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         borderWidth: 2,
//         fill: false,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       xAxes: [
//         {
//           scaleLabel: {
//             display: true,
//             labelString: "1/T (1/K)",
//           },
//           position: 'top', // Position x-axis at the top
//         },
//       ],
//       yAxes: [
//         {
//           ticks: {
//             beginAtZero: true, // Start y-axis from 0
//             reverse: false, // Reverse the y-axis
//           },
//           scaleLabel: {
//             display: true,
//             labelString: "log(Is / T^2)",
//           },
//         },
//       ],
//     },
//     responsive: true,
//     maintainAspectRatio: false,
//     animation: {
//       duration: 1,
//     },
//   },
// });



snackbarFunction(
  "Follow the Indicators and Click on the Terminals to make the connection."
);

function snackbarFunction(instruction) {
  var x = document.getElementById("snackbar");
  x.textContent = instruction;
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 10000);
}

var elem = document.getElementsByTagName("body")[0];
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}


async function downloadGraphAndObservations() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set background color
    doc.setFillColor(0, 123, 255); // Blue color (RGB)
    doc.rect(10, 5, 190, 10, 'F');
    // Add a header with black text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // Set text color to black
    doc.setFontSize(20); // Set font size for the header
    doc.text("Observations Table", 75, 12); // Add text at x=10, y=10

    //Add the table head
    // const tableHead = await html2canvas(document.querySelector("#tablehead"), {
    //     scale: 2,
    // });
    // const tableheadData = tableHead.toDataURL("image/png");
    // doc.addImage(tableheadData, "PNG", 10,5 , 190, 20);
    // Add the observation table
    const tableCanvas = await html2canvas(document.querySelector("#table1"), {
        scale: 2,
    });
    const tableImgData = tableCanvas.toDataURL("image/png");
    doc.addImage(tableImgData, "PNG", 15, 17, 180, 120);

    // Add the graph
    const chartImage = myChart.toBase64Image();
    // doc.addPage();

    // //Add the graph head
    // Set background color
    doc.setFillColor(0, 123, 255); // Blue color (RGB)
    doc.rect(10, 140, 190, 10, 'F');
    // Add a header with black text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // Set text color to black
    doc.setFontSize(20); // Set font size for the header
    doc.text("Graph", 95, 147); // Add text at x=10, y=10

    doc.addImage(chartImage, "PNG", 25, 150, 150, 120);

    
    doc.addPage();
    //calculation page
    //Add the labels
    doc.setFillColor(0, 123, 255); // Blue color (RGB)
    doc.rect(10, 5, 190, 10, 'F');
    // Add a header with black text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // Set text color to black
    doc.setFontSize(20); // Set font size for the header
    doc.text("Calculation", 75, 12);
      document.querySelector(".calcbtn").style.display="none";
    const calc = await html2canvas(document.querySelector(".formula"), {
      scale: 2,
  });
  const calcimg = calc.toDataURL("image/png");
  doc.addImage(calcimg, "PNG", 15, 17, 180, 120);


    // Save the PDF
    doc.save("observations_and_graph.pdf");
    document.querySelector(".calcbtn").style.display="block";
}

// Add event listener to the download button
document.getElementById("download").addEventListener("click", downloadGraphAndObservations);


document.getElementById('inlineFormSelectPref').addEventListener('change', function() {
  var contentUrl = this.value;
  document.getElementById('main-svg').data = contentUrl;
});


