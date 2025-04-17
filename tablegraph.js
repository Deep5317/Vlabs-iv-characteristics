
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
    if (sessionStorage.getItem("fullScreen") == "true") {
      snackbarFunction(
        "Put the key and press on the Power Supply button and Heater button to begin."
      );
      sessionStorage.setItem("fullScreen", false);
      setTimeout(() => {
        snackbarFunction(
          "Readings are automatically recorded in the Table and Graph will be plotted."
        );
      }, 13000);
    }

    if(sessionStorage.getItem("type") == "false"){
      idx = 1; // Forward bias
    }
    else {
      idx = 2; // Reverse bias
    }
    
    var rowData = JSON.parse(sessionStorage.getItem("rowData"));
    if (rowData.volt && rowData.srno < 15) {
      srno = document.getElementsByClassName(`srno${idx}`)[rowData.srno];
      current = document.getElementsByClassName(`curr${idx}`)[rowData.srno];
      voltage = document.getElementsByClassName(`voltage${idx}`)[rowData.srno];
      
      srno.value = rowData.srno + 1;
      current.value = rowData.curr.toFixed(2);
      voltage.value = rowData.volt.toFixed(2);
      
      // Add the data point to our arrays based on bias type
      if (idx === 1) { // Forward bias - first quadrant
        forwardVoltage.push(rowData.volt);
        forwardCurrent.push(rowData.curr);
      } else { // Reverse bias - third quadrant
        reverseVoltage.push(-Math.abs(rowData.volt)); // Make voltage negative
        reverseCurrent.push(-Math.abs(rowData.curr)); // Make current negative
      }
      
      // Update the chart with all available data points
      updateChart();
      
      if (rowData.curr > currtrigger) {
        currtrigger = rowData.curr;
        logValues.push(currtrigger.toFixed(3));
        myChart.update();
        count++;
      }

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
        // Reset chart with forward bias data already in place
        updateChart();
      }, 2000);
    }

    if (rowData.srno == 14) {
      clearInterval(filltableintrval);
    }
  }, 500);
}


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
//             scaleLabel: {
//             display: true,
//             labelString: "1/T (1/K)",
//           },
//         },
//       ],
//       yAxes: [
//         {
//             ticks: {
//                 beginAtZero: true, // Start y-axis from 0
//                 // min: 0, // Set minimum value for y-axis
//                 // max: 10,
//               },
//             scaleLabel: {
//             display: true,
//             labelString: "log(Is / T^2)",
//             beginAtZero: true,
//           },
//         },
//       ],
//     },
//     responsive: true,
//     maintainAspectRatio: false,
//     animation:{
//         duration:1
//     }
//   },
// });


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


let forwardVoltage = [];
let forwardCurrent = [];
let reverseVoltage = [];
let reverseCurrent = [];

// Create the chart when the page loads
// Create the chart when the page loads
let ctx = document.getElementById("myChart").getContext("2d");
let myChart = new Chart(ctx, {
  type: "scatter",
  data: {
    datasets: [
      {
        label: "Forward Bias",
        data: [], // Will be populated with forward bias points
        borderColor: "rgba(75, 192, 192, 1)", // Blue for forward bias
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderWidth: 2,
        pointRadius: 5,
        showLine: true,
        tension: 0.4
      },
      {
        label: "Reverse Bias",
        data: [], // Will be populated with reverse bias points
        borderColor: "rgba(255, 0, 0, 1)", // Red for reverse bias
        backgroundColor: "rgba(255, 0, 0, 0.8)",
        borderWidth: 2,
        pointRadius: 5,
        showLine: true,
        tension: 0.4
      }
    ]
  },
  options: {
    scales: {
      x: {
        type: 'linear',
        position: 'center',
        title: {
          display: true,
          text: 'Voltage (V)'
        },
        ticks: {
          stepSize: 0.5
        }
      },
      y: {
        type: 'linear',
        position: 'center',
        title: {
          display: true,
          text: 'Current (mA)'
        },
        ticks: {
          stepSize: 5
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Diode I-V Characteristics Curve',
        font: {
          size: 18
        }
      },
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Voltage: ${context.parsed.x.toFixed(2)}V, Current: ${context.parsed.y.toFixed(2)}mA`;
          }
        }
      }
    }
  }
});

// Function to update the chart with all available data
function updateChart() {
  // Combine both forward and reverse data points
  const allDataPoints = [];
  
  // Add reverse bias points (third quadrant)
  for (let i = 0; i < reverseVoltage.length; i++) {
    allDataPoints.push({
      x: reverseVoltage[i],
      y: reverseCurrent[i]
    });
  }
  
  // Add forward bias points (first quadrant)
  for (let i = 0; i < forwardVoltage.length; i++) {
    allDataPoints.push({
      x: forwardVoltage[i],
      y: forwardCurrent[i]
    });
  }
  
  // Sort data points by voltage for proper line connection
  allDataPoints.sort((a, b) => a.x - b.x);
  
  // Update chart data
  myChart.data.datasets[0].data = allDataPoints;
  myChart.update();
}


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

  // Set background color for header
  doc.setFillColor(0, 123, 255);
  doc.rect(10, 5, 190, 10, 'F');
  
  // Add header
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("Observations Table", 75, 12);

  // Add the observation tables
  const tableCanvas1 = await html2canvas(document.querySelector("#table1"), {
    scale: 2,
  });
  const tableImgData1 = tableCanvas1.toDataURL("image/png");
  doc.addImage(tableImgData1, "PNG", 15, 17, 180, 100);
  
  const tableCanvas2 = await html2canvas(document.querySelector("#table2"), {
    scale: 2,
  });
  const tableImgData2 = tableCanvas2.toDataURL("image/png");
  doc.addImage(tableImgData2, "PNG", 15, 120, 180, 100);

  // Add a new page for the graph
  doc.addPage();
  
  // Add graph header
  doc.setFillColor(0, 123, 255);
  doc.rect(10, 5, 190, 10, 'F');
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("I-V Characteristics Graph", 75, 12);

  // Add the graph image
  const chartImage = myChart.toBase64Image();
  doc.addImage(chartImage, "PNG", 25, 20, 160, 120);
  
  // Add some explanation of the graph
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("Forward Bias: First quadrant (positive voltage, positive current)", 20, 150);
  doc.text("Reverse Bias: Third quadrant (negative voltage, negative current)", 20, 160);
  doc.text("Note the typical diode behavior with exponential current increase in forward bias", 20, 170);
  doc.text("and minimal current flow in reverse bias until breakdown voltage.", 20, 180);

  // Save the PDF
  doc.save("diode_iv_characteristics.pdf");
}

// async function downloadGraphAndObservations() {
//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF();

//     // Set background color
//     doc.setFillColor(0, 123, 255); // Blue color (RGB)
//     doc.rect(10, 5, 190, 10, 'F');
//     // Add a header with black text
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(255, 255, 255); // Set text color to black
//     doc.setFontSize(20); // Set font size for the header
//     doc.text("Observations Table", 75, 12); // Add text at x=10, y=10

//     //Add the table head
//     // const tableHead = await html2canvas(document.querySelector("#tablehead"), {
//     //     scale: 2,
//     // });
//     // const tableheadData = tableHead.toDataURL("image/png");
//     // doc.addImage(tableheadData, "PNG", 10,5 , 190, 20);
//     // Add the observation table
//     const tableCanvas1 = await html2canvas(document.querySelector("#table1"), {
//         scale: 2,
//     });
//     const tableImgData1 = tableCanvas1.toDataURL("image/png");
//     doc.addImage(tableImgData1, "PNG", 15, 17, 180, 120);
//     const tableCanvas2 = await html2canvas(document.querySelector("#table2"), {
//       scale: 2,
//   });
//   const tableImgData2 = tableCanvas2.toDataURL("image/png");
//   doc.addImage(tableImgData2, "PNG", 15, 150, 180, 120);

//     // Add the graph
//     // const chartImage = myChart.toBase64Image();
//     // doc.addPage();

//   //   // //Add the graph head
//   //   // Set background color
//   //   doc.setFillColor(0, 123, 255); // Blue color (RGB)
//   //   doc.rect(10, 140, 190, 10, 'F');
//   //   // Add a header with black text
//   //   doc.setFont("helvetica", "bold");
//   //   doc.setTextColor(255, 255, 255); // Set text color to black
//   //   doc.setFontSize(20); // Set font size for the header
//   //   doc.text("Graph", 95, 147); // Add text at x=10, y=10

//   //   doc.addImage(chartImage, "PNG", 25, 150, 150, 120);

    
//   //   doc.addPage();
//   //   //calculation page
//   //   //Add the labels
//   //   doc.setFillColor(0, 123, 255); // Blue color (RGB)
//   //   doc.rect(10, 5, 190, 10, 'F');
//   //   // Add a header with black text
//   //   doc.setFont("helvetica", "bold");
//   //   doc.setTextColor(255, 255, 255); // Set text color to black
//   //   doc.setFontSize(20); // Set font size for the header
//   //   doc.text("Calculation", 75, 12);
//   //     document.querySelector(".calcbtn").style.display="none";
//   //   const calc = await html2canvas(document.querySelector(".formula"), {
//   //     scale: 2,
//   // });
//   // const calcimg = calc.toDataURL("image/png");
//   // doc.addImage(calcimg, "PNG", 15, 17, 180, 120);


//     // Save the PDF
//     doc.save("observations_and_graph.pdf");
//     // document.querySelector(".calcbtn").style.display="block";
// }

// Add event listener to the download button
document.getElementById("download").addEventListener("click", downloadGraphAndObservations);


// document.getElementById('inlineFormSelectPref').addEventListener('change', function() {
//   var contentUrl = this.value;
//   document.getElementById('main-svg').data = contentUrl;
// });

const range = document.getElementById('range');

  range.addEventListener('input', (event) => {

    if(sessionStorage.getItem("circuitComplete") == "true"){
      const newIndex = event.target.value;
      sessionStorage.setItem("newIndex",newIndex)
    }
    else{
      alert("Complete the circuit first")
    }
  });

  document.getElementById("addtable").addEventListener("click", addTable);
let rowCountIndex=0;
let idx;


function addTable(){
  if(sessionStorage.getItem("circuitComplete") === "true"){
    if(sessionStorage.getItem("type") == "false"){
      idx = 1;
    }
    else{
      idx = 2;
    }
    
    srno = document.getElementsByClassName(`srno${idx}`)[rowCountIndex];
    current = document.getElementsByClassName(`curr${idx}`)[rowCountIndex];
    voltage = document.getElementsByClassName(`voltage${idx}`)[rowCountIndex];
    
    let curr = parseFloat(sessionStorage.getItem("current"));
    let volt = parseFloat(sessionStorage.getItem("voltage"));

    srno.value = rowCountIndex + 1;
    current.value = curr;
    voltage.value = volt;
    
    // Add data point to the appropriate arrays
    if (idx === 1) { // Forward bias
      forwardVoltage.push(volt);
      forwardCurrent.push(curr);
    } else { // Reverse bias
      reverseVoltage.push(-Math.abs(volt)); // Make voltage negative
      reverseCurrent.push(-Math.abs(curr)); // Make current negative
    }
    
    // Update the chart
    updateChart();
    
    rowCountIndex++;
  }
  else{
    alert("Complete the circuit first");
  }
}


  // document.getElementById("inlineFormSelectPref").addEventListener("change", function () {
     
  //     var contentUrl = this.value;
  //     document.getElementById("main-svg").data = contentUrl;
  //     rowCountIndex =0
  //   // sessionStorage.setItem("diodetype", contentUrl);
  // });

  document.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default anchor behavior
      const selectedValue = this.getAttribute('data-value');
      const dropdownButton = document.getElementById('dropdownMenuButton');

      // Update the dropdown button's text to show the selected option
      dropdownButton.textContent = this.textContent;
      
      // Reset rowCountIndex when graph type changes
      rowCountIndex = 0;
      
      // Update the SVG displayed
      document.getElementById('main-svg').setAttribute('data', selectedValue);
      console.log('Selected bias type:', selectedValue);
    });
  });