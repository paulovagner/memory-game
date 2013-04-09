/*
 memoryGame.js
 Memory Game
 Created by paulo on 2013-03-16.
 */
if(!game){
	var game = (function () {
		//campo do jogo
		var matriz = [
				 [-1,-1,-1,-1,-1],
				 [-1,-1,-1,-1,-1],
				 [-1,-1,-1,-1,-1],
				 [-1,-1,-1,-1,-1],
				 ];
				 
		//linhas e colunas
		var COLUMNS = 5;
		var LINES = 4;		 
		
		//cartas diferentes
		var NUMBER_CARDS = 10;
		
		//constantes de time			 
		var TIME_HIDE_CARDS = 2000;
		var TIME_UPDATE = 1000;
		
		//mensagens do jogo
		var MESSAGE_FINISH_GAME = "Fim de jogo. Total de pontos: ";
		
		//cartas resolvidas
		var alreadySolved = [];
		
		var firstCard = -1;
		
		var totalPontos = 0;
		
		//estados do jogo
		var block = false;
					
		/**
		 * Funções privadas
		 */
		function _start() {
			drawGame.showCards();
			//escode as cartas depois de um tempo
			setTimeout(function() {
				drawGame.hideCards();
			},TIME_HIDE_CARDS);
		};
		
		function _restart(){
			location.reload();
			//zera pontuação para novo jogo
			document.getElementById("highscore").value = 0;	
		};
		
		function _play(x,y){
			if(!block){
				block = true;
				//exibi carta
				gameUtils.move(x,y);
				//primeira carta
				if(firstCard == -1){
					firstCard = matriz[x][y];
				} else if(firstCard > -1){
					//depois de um tempo da carta exibida faz as verificações
					setTimeout(function() {
						gameUtils.checkMove(x,y);
						gameUtils.loadHighscore();
						gameUtils.checkIsFinish();
					},TIME_UPDATE);
				}
				block = false;
			}
		};
		
		/**
		 * Funções para desenhar o jogo
		 */
		var drawGame = {
			//construi dinamicamente a interface do jogo com os valores sorteados
			showCards : function(){
				var i, j, x = 1,rand;
				var html = "";
				for (i = 0; i < LINES; i++) {
					html += "<tr>";
					for(j = 0;j < COLUMNS;j++){
						do{
							rand = Math.floor(Math.random() * NUMBER_CARDS);
							//caso ja tenha sorteia outro
						}while(gameUtils.checkAlreayMatriz(rand));
						matriz[i][j] = rand;
						html += "<td><div id='div"+ i + j  +"'><button name='btn"+ i + j  +"' onclick='game.play("+ i + "," + j + ")' disabled='disabled'><img src='Imagens/" + rand + ".png' border='0'></button></div></td>";
						x++;
					}
					html += "</tr>";
				}
				document.getElementById("container").innerHTML = html;
			},
		
			//escode todas as cartas 
			hideCards : function(){
				var i,j,x = 1;
				for (i = 0; i < LINES; i++) {
					for(j = 0;j < COLUMNS;j++){
						content = "<button name='btn"+ i + j +"' onclick='game.play("+ i + "," + j + ")' class='figure'> "+ x +"</button>";
						document.getElementById("div"+ i + j).innerHTML = content;	
						x++;	
					}
				}
			},
		};
		
		/**
		 * Funções para manipular o jogo
		 */
		var gameUtils = {
			//Verifica fim do jogo
		    checkIsFinish : function(){
				if(alreadySolved.length == 10){
					alert(MESSAGE_FINISH_GAME + totalPontos);
				}
			},
			//seta total de pontos
			loadHighscore : function(){
				document.getElementById("highscore").value = totalPontos;	
			},
		
			//faz jogada na posição x,y
			move : function(x,y){
				content = "<button name='btn"+ x + y +"' onclick='game.play(" + x + "," + y + ")' disabled='disabled'><img src='Imagens/" + matriz[x][y] + ".png' border='0'></button>";
				document.getElementById("div"+ x + y).innerHTML = content;
			},
			//verifica jogada
			checkMove : function(x,y){
				var value = matriz[x][y];
				//carta valida
				if(gameUtils.checkIsNotSolved(value)){
					//verifica se as cartas são iguais
					if(value == firstCard){
						totalPontos += 10;
						alreadySolved.push(value);
					} else {
						gameUtils.hideCardsIncorrect(value);
						totalPontos -= 10;
					}		
					firstCard = -1;	
				}
			},
			
			hideCardsIncorrect : function(value){
				var i,j,x = 1;
				for (i = 0; i < LINES; i++) {
					for(j = 0;j < COLUMNS;j++){
						if(matriz[i][j] == value || matriz[i][j] == firstCard){
							content = "<button name='btn"+ i + j +"' onclick='game.play("+ i + "," + j + ")' class='figure'> "+ x +"</button>";
							document.getElementById("div"+ i + j).innerHTML = content;	
						}
						x++;
					}
				}	
			},
			//verifica se não foi resolvida
			checkIsNotSolved : function(value){
				var i, count = 0;
				for(i = 0; i < alreadySolved.length; i++){
					if(alreadySolved[i] == value){
						count++;
					}
				}
				if(count == 0) return true;
				return false;
			},
			//verifica se a carta sorteada ja existe na matriz
			checkAlreayMatriz : function(value){
				var i,j,count = 0;
				for (i = 0; i < LINES; i++) {
					for(j = 0;j < COLUMNS;j++){	
						if(matriz[i][j] == value){
							count++;
						}
					}
				}
				if(count == 2) return true;
				return false;
			},	
		};
		/**
		 * Funções publicas
		 */
		return { 
			init : function(){
				_start();
			},
			
			play : function(x,y){
				_play(x,y);
			},
			
			restart : function(){
				_restart();
			}
		};
	}());
}