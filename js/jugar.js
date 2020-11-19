/*
 * Script juego Quien quiere ser millonario?
 */

var index = 0;
var id;
var cont50=1, cont10=1;
var numInCorrectas=0;
var numCorrectas=0;
var Juego = {
	randomMode : true,
	defaultOptions: {
		
	},
}

$(function() {
	//Actualizamos el valor de numPreguntas
	$('#numPreguntas').text(preguntas.length);
	// Handler for .ready() called.
	$tablero = $('#tablero');
	$tablero.fadeOut();
	var $barra = $('#barra-progreso');
	$('#mostrarPregunta').submit(
		function (event) {
			var ancho = $barra.attr('aria-valuenow', 0);
			var numPreguntas = preguntas.length;
			var preguntasContestadas = parseInt($('#preguntaActual').text());
			// Se encarga de encontrar de forma aleatoria una pregunta no contestada
			var key;
			do {
				if(Juego.randomMode) {
					key = getRandomInt(0, numPreguntas -1);
				} else {
					key = index++;
				}
			} while(preguntas[key].contestada == true);
			console.log('Indice actual: ' + key);

			if (preguntas[key].contestada == false) {
					$('#pregunta-titulo').html(preguntas[key].pregunta);
					
					var $listaRespuestas = $('#pregunta-respuestas'); //Se obtiene la lista
					$listaRespuestas.find('li').remove(); // Se borran los elementos
					
					$.each(preguntas[key].respuestas, function(i, respuesta) { // Se colocan los elementos
						var li = "<li id='item-"+(i+1)+"' data-valida='"+respuesta.valida+"'>" //i+1
							+respuesta.txt+"</li>";
						$listaRespuestas.append(li);
					});
					preguntas[key].contestada = true;
			}

			++preguntasContestadas;
			$('#preguntaActual').text(preguntasContestadas);
			if (preguntasContestadas == numPreguntas) {
				$('#mostrarPregunta button')
					.removeClass('btn-primary')
					.addClass('disabled ')
					.attr('disabled', 'true');
					alert('GANASTE, FELICITACIONES');
			}
			$tablero.fadeIn();
			event.preventDefault();
			mostrarTablero();
			actualizarFicha(100); //100 = 10 segundos
		}
	);
	$('#pregunta-respuestas').on('click', 'li', function(event) {
		console.log(this);		
	});
	///
	$('div#tablero ol#pregunta-respuestas').on('click', 'li', function(event) {
		event.preventDefault();
		$(this).toggleClass('activo');
	});
	///
});
//////////////////////
$(function() { //
	// Handler for .ready() called.
	$('#btn-responder').click(function() { // Boton responder
			clearTimeout(id);
			validarRespuesta();
			ocultarTablero();
			actualizarBarra(0);
	});
	
	$('#btn-10').click(function() { // Boton 10 seg mas
			clearTimeout(id);
			actualizarBarra(0);
			actualizarFicha(100);
			if (cont10 >= 3)
				document.getElementById("btn-10").disabled = true;
			else
				cont10++;
	});
	
	$('#btn-50').click(function() { // Boton 50 - 50
		var indicador=0;
		$('#pregunta-respuestas li').each(function(i) {
			$li = $(this);
			if ($li.attr('data-valida') == "true") {
				indicador=i;
			}
		});
		indicador++;
		switch (indicador){
			case(1):
				document.getElementById("item-"+(3)+"").innerHTML = "---";
				document.getElementById("item-"+(4)+"").innerHTML = "---";
				break;
			case(2):
				document.getElementById("item-"+(1)+"").innerHTML = "---";
				document.getElementById("item-"+(3)+"").innerHTML = "---";
				break;
			case(3):
				document.getElementById("item-"+(2)+"").innerHTML = "---";
				document.getElementById("item-"+(4)+"").innerHTML = "---";
				break;
			case(4):
				document.getElementById("item-"+(1)+"").innerHTML = "---";
				document.getElementById("item-"+(3)+"").innerHTML = "---";
				break;
		}
		if (cont50 >= 3)
			document.getElementById("btn-50").disabled = true;
		else
			cont50++;
		
	});
});

function validarRespuesta() {
	error = false;
	$('#pregunta-respuestas li').each(function() {
		$li = $(this);
		if ($li.attr('data-valida') == "true") {
		if(!$li.hasClass('activo')) {
				error =  true;
			}
		} 
		});

		if(error) {
			alert('Te equivocaste')
			numInCorrectas++;
			$('#numRespuestasIncorrectas').text(numInCorrectas);
		} else {
			alert('Acertaste la pregunta')
			numCorrectas++;
			$('#numRespuestasCorrectas').text(numCorrectas);
			$('#numPuntaje').text("Puntaje: "+numCorrectas*1000);
			console.log(parseInt($('#numRespuestasCorrectas').text()));
		}
}

function actualizarFicha(maximo) { //Carga la barra hasta el maximo que ingrese
	id = setInterval(frame, maximo);
	var width = 1;
	function frame() {
		if(width>=100) { //Si supera el tiempo, valida la respuesta y oculta el tablero
			clearInterval(id);
			validarRespuesta();
			ocultarTablero();
			return;
		} else { //Si aun no supera el tiempo realiza la carga de la barra
			width++;
			actualizarBarra(width);
		}
	}
}

function ocultarTablero(){
	$('#tablero').fadeOut();
	$('#mostrarPregunta').fadeIn();
}

function mostrarTablero() {
	$('#tablero').fadeIn();
	$('#mostrarPregunta').fadeOut();
}

function actualizarBarra(progreso) { //Coloca el porcentaje de prograso en el ancho de la barra
	var $barra = $('#barra-progreso');
	$barra.attr('aria-valuenow', progreso);
	$barra.css('width', progreso + '%');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}