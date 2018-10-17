(function(){
	
	var canvas = new Canvas(50, 50);
	var snake = new Snake(canvas);
	var joyStick = new JoyStick();
	joyStick.addListener(snake.setDirection);
	
	
	snake.init();
 
	var step = function(){
		 snake.propogate(canvas);
		 setTimeout(function(){
			 window.requestAnimationFrame(step);
		 }, snake.getDelay());	 
	}
	
	window.requestAnimationFrame(step);

	
})();