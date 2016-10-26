(function(){
	
	var canvas = new Canvas(50, 50);
	var snake = new Snake(canvas);
	var joyStick = new JoyStick(snake);
	
	
	snake.init();
 
	var step = function(){
		 snake.propogate(canvas);
		 setTimeout(function(){
			 window.requestAnimationFrame(step);
		 }, 50);	 
	}
	
	window.requestAnimationFrame(step);

	
})();