// JavaScript Document
var infoMirada = [];
var soloTiempo = [];
window.onload = function () {
	webgazer.setRegression('ridge')
	.setTracker('clmtrackr')
	.setGazeListener(function(data, time){ 
		if (data != null && data["x"]>0 && data["y"]>0 && calibrado && data["x"] <= screen.width && data["y"] <= screen.height){
			var xPred = data["x"];
			var yPred = data["y"];
			var elapsedTime = time;
			
			infoMirada.push([elapsedTime, xPred, yPred]);
			soloTiempo.push([elapsedTime]);
			console.log(data["x"] + ", " + data["y"] + ", " + time);
     
		}
	})
	.begin()
    .showPredictionPoints(true);
	
	
	var config = function () {
		
		var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
    };

    function verificarListo() {
        if (webgazer.isReady()) {
            config();
        } 
		else {
            setTimeout(verificarListo, 100);
        }
    }
    setTimeout(verificarListo, 100);
	
};

function Guardar(expData) {
    var csv = '';
    expData.forEach(function (row) {
        csv += row.join(',');
        csv += "\n";
    });

    var elementoOculto = document.createElement('a');
    elementoOculto.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    elementoOculto.target = '_blank';
    elementoOculto.download = 'infoMirada.csv';
    elementoOculto.click();
}

window.onbeforeunload = function () {
    //webgazer.end(); //Comentar si se quiere guardar los datos aun si se recarga la pagina.
    window.localStorage.clear(); //Comentar si se quiere salvar los datos a traves de diferentes sesiones.
}

function Restart() {
	document.getElementById("Exactitud").innerHTML = "<a>Aun no esta calibrado</a>";
    LimpiarCalibracion();
    MostrarInstruccion();
}
/*********************************************/
// "use strict";

var puntoCalibracion = 0;
var CalibracionPuntos = {};
var calibrado = false;

function LimpiarCanvas(){
  $(".Calibracion").hide();
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function MostrarInstruccion(){
  LimpiarCanvas();
  swal({
    title:"Calibración",
    text: "Por favor, haga click en cada uno de los 9 puntos que apareceran en la pantalla. Debe hacer click 5 veces en cada punto (mirando donde hace click) hasta que se vuelva de color verde. Esto calibrara los movimientos de los ojos.",
    buttons:{
      cancel: false,
      confirm: true
    },
  }).then(function(isConfirm) {
    MostrarPuntoCalibracion();
  });

}

function helpModalShow() {
    $('#helpModal').modal('show');
}

$(document).ready(function(){
  LimpiarCanvas();
  helpModalShow();
     $(".Calibracion").click(function(){ 

      var id = $(this).attr('id');

      if (!CalibracionPuntos[id]){ 
        CalibracionPuntos[id] = 0;
      }
      CalibracionPuntos[id]++; 

      if (CalibracionPuntos[id] == 5){ 
        $(this).css('background-color','lawngreen');
        $(this).prop('disabled', true); 
        puntoCalibracion++;
      }
		 else if (CalibracionPuntos[id] < 5){
  
        var opacity = 0.2*CalibracionPuntos[id]+0.2;
        $(this).css('opacity',opacity);
      }

      if (puntoCalibracion == 8){
        $("#Pt5").show();
      }

      if (puntoCalibracion >= 9){ 
            $(".Calibracion").hide();
            $("#Pt5").show();

            var canvas = document.getElementById("plotting_canvas");
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            swal({
              title: "Calculando medida de calibración",
              text: "Por favor no mueva el mouse y mire fijamente al medio del punto por los siguientes 5 segundos. Esto peritira calcular la precision de las predicciones.",
              closeOnEsc: false,
              allowOutsideClick: false,
              closeModal: true
            }).then( isConfirm => {
                $(document).ready(function(){

                  guardarPuntosVariable(); 

                  sleep(5000).then(function() {
                      pararGuardarPuntosVariable(); 
                      var past50 = obtenerPuntos(); 
                      var precisionMedida = calcularPrecision(past50);
                      var exactitudLabel = "<a>Precision | " + precisionMedida+"%</a>";
                      document.getElementById("Exactitud").innerHTML = exactitudLabel; 
					  
                      swal({
                        title: "Tu medida de precision es: " + precisionMedida + "%",
                        allowOutsideClick: false,
                        buttons: {
                          cancel: "Recalibrar",
                          confirm: true,
                        }
                      }).then(isConfirm => {
                          if (isConfirm){

                            LimpiarCanvas();
                            calibrado = true;
                          } 
						  else {
                            
                            LimpiarCalibracion();
                            LimpiarCanvas();
                            MostrarPuntoCalibracion();
                          }
                      });
                  });
                });
            });
          }
    });
});


function MostrarPuntoCalibracion() {
  $(".Calibracion").show();
  $("#Pt5").hide(); 
}

function LimpiarCalibracion(){
  window.localStorage.clear();
  $(".Calibracion").css('background-color','red');
  $(".Calibracion").css('opacity',0.2);
  $(".Calibracion").prop('disabled',false);

  CalibracionPuntos = {};
  puntoCalibracion = 0;
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
//***************************************//

function calcularPrecision(past50Array) {
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();

  var x50 = past50Array[0];
  var y50 = past50Array[1];

  var staringPointX = windowWidth / 2;
  var staringPointY = windowHeight / 2;

  var precisionPorcentajes = new Array(50);
  calcularPrecisionPorcentajes(precisionPorcentajes, windowHeight, x50, y50, staringPointX, staringPointY);
  var precision = calcularPromedio(precisionPorcentajes);

  return Math.round(precision);
};


function calcularPrecisionPorcentajes(precisionPorcentajes, windowHeight, x50, y50, staringPointX, staringPointY) {
  for (x = 0; x < 50; x++) {
    
    var xDiff = staringPointX - x50[x];
    var yDiff = staringPointY - y50[x];
    var distancia = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

    var halfWindowHeight = windowHeight / 2;
    var precision1 = 0;
    if (distancia <= halfWindowHeight && distancia > -1) {
      precision1 = 100 - (distancia / halfWindowHeight * 100);
    } else if (distancia > halfWindowHeight) {
      precision1 = 0;
    } else if (distancia > -1) {
      precision1 = 100;
    }

    precisionPorcentajes[x] = precision1;
  }
}


function calcularPromedio(precisionPorcentajes) {
  var precision2 = 0;
  for (x = 0; x < 50; x++) {
    precision2 += precisionPorcentajes[x];
  }
  precision2 = precision2 / 50;
  return precision2;
}

/*******************************************/

function guardarPuntosVariable(){
  guardarPuntosVar = true;
}


function pararGuardarPuntosVariable(){
  guardarPuntosVar = false;
}

function obtenerPuntos() {
  var past50 = new Array(2);
  past50[0] = xPast50;
  past50[1] = yPast50;
  return past50;
}
//****************************************/
function resize() {
    var canvas = document.getElementById('plotting_canvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize, false);
