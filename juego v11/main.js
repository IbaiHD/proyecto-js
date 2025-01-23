//Creación del canvas

const canvas = document.getElementById('juegoCanvas');
canvas.width = 800;
canvas.height= 640;

let margen = (window.innerHeight-canvas.height)/2 + "px"; //Centro el canvas verticalmente.
canvas.style.marginTop = margen;
document.getElementById("menu").style.marginTop = margen;
document.getElementById("selector_dificultad").style.marginTop = margen;
document.getElementById("instrucciones").style.marginTop = margen;
document.getElementById("pantalla_victoria").style.marginTop = margen;
document.getElementById("pantalla_derrota").style.marginTop = margen;

margen = ((window.innerHeight-canvas.height)/2 + 33) + "px";
document.getElementById("boton_silencio").style.marginTop = margen;

margen = (window.innerWidth-canvas.width)/2 + "px";
canvas.style.marginLeft = margen;
document.getElementById("menu").style.marginLeft = margen;
document.getElementById("selector_dificultad").style.marginLeft = margen;
document.getElementById("instrucciones").style.marginLeft = margen;
document.getElementById("pantalla_victoria").style.marginLeft = margen;
document.getElementById("pantalla_derrota").style.marginLeft = margen;

margen = ((window.innerWidth-canvas.width)/2 + 740) + "px";
document.getElementById("boton_silencio").style.marginLeft = margen;

canvas.style.backgroundSize = canvas.height*2 + "px";
const ctx = canvas.getContext('2d');
let fondoy = 0; // usaré esta variable para desplazar el fondo del canvas verticalmente en una función posterior

// Configuración inicial del juego

let masillarate = 0.9;
let shootrate = 0.01;
let puntosparaboss = 10;
let disparolateral = false;
let framesproyectil = 90;
let bosshp = 15;
let dificultad = "facil";

function facil(){
	masillarate = 0.9;
	shootrate = 0.01;
	puntosparaboss = 10;
	disparolateral = false;
	framesproyectil = 90;
	bosshp = 15;
	dificultad = "facil";
	menu();
}

function normal(){
	masillarate = 0.8;
	shootrate = 0.015;
	puntosparaboss = 15;
	disparolateral = true;
	framesproyectil = 80;
	bosshp = 25;
	dificultad = "normal";
	menu();
}

function dificil(){
	masillarate = 0.75;
	shootrate = 0.02;
	puntosparaboss = 20;
	disparolateral = true;
	framesproyectil = 70;
	bosshp = 40;
	dificultad = "dificil";
	menu()
}


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

function pasarSegundos(){
	tiempojugado++;
	if(!gameover) setTimeout(pasarSegundos,1000);
}

document.getElementById("menu").style.display = "none";
document.getElementById("instrucciones").style.display = "none";
document.getElementById("selector_dificultad").style.display = "none";
document.getElementById("pantalla_victoria").style.display = "none";
document.getElementById("pantalla_derrota").style.display = "none";

let proyectiles = [];
let proyectilesenemigos = [];
let enemigos = [];
let drops = [];
let puntos = 0;
let victoria = false;
let gameover = false;

//Datos Inutiles

let navesdestruidas=0;
let masillasdestruidos=0;
let tanquesdestruidos=0;
let impactosrecibidos=0;
let tiempojugado=0;

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
	cadencia: 500,
	cadenciarecogida: 0,
    color: ["lightblue","orange","red"],
	colorescudo: "black",
	sprite: "media/images/jugador_sprite.png"
   };

function reducirHP(){
	impactosrecibidos++;
	player_hit_music.currentTime = 0;
	player_hit_music.play();
	jugador.colorescudo = "grey";
	setTimeout(function(){jugador.colorescudo = "black"},150);
	jugador.hp -= 2;
	jugador.hp = jugador.hp < 0 ? 0 : jugador.hp;

	if (jugador.hp <=0) gameover = true;

}

function aumentarHP(){
	jugador.hp = jugador.hp >= jugador.maxhp ? jugador.hp : jugador.hp + 2;
	jugador.hp = jugador.hp >= jugador.maxhp ? jugador.maxhp : jugador.hp;
}

//Funciones
//En algún momento, proyectil y enemigo serán subclases de una misma clase con funciones abstractas heredadas, pero hasta que me entere de cómo funcionan los objetos en JS, van a tener que ser dos elementos separados.


let widthrecogido=0;
let widthadicional=0;
let disparar;
function crearProyectil(){

	let proyectil = {
		width: 8 + widthadicional,
		height: 12,
		x: jugador.x + (jugador.width/2),
		y: jugador.y,
		xspeed: 0,
		yspeed: -17,
		color: "white",
		};

	proyectiles.push(proyectil);
	proyectil_jugador_music.currentTime=0;
	proyectil_jugador_music.play();
	disparar = setTimeout(crearProyectil,jugador.cadencia);	
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
				enemigo.hp -= 1;
				proyectiles.splice(pindex,1);
				if (enemigo.hp <= 0){
				dropEnemigo(enemigo);
				enemigos.splice(eindex, 1);
				navesdestruidas++;
				if(enemigo.id == "masilla") masillasdestruidos++;
				if(enemigo.id == "tanque") tanquesdestruidos++;
				}
				if(enemigo.hp <= 0 && enemigo.id == "boss"){
					victoria = true;
				}
			}	
		});
	});
}

function crearProyectilEnemigo(enemigo){

	let proyectilenemigo = {
		width: enemigo.widthproyectil,
		height: enemigo.heightproyectil,
		x: enemigo.x + (Math.floor(Math.random()*enemigo.width)) ,
		y: enemigo.y,
		yspeed: (jugador.y+(jugador.height/2)-enemigo.y)/enemigo.speedproyectil,
		xspeed: (jugador.x+(jugador.width/2)-enemigo.x)/enemigo.speedproyectil,
		color: "yellow",
	};

	//		yspeed: (jugador.y+(jugador.height/2)-enemigo.y)/enemigo.speedproyectil,
	//		xspeed: (jugador.x+(jugador.width/2)-enemigo.x)/enemigo.speedproyectil,
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

let otroenemigo;
let generarenemigo;
function crearEnemigo(){

	generarenemigo = Math.random();

	if (generarenemigo <= masillarate){
		let enemigo = {
			id: "masilla",
			width: 24, height: 10,
			x: Math.floor(Math.random()*(canvas.width-20)), y: 0,
			xspeed: 0, yspeed: 4,
			hp: 1,
			probdisparo: shootrate, widthproyectil:6, heightproyectil:6, speedproyectil: framesproyectil,
			color: "red",
			sprite:"media/images/masilla_sprite.png",
			moverderecha : true,
		};

		enemigos.push(enemigo);

	}else{
		let enemigo = {
			id: "tanque",
			width: 40, height: 20,
			x: Math.floor(Math.random()*(canvas.width-20)), y: 0,
			xspeed: 0, yspeed: 2,
			hp: 3,
			probdisparo: shootrate*0.5, widthproyectil:9, heightproyectil:9, speedproyectil: framesproyectil*1.5,
			color: "pink",
			sprite:"media/images/tanque_sprite.png",
			moverderecha : true,
		};

		enemigos.push(enemigo);
	}

	otroenemigo = setTimeout(crearEnemigo,650);

}

let bosscreado = false;
function crearBoss(){

	if(bosscreado){
		return;
	}

	boss_music.play();
	setTimeout(function(){lvl_music.volume *= 0.4}, 100);
	setTimeout(function(){lvl_music.volume *= 2.5}, 2000);
	bosscreado = true;

	let intervalo = setInterval(bossAlert(),10);
	setTimeout(clearInterval(intervalo),2000);

	clearTimeout(otroenemigo);

	setTimeout(function(){
		let enemigo = {
			id: "boss",
			width: 70,
			height: 18,
			x: canvas.width/2-40,
			y: 30,
			yspeed: 0,
			xspeed: 3 + (bosshp*0.05),
			hp: bosshp,
			probdisparo: shootrate*2.5, widthproyectil:8, heightproyectil:8, speedproyectil: framesproyectil*0.85,
			color: "red",
			moverderecha: true,
		};

		enemigos.push(enemigo);
	},2000);
}

function moverEnemigo(enemigos){
	
	enemigos.forEach((enemigo, eindex) =>{
		enemigo.y += enemigo.yspeed;
		if(enemigo.moverderecha){
			enemigo.x += enemigo.xspeed;
			if(enemigo.x+enemigo.width >=canvas.width) enemigo.moverderecha=false;
		}else{
			enemigo.x -= enemigo.xspeed;
			if(enemigo.x <= 0) enemigo.moverderecha=true;
		}
		dibujarObjeto(enemigo);
		if(enemigo.y>canvas.height)enemigos.splice(eindex,1);
	});

	enemigos.forEach((enemigo,eindex) =>{
		if(detectarColision(enemigo,jugador)){
			enemigos.splice(eindex,1);
			reducirHP();
		}
	});
}

function disparoEnemigo(enemigos){ // función para determinar si un enemigo dispara o no.

	enemigos.forEach((enemigo, index) => {
		let disparo = Math.random() <= enemigo.probdisparo ? true : false; //los enemigos tienen una variable probdisparo que va de 0 a 1 dependiendo de cuanto quiero que su disparo ocurra

		if (enemigo.id !== "tanque" && disparo && enemigo.y < (canvas.height/1.5)) crearProyectilEnemigo(enemigo); //todos los enemigos menos el tanque son capaces de hacer un disparo normal

		else if (enemigo.id === "tanque"  && disparo && enemigo.y < (canvas.height/2)){ //el tanque y solo el tanque dispara 3 veces
			crearProyectilEnemigo(enemigo);
			enemigo.speedproyectil +=10; //cada vez que dispara, el siguiente proyectil va más lento
			crearProyectilEnemigo(enemigo);
			enemigo.speedproyectil +=10;
			crearProyectilEnemigo(enemigo);
			enemigo.speedproyectil -=20; //reestablezco la velocidad para la siguiente tanda de disparos si llegara a ocurrir.
		}
		
		if (enemigo.id == "boss" && Math.random() <= enemigo.probdisparo*2) disparoColumna(enemigo); //el boss, además del disparo normal, tiene un disparo especial llamando a la función disparoColumna
	});

}

function disparoColumna(enemigo){
			let proyectilenemigo = {
				width: 5,
				height: 15,
				x: enemigo.x + (Math.floor(Math.random()*enemigo.width)) ,
				y: enemigo.y,
				yspeed: (canvas.height)/70,
				xspeed: 0,
				color: "orange",
			};
			proyectilesenemigos.push(proyectilenemigo);
}

function dropEnemigo(enemigo){
	let saledrop = Math.floor(Math.random()*3)+1;

	if (saledrop <= 2){
		let colordrop = ["green", "green", "green", "blue", "orange", "orange", "purple", "purple"];
		let drop = {
			id: "drop",
			width: 30,
			height: 30,
			x: enemigo.x,
			y: enemigo.y,
			speed: 2,
			color: colordrop[Math.floor(Math.random()*8)],
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

let img = new Image();
img.src = jugador.sprite;
function dibujarJugador(obj) { // Dibujar al jugador (es un método distinto al de dibujar al resto de objetos porque es el único objeto cuyos valores puede alterar el usuario para moverlo)
	obj.x += jugador.x > 0 ? obj.xlspeed : 0;
	obj.x += jugador.x < canvas.width-jugador.width ? obj.xrspeed : 0;
	obj.y += jugador.y > 0 ? obj.yuspeed : 0;
	obj.y += jugador.y < canvas.height-jugador.height ? obj.ydspeed : 0;

	ctx.beginPath();
	ctx.arc(jugador.x+17, jugador.y+17, jugador.width, 0, 2 * Math.PI, false);
	if (jugador.hp <= jugador.maxhp * 0.30) {
		ctx.fillStyle = obj.color[2];
	} else if (jugador.hp <= jugador.maxhp * 0.7) {
		ctx.fillStyle = obj.color[1];
	} else {
		ctx.fillStyle = obj.color[0];
	}
	ctx.globalAlpha = 0.5;
	ctx.fill();
	ctx.globalAlpha = 0.75;
	ctx.lineWidth = 3;
	ctx.strokeStyle = jugador.colorescudo;
	ctx.globalAlpha = 1;
	ctx.stroke();

	ctx.drawImage(img,jugador.x-6,jugador.y-6);
  }

let imgmasilla = new Image();
let imgtanque = new Image();
let imgboss = new Image();
let imgdropgreen = new Image();
let imgdroporange = new Image();
let imgdropblue = new Image();
let imgdroppurple = new Image();
imgmasilla.src = "media/images/masilla_sprite.png";
imgtanque.src = "media/images/tanque_sprite.png";
imgboss.src = "media/images/boss_sprite.png";
imgdropgreen.src = "media/images/drop_heal.png";
imgdroporange.src = "media/images/drop_bulletspeed.png";
imgdropblue.src = "media/images/drop_speedboost.png";
imgdroppurple.src = "media/images/drop_bulletwidth.png"
function dibujarObjeto(obj){ // Dibujar el resto de objetos

	switch (obj.id){
		case "masilla" :
			ctx.drawImage(imgmasilla,obj.x-10,obj.y-12);
			break;
		case "tanque" :
			ctx.drawImage(imgtanque,obj.x-15,obj.y-20);
			break;
		case "boss" :
			ctx.drawImage(imgboss,obj.x-28,obj.y-61);
			break;
		case "drop" :
			ctx.beginPath();
			ctx.arc(obj.x+15, obj.y+15, obj.height, 0, 2 * Math.PI, false);
			ctx.lineWidth = 3;
			ctx.strokeStyle = obj.color;
			ctx.globalAlpha = 0.5;
			ctx.stroke();
			ctx.globalAlpha = 1;

			switch (obj.color){
				case "purple":
					ctx.drawImage(imgdroppurple,obj.x-2,obj.y-2);
					break;
				case "green":
					ctx.drawImage(imgdropgreen,obj.x-2,obj.y-1);
					break;
				case "blue":
					ctx.drawImage(imgdropblue,obj.x+2,obj.y-2);
					break;
				case "orange":
					ctx.drawImage(imgdroporange,obj.x-3,obj.y-9);
					break
			}
			break;
		default:
			ctx.fillStyle = obj.color;
			ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
	}


}

function moverFondo(){ // Para dar la sensación de recorrido, he duplicado una imagen haciendo que la parte de arriba y abajo sean iguales de manera que se pueda loopear
	fondoy = fondoy < -10 ? fondoy + 10 : -canvas.height*4
	canvas.style.backgroundPositionY = fondoy + "px";
	//Comentario para josemi: me he tirado un rato largo intentando cuadrar el loop porque cuando volvía a 0 no cuadraba bien. Resultas que estaba haciendo el if después de
	//darle valor al backgroundPosition del canvas y eso hacía que diera una vuelta de menos, haciendo que el backgroundPosition se quedara a 10px de dar la vuelta entera.
	//He tenido tres días esta función haciendo que el loop empiece en -10 en vez de en 0 hasta que me he dado cuenta de que soy bobo. 

}

let bossframeanimation = 0;
function bossAlert(){
	bossframeanimation++;
	ctx.globalAlpha =  0.75 / ((bossframeanimation % 30)/2);
	ctx.font = '40px Arial';
	ctx.fillStyle = 'red';
	ctx.fillRect(200,40,350,90);
	ctx.fillStyle= 'white';
	ctx.fillText('BOSSALERT', 250, 100);
	ctx.globalAlpha = 1;
}

function ventanaDerrota(){
	document.getElementById("pantalla_derrota").style.display = "block";
	document.getElementById("estadisticas_derrota").innerHTML = "Naves destruidas: " + navesdestruidas + "<br><br> Masillas destruidos: "
	+ masillasdestruidos + "<br><br> Tanques destruidos: " + tanquesdestruidos + "<br><br> Impactos recibidos: " + impactosrecibidos
	+ "<br><br>Tiempo jugado: " + tiempojugado + " segundos.";
	document.getElementById("estadisticas_derrota").style.color = "white";
	derrota_music.play();
	stopAudio(lvl_music);
	stopAudio(proyectil_jugador_music);
	clearTimeout(disparar);
}

function ventanaVictoria(){
		gameover = true;
		document.getElementById("pantalla_victoria").style.display = "block";
		document.getElementById("estadisticas_victoria").innerHTML = "Naves destruidas: " + navesdestruidas + "<br><br> Masillas destruidos: "
		+ masillasdestruidos + "<br><br> Tanques destruidos: " + tanquesdestruidos + "<br><br> Impactos recibidos: " + impactosrecibidos
		+ "<br><br> Tiempo jugado: " + tiempojugado + " segundos.";
		document.getElementById("estadisticas_victoria").style.color = "white";
		victoria_music.play();
		stopAudio(lvl_music);
		stopAudio(proyectil_jugador_music);
		clearTimeout(disparar);
}

// El main, el bucle de refresco de cada frame.

function main() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	dibujarJugador(jugador);
	disparoEnemigo(enemigos);
	moverProyectil(proyectiles);
	moverProyectilEnemigo(proyectilesenemigos);
	moverEnemigo(enemigos);
	moverDrops(drops);
	moverFondo();	

	if (puntos >= puntosparaboss) crearBoss();

	// Dibujar puntuación
	ctx.fillStyle = 'white';
	ctx.font = '20px Arial';
	ctx.fillText(`HP: ${jugador.hp}`, 10, 40);
	ctx.fillText(`Dificultad: ${dificultad}`, 10, 70);
	ctx.fillText(`masillarate: ${masillarate}`, 10, 100);
	ctx.fillText(`Puntos: ${puntosparaboss}`, 10, 130);

	if (victoria) ventanaVictoria();
	if (gameover && !victoria) ventanaDerrota();
	if (!gameover) requestAnimationFrame(main);
	if (bosscreado && bossframeanimation < 120) requestAnimationFrame(bossAlert);
}

pasarSegundos();
lvl_music.play();
crearProyectil();
crearEnemigo();
main();

}


let volumentotal = 1;
let volumenactual;
let muted = false;
let lvl_music = audioCreate("media/sounds/level_music.mp3");
let boss_music = audioCreate("media/sounds/boss_warning.mp3");
let proyectil_jugador_music = audioCreate("media/sounds/disparo_jugador.mp3");
let player_hit_music = audioCreate("media/sounds/player_hit.mp3");
let victoria_music = audioCreate("media/sounds/victoria_music.mp3");
let derrota_music = audioCreate("media/sounds/derrota_music.mp3");
proyectil_jugador_music.volume = 0.15*volumentotal;	
player_hit_music.volume = 0.3*volumentotal;
victoria_music.volume = 0.4*volumentotal;

function audioCreate(archivo){
	audio = document.createElement("audio");
	audio.src = archivo;
	return audio;
}

function stopAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
}

function silenciar(){
	if(!muted){
	volumenactual = volumentotal;
	volumentotal = 0;
	document.getElementById("boton_silencio").style.backgroundImage = 'url("media/images/fondo_sonido_muted.png")';
	muted=true;
	}else{
		volumentotal = volumenactual;
		muted=false;
		document.getElementById("boton_silencio").style.backgroundImage = 'url("media/images/fondo_sonido.png")';
	}
	controlarVolumen();
}

function controlarVolumen(){
	lvl_music.volume = volumentotal;
	boss_music.volume = volumentotal;
	proyectil_jugador_music.volume = 0.15*volumentotal;	
	player_hit_music.volume = 0.3*volumentotal;
	victoria_music.volume = 0.4*volumentotal;
	derrota_music.volume = volumentotal;
}

function animationPlay(html, animacion){
	document.getElementById(html).style.animation = "none";
	setTimeout(function(){document.getElementById(html).style.animation = animacion;},100);
}

function menu(){
	document.getElementById("menu").style.display = "block";
	document.getElementById("instrucciones").style.display = "block";
	document.getElementById("selector_dificultad").style.display = "block";
	document.getElementById("pantalla_derrota").style.display = "block";
	document.getElementById("pantalla_victoria").style.display = "block";
	stopAudio(victoria_music);
	stopAudio(derrota_music);

}

function mostrarDificultad(){
	document.getElementById("menu").style.display = "none";
	document.getElementById("instrucciones").style.display = "none";
}

function mostrarInstrucciones(){
	document.getElementById("menu").style.display = "none";
}

document.addEventListener('keydown', (e) => {

	switch (e.code){ 
		case "KeyM":
			silenciar();
			break;						
	}

});

/*function cambiarFrame(div,archivo){
	if(document.getElementById(div).style.background == `url('media/images/${archivo}1.jpg')`) {
		document.getElementById(div).style.background = `url('media/images/${archivo}2.jpg')`;
		document.getElementById(div).style.backgroundSize = "800px 640px";
	}else {
		document.getElementById(div).style.background = `url('media/images/${archivo}1.jpg')`;
		document.getElementById(div).style.backgroundSize = "800px 640px";
	}
}*/


// 1. Pantalla de victoria/derrota
// 2. Pantalla de instrucciones
// 2.1. Pantalla de dificultad bien hecha
// 2.2. Selector de volumen
// 1.3. Selector personaje

// 4. Ponerlo chulo.
// 4.1. Cambiar los cuadraditos por alguna imagen o canvas chulo
// 4.2. Ponerle sonidito a las cosas