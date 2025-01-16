
//Creación del canvas

const canvas = document.getElementById('juegoCanvas');
canvas.width = 800;
canvas.height= 640;
const margen = (window.innerHeight-canvas.height)/2 + "px"; //Centro el canvas verticalmente.
canvas.style.marginTop = margen;
canvas.style.backgroundSize = canvas.height*2 + "px";
const ctx = canvas.getContext('2d');
let fondoy = 0; // usaré esta variable para desplazar el fondo del canvas verticalmente en una función posterior.

// Configuración inicial del juego

let proyectiles = [];
let enemigos = [];
let drops = [];
let gameover = false;

//Configuración de Objetos

let jugador = {
    width: 32, 
    height: 32,
    x: ((canvas.width-32)/2),
    y: (canvas.height-32),
	speed: 8,
	xlspeed: 0,
	xrspeed: 0,
	yuspeed: 0,
	ydspeed: 0,
    hp: 10,
	cadencia: 600,
	cadenciarecogida: 0,
    color: "blue" 
   };


//Funciones
//En algún momento, proyectil y enemigo serán subclases de una misma clase con funciones abstractas heredadas, pero hasta que me entere de cómo funcionan los objetos en JS, van a tener que ser dos elementos separados.

function crearProyectil(){

	let proyectil = {
		width: 8,
		height: 12,
		x: jugador.x + (jugador.width/2),
		y: jugador.y,
		speed: -10,
		color: "white",
		};

	proyectiles.push(proyectil);
	setTimeout(crearProyectil,jugador.cadencia);	
}

function moverProyectil(proyectiles){

	proyectiles.forEach((proyectil, index) =>{
		proyectil.y += proyectil.speed;
		dibujarObjeto(proyectil);
		if(proyectil.y<=0) proyectiles.splice(index, 1); //Elimina los proyectiles que se salen de la pantalla por arriba.
	});

	proyectiles.forEach((proyectil, pindex) => {
		enemigos.forEach((enemigo,eindex) => {
			if (detectarColision(proyectil, enemigo)) {
				dropEnemigo(enemigo);
				enemigos.splice(eindex, 1);
				proyectiles.splice(pindex,1);
			}	
		});
	});
}

function crearEnemigo(){

	let enemigo = {
		width: 20,
		height: 8,
		x: Math.floor(Math.random()*(canvas.width-20)),
		y: 0,
		speed: 4,
		color: "Red",
	};

	enemigos.push(enemigo);
	setTimeout(crearEnemigo,650);

}

function moverEnemigo(enemigos){
	
	enemigos.forEach((enemigo, index) =>{
		enemigo.y += enemigo.speed;
		dibujarObjeto(enemigo);
		if(enemigo.y>canvas.height)enemigos.splice(index,1);
	})
}

function dropEnemigo(enemigo){
	let rng = Math.floor(Math.random()*3)+1;
	if (rng > 1){
		let drop = {
			width: 30,
			height: 30,
			x: enemigo.x,
			y: enemigo.y,
			speed: 2,
			color: "green",
		};
		drops.push(drop);
	}
}

function moverDrops(drops){
	
	drops.forEach((drop, index) =>{
		drop.y += drop.speed;
		dibujarObjeto(drop);
		if(drop.y>canvas.height)drops.splice(index,1);
	})

	drops.forEach((drop, dindex) => {
		if (detectarColision(jugador, drop)) {
			jugador.cadencia = jugador.cadenciarecogida > 10 ? jugador.cadencia : jugador.cadencia - (60 - (jugador.cadenciarecogida*5));
			jugador.cadenciarecogida++;
			drops.splice(dindex,1);
		}
	})
}


function detectarColision(obj1, obj2) {
		return (
		  obj1.x < obj2.x + obj2.width &&
		  obj1.x + obj1.width > obj2.x &&
		  obj1.y < obj2.y + obj2.height &&
		  obj1.y + obj1.height > obj2.y
		);
}


function dibujarJugador(obj) { // Dibujar al jugador (es un método distinto al de dibujar al resto de objetos porque es el único objeto cuyos valores puede alterar el usuario para moverlo)
	obj.x += jugador.x > 0 ? obj.xlspeed : 0;
	obj.x += jugador.x < canvas.width-jugador.width ? obj.xrspeed : 0;
	obj.y += jugador.y > 0 ? obj.yuspeed : 0;
	obj.y += jugador.y < canvas.height-jugador.height ? obj.ydspeed : 0;
	ctx.fillStyle = obj.color;
	ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }

function dibujarObjeto(obj){ // Dibujar el resto de objetos
	ctx.fillStyle = obj.color;
	ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function moverFondo(){ // Para dar la sensación de recorrido, he duplicado una imagen haciendo que la parte de arriba y abajo sean iguales de manera que se pueda loopear
	fondoy = fondoy < 0 ? fondoy + 10 : -canvas.height*4
	canvas.style.backgroundPositionY = fondoy + "px";
	//Comentario para josemi: me he tirado un rato largo intentando cuadrar el loop porque cuando volvía a 0 no cuadraba bien. Resultas que estaba haciendo el if después de
	//darle valor al backgroundPosition del canvas y eso hacía que diera una vuelta de menos, haciendo que el backgroundPosition se quedara a 10px de dar la vuelta entera.
	//He tenido tres días esta función haciendo que el loop empiece en -10 en vez de en 0 hasta que me he dado cuenta de que soy bobo. 

}

// El main, el bucle de refresco de cada frame.

function main() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	dibujarJugador(jugador);
	moverProyectil(proyectiles);
	moverEnemigo(enemigos);
	moverDrops(drops);
	moverFondo();	

	// Dibujar puntuación
	ctx.fillStyle = 'white';
	ctx.font = '20px Arial';
	ctx.fillText(`HP: ${fondoy}`, 10, 50);
	ctx.fillText(`Time: ${jugador.cadencia}`, 10, 80);
	if (!gameover) requestAnimationFrame(main);
}

function menu(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillText
}

crearProyectil();
crearEnemigo();
main();




/*

function tiempo(){
	segundos++;
}

// Generar obstáculos


// Detectar colisiones
function detectarColision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function comprobarHP(){
	jugador.color="red";
	if(jugador.hp>3) jugador.color="yellow";
	if(jugador.hp>6) jugador.color="green";
	if(jugador.hp==10) jugador.color="blue";
}

function victoria(){
	if(obstaculos.length == 0){
		juegoTerminado = true;
	}
	setTimeout(victoria, 1000);
}
	
  // Dibujar y mover obstáculos
  obstaculos.forEach((obs, index) => {
	    //mover obs
		if((obs.x+50) >= canvas.width){
			obs.y+=50;
			obs.izq=true;
		}
		
		if(obs.x <= 0){
			obs.y+=50;
			obs.izq=false;
		}
		
		if(obs.izq){
			obs.x-=5;
		}else{
			obs.x +=5;
		}
		
		dibujarRect(obs);
		// Detectar colisión
		if (detectarColision(jugador, obs)) {
		  jugador.hp-=Math.floor((Math.random()*4)+1);
			if(jugador.hp<=0){
				juegoTerminado = true;
				alert(`¡Juego terminado! Puntuación: ${puntuacion}`);
			}
		  if((obs.y+obs.height) >= (canvas.height-jugador.height)){
			 obstaculos.splice(index, 1);
		  }
		}
	});

*/