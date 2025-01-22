
//En este documento va todo lo relacionado con lo que quiero que hagan las teclas.

//shout out a este chaval de youtube que explica como hacer el movimiento fluído en 2 dimensiones, porque a mi me quedaba a trompicones. https://www.youtube.com/watch?v=kX18GQurDQg
//al principio tenía metidos los ifs para no salirme del canvas aquí dentro porque se movía pulsación a pulsación; como ahora solo cambia una variable intermediaria, he tenido que poner las restricciones de movimiento en la función que pinta el objeto.


document.addEventListener('keydown', (e) => {

	switch (e.code){
		case "ArrowLeft":
			jugador.xlspeed = -jugador.speed;
			break;
		case "ArrowRight":
			jugador.xrspeed = jugador.speed;
			break;
		case "ArrowUp":
			jugador.yuspeed = -jugador.speed;
			break;
		case "ArrowDown":
			jugador.ydspeed = jugador.speed;
			break;								
	}

});

document.addEventListener('keyup', (e) => {

	switch (e.code){
		case "ArrowLeft":
			jugador.xlspeed = 0;
			break;
		case "ArrowRight":
			jugador.xrspeed = 0;
			break;
        case "ArrowUp":
            jugador.yuspeed = 0;
            break;
    	case "ArrowDown":
            jugador.ydspeed = 0;
            break;									
	}

});