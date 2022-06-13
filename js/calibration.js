// "use strict";

var PointCalibrate = 0;
<<<<<<< HEAD
var CalibrationPoints = {};
var isCalibrated = false;
=======
var CalibrationPoints={};
var isCalibrated=false;
>>>>>>> 6540265d684b9ac41c17f743efcbc510e50838f8

/**
 * Clear the canvas and the calibration button.
 */
<<<<<<< HEAD
function ClearCanvas() {
=======
function ClearCanvas(){
>>>>>>> 6540265d684b9ac41c17f743efcbc510e50838f8
  $(".Calibration").hide();
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Show the instruction of using calibration at the start up screen.
 */
<<<<<<< HEAD
function PopUpInstruction() {
  ClearCanvas();
  swal({
    title: "Calibración",
    text: "Por favor, haga click en cada uno de los 13 puntos que apareceran en la pantalla. Debe hacer click 10 veces en cada punto (mirando donde hace click) hasta que se vuelva de color verde. Esto calibrara los movimientos de los ojos.",
    buttons: {
=======
function PopUpInstruction(){
  ClearCanvas();
  swal({
    title:"Calibración",
    text: "Por favor, haga click en cada uno de los 13 puntos que apareceran en la pantalla. Debe hacer click 10 veces en cada punto (mirando donde hace click) hasta que se vuelva de color verde. Esto calibrara los movimientos de los ojos.",
    buttons:{
>>>>>>> 6540265d684b9ac41c17f743efcbc510e50838f8
      cancel: false,
      confirm: true
    }
  }).then(isConfirm => {
    ShowCalibrationPoint();
  });

}
/**
  * Show the help instructions right at the start.
  */
function helpModalShow() {
<<<<<<< HEAD
  $('#helpModal').modal('show');
=======
    $('#helpModal').modal('show');
>>>>>>> 6540265d684b9ac41c17f743efcbc510e50838f8
}

/**
 * Load this function when the index page starts.
* This function listens for button clicks on the html page
* checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision
*/
<<<<<<< HEAD
$(document).ready(function () {
  ClearCanvas();
  helpModalShow();
  $(".Calibration").click(function () { // click event on the calibration buttons

    var id = $(this).attr('id');

    if (!CalibrationPoints[id]) { // initialises if not done
      CalibrationPoints[id] = 0;
    }
    CalibrationPoints[id]++; // increments values

    if (CalibrationPoints[id] == 10) { //only turn to yellow after 5 clicks
      $(this).css('background-color', 'yellow');
      $(this).prop('disabled', true); //disables the button
      PointCalibrate++;
    } else if (CalibrationPoints[id] < 10) {
      //Gradually increase the opacity of calibration points when click to give some indication to user.
      var opacity = 0.1 * CalibrationPoints[id] + 0.1;
      $(this).css('opacity', opacity);
    }

    //Show the middle calibration point after all other points have been clicked.
    if (PointCalibrate == 12) {
      $("#Pt5").show();
    }

    if (PointCalibrate >= 13) { // last point is calibrated
      //using jquery to grab every element in Calibration class and hide them except the middle point.
      $(".Calibration").hide();
      $("#Pt5").show();

      // clears the canvas
      var canvas = document.getElementById("plotting_canvas");
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

      // notification for the measurement process
      swal({
        title: "Calculando medida de calibración",
        text: "Por favor no mueva el mouse y mire fijamente al medio del punto por los siguientes 5 segundos. Esto peritira calcular la precision de las predicciones.",
        closeOnEsc: false,
        allowOutsideClick: false,
        closeModal: true
      }).then(isConfirm => {

        // makes the variables true for 5 seconds & plots the points
        $(document).ready(function () {

          store_points_variable(); // start storing the prediction points

          sleep(5000).then(() => {
            stop_storing_points_variable(); // stop storing the prediction points
            var past50 = get_points() // retrieve the stored points
            var precision_measurement = calculatePrecision(past50);
            var accuracyLabel = "<a>Precision | " + precision_measurement + "%</a>";
            document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
            swal({
              title: "Tu medida de precision es: " + precision_measurement + "%",
              allowOutsideClick: false,
              buttons: {
                cancel: "Recalibrar",
                confirm: true,
              }
            }).then(isConfirm => {
              if (isConfirm) {
                //clear the calibration & hide the last middle button
                setupStream();
                ClearCanvas();
                sleep(8000).then(() => {
                  isCalibrated = true;
                })


              } else {
                //use restart function to restart the calibration
                ClearCalibration();
                ClearCanvas();
                ShowCalibrationPoint();
              }
            });
          });
        });
      });
    }
  });
=======
$(document).ready(function(){
  ClearCanvas();
  helpModalShow();
     $(".Calibration").click(function(){ // click event on the calibration buttons

      var id = $(this).attr('id');

      if (!CalibrationPoints[id]){ // initialises if not done
        CalibrationPoints[id]=0;
      }
      CalibrationPoints[id]++; // increments values

      if (CalibrationPoints[id]==10){ //only turn to yellow after 5 clicks
        $(this).css('background-color','yellow');
        $(this).prop('disabled', true); //disables the button
        PointCalibrate++;
      }else if (CalibrationPoints[id]<10){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
        var opacity = 0.1*CalibrationPoints[id]+0.1;
        $(this).css('opacity',opacity);
      }

      //Show the middle calibration point after all other points have been clicked.
      if (PointCalibrate == 12){
        $("#Pt5").show();
      }

      if (PointCalibrate >= 13){ // last point is calibrated
            //using jquery to grab every element in Calibration class and hide them except the middle point.
            $(".Calibration").hide();
            $("#Pt5").show();

            // clears the canvas
            var canvas = document.getElementById("plotting_canvas");
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            // notification for the measurement process
            swal({
              title: "Calculando medida de calibración",
              text: "Por favor no mueva el mouse y mire fijamente al medio del punto por los siguientes 5 segundos. Esto peritira calcular la precision de las predicciones.",
              closeOnEsc: false,
              allowOutsideClick: false,
              closeModal: true
            }).then( isConfirm => {

                // makes the variables true for 5 seconds & plots the points
                $(document).ready(function(){

                  store_points_variable(); // start storing the prediction points

                  sleep(5000).then(() => {
                      stop_storing_points_variable(); // stop storing the prediction points
                      var past50 = get_points() // retrieve the stored points
                      var precision_measurement = calculatePrecision(past50);
                      var accuracyLabel = "<a>Precision | "+precision_measurement+"%</a>";
                      document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
                      swal({
                        title: "Tu medida de precision es: " + precision_measurement + "%",
                        allowOutsideClick: false,
                        buttons: {
                          cancel: "Recalibrar",
                          confirm: true,
                        }
                      }).then(isConfirm => {
                          if (isConfirm){
                            //clear the calibration & hide the last middle button
                            ClearCanvas();
                            isCalibrated=true;
                          } else {
                            //use restart function to restart the calibration
                            ClearCalibration();
                            ClearCanvas();
                            ShowCalibrationPoint();
                          }
                      });
                  });
                });
            });
          }
    });
>>>>>>> 6540265d684b9ac41c17f743efcbc510e50838f8
});

/**
 * Show the Calibration Points
 */
function ShowCalibrationPoint() {
  $(".Calibration").show();
  $("#Pt5").hide(); // initially hides the middle button
}

/**
* This function clears the calibration buttons memory
*/
<<<<<<< HEAD
function ClearCalibration() {
  window.localStorage.clear();
  $(".Calibration").css('background-color', 'red');
  $(".Calibration").css('opacity', 0.1);
  $(".Calibration").prop('disabled', false);
=======
function ClearCalibration(){
  window.localStorage.clear();
  $(".Calibration").css('background-color','red');
  $(".Calibration").css('opacity',0.1);
  $(".Calibration").prop('disabled',false);
>>>>>>> 6540265d684b9ac41c17f743efcbc510e50838f8

  CalibrationPoints = {};
  PointCalibrate = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
<<<<<<< HEAD
function sleep(time) {
=======
function sleep (time) {
>>>>>>> 6540265d684b9ac41c17f743efcbc510e50838f8
  return new Promise((resolve) => setTimeout(resolve, time));
}
