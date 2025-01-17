
//Creación del canvas

const canvas = document.getElementById('juegoCanvas');
canvas.width = 800;
canvas.height= 640;

let margen = (window.innerHeight-canvas.height)/2 + "px"; //Centro el canvas verticalmente.
canvas.style.marginTop = margen;
document.getElementById("menu").style.marginTop = margen;

margen = (window.innerWidth-canvas.width)/2 + "px";
canvas.style.marginLeft = margen;
document.getElementById("menu").style.marginLeft = margen;

canvas.style.backgroundSize = canvas.height*2 + "px";
const ctx = canvas.getContext('2d');
let fondoy = 0; // usaré esta variable para desplazar el fondo del canvas verticalmente en una función posterior.

// Configuración inicial del juego



function jugar(){

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

document.getElementById("menu").style.display = "none";

let proyectiles = [];
let proyectilesenemigos = [];
let enemigos = [];
let drops = [];
let puntos = 0;
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
	maxhp: 10,
	cadencia: 600,
	cadenciarecogida: 0,
    color: ["lightblue","orange","red"]
   };

function reducirHP(){
	let damage = Math.floor(Math.random()*3)+1;
	jugador.hp -= damage;
	if(jugador.hp <=0) gameover = true;
   }

function aumentarHP(){
	jugador.hp = jugador.hp >= jugador.maxhp ? jugador.hp : jugador.hp+2;
	jugador.hp = jugador.hp >= jugador.maxhp ? 10 : jugador.hp;
}

//Funciones
//En algún momento, proyectil y enemigo serán subclases de una misma clase con funciones abstractas heredadas, pero hasta que me entere de cómo funcionan los objetos en JS, van a tener que ser dos elementos separados.


let cantidadproyectil=0;
let widthrecogido=0;
let widthadicional=0;
function crearProyectil(){

	cantidadproyectil++;
	let proyectil = {
		id: cantidadproyectil,
		width: 8 + widthadicional,
		height: 12,
		x: jugador.x + (jugador.width/2),
		y: jugador.y,
		xspeed: 0,
		yspeed: -10,
		color: "white",
		};

	proyectiles.push(proyectil);
	setTimeout(crearProyectil,jugador.cadencia);	
}

function moverProyectil(proyectiles){

	proyectiles.forEach((proyectil, index) =>{
		proyectil.y += proyectil.yspeed;
		proyectil.x += proyectil.xspeed;
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

let cantidadproyectilenemigo = 0;
function crearProyectilEnemigo(enemigo){

	cantidadproyectilenemigo++;
	let proyectilenemigo = {
		id: cantidadproyectilenemigo,
		width: 6,
		height: 6,
		x: enemigo.x,
		y: enemigo.y,
		yspeed: (jugador.y-enemigo.y)/90,
		xspeed: (jugador.x-enemigo.x)/90,
		color: "yellow",
	};

	proyectilesenemigos.push(proyectilenemigo);
}

function moverProyectilEnemigo(proyectilesenemigos){

	proyectilesenemigos.forEach((proyectilenemigo, index) =>{
		proyectilenemigo.y += proyectilenemigo.yspeed;
		proyectilenemigo.x += proyectilenemigo.xspeed;
		dibujarObjeto(proyectilenemigo);
		if(proyectilenemigo.y>=canvas.height) proyectilesenemigos.splice(index, 1); //Elimina los proyectiles que se salen de la pantalla por arriba.
	});

	proyectilesenemigos.forEach((proyectilenemigo, peindex) => {
			if (detectarColision(proyectilenemigo, jugador)) {
				proyectilesenemigos.splice(peindex,1);
				reducirHP();
			}	
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
	
	enemigos.forEach((enemigo, eindex) =>{
		enemigo.y += enemigo.speed;
		dibujarObjeto(enemigo);
		if(enemigo.y>canvas.height)enemigos.splice(eindex,1);
	})

	enemigos.forEach((enemigo,eindex) =>{
		if(detectarColision(enemigo,jugador)){
			enemigos.splice(eindex,1);
			reducirHP();
		}
	});
}

function disparoEnemigo(enemigos){

	enemigos.forEach((enemigo, index) => {
		let disparo = Math.random() <=0.01 ? true : false;
		if (disparo && enemigo.y < (canvas.height/2)){
			crearProyectilEnemigo(enemigo);
		}
	})

}

function dropEnemigo(enemigo){
	let saledrop = Math.floor(Math.random()*3)+1;

	if (saledrop <= 2){
		let colordrop = ["green","blue","orange","pink"];
		let drop = {
			width: 30,
			height: 30,
			x: enemigo.x,
			y: enemigo.y,
			speed: 2,
			color: colordrop[Math.floor(Math.random()*4)],
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
			switch(drop.color){
				case ("green"):
					aumentarHP();
					break;
				case ("orange"):
					jugador.cadenciarecogida++;
					jugador.cadencia = jugador.cadenciarecogida > 10 ? jugador.cadencia : jugador.cadencia - (60 - (jugador.cadenciarecogida*5));
					break;
				case ("blue"):
					jugador.speed += 8;
					setTimeout(function(){jugador.speed = 8}, 4000);
					break;
				case ("pink"):
					widthrecogido++;
					widthadicional = widthrecogido > 10 ? widthadicional : widthadicional + (1 -((widthrecogido*5)/50));
					break;
			};		
			drops.splice(dindex,1);
			puntos++;
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
	ctx.fillStyle = "black";

	ctx.lineWidth = 5;
	ctx.strokeStyle = obj.color[0];
	ctx.beginPath();
	ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
	ctx.moveTo(obj.x,(obj.y+obj.height));
	ctx.lineTo(obj.x+(obj.width/2),obj.y);
	ctx.lineTo(obj.x+obj.width,obj.y+obj.height);
	ctx.stroke()

	ctx.lineWidth = 2;
	ctx.strokeStyle = obj.color[1];
	ctx.beginPath();
	ctx.moveTo(obj.x+5,(obj.y+obj.height));
	ctx.lineTo(obj.x+(obj.width/2),obj.y+10);
	ctx.lineTo(obj.x-5+obj.width,obj.y+obj.height);
	ctx.stroke();
  }

function dibujarObjeto(obj){ // Dibujar el resto de objetos
	ctx.fillStyle = obj.color;
	ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function moverFondo(){ // Para dar la sensación de recorrido, he duplicado una imagen haciendo que la parte de arriba y abajo sean iguales de manera que se pueda loopear
	fondoy = fondoy < -10 ? fondoy + 10 : -canvas.height*4
	canvas.style.backgroundPositionY = fondoy + "px";
	//Comentario para josemi: me he tirado un rato largo intentando cuadrar el loop porque cuando volvía a 0 no cuadraba bien. Resultas que estaba haciendo el if después de
	//darle valor al backgroundPosition del canvas y eso hacía que diera una vuelta de menos, haciendo que el backgroundPosition se quedara a 10px de dar la vuelta entera.
	//He tenido tres días esta función haciendo que el loop empiece en -10 en vez de en 0 hasta que me he dado cuenta de que soy bobo. 

}

// El main, el bucle de refresco de cada frame.

function main() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	dibujarJugador(jugador);
	disparoEnemigo(enemigos)
	moverProyectil(proyectiles);
	moverProyectilEnemigo(proyectilesenemigos);
	moverEnemigo(enemigos);
	moverDrops(drops);
	moverFondo();	

	// Dibujar puntuación
	ctx.fillStyle = 'white';
	ctx.font = '20px Arial';
	ctx.fillText(`HP: ${jugador.hp}`, 10, 40);
	ctx.fillText(`FondoY: ${fondoy}`, 10, 70);
	ctx.fillText(`Cadencia: ${jugador.cadencia}`, 10, 100);
	ctx.fillText(`Puntos: ${puntos}`, 10, 130);

	if(gameover){
		ctx.font = '40px Arial';
		ctx.fillStyle = 'black';
		ctx.fillRect(80,40,650,90);
		ctx.fillStyle= 'white';
		ctx.fillText(`JUEGO TERMINADO. Puntos: ${puntos}`, 100, 100);
		setTimeout(function () {document.getElementById("menu").style.display = "block";}, 3000);
	}

	if (!gameover) requestAnimationFrame(main);
}

crearProyectil();
crearEnemigo();
main();

}
	