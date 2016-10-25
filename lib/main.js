(function(){
	
	var canvas = new Canvas(50, 50);
	var snake = new Snake(canvas);
	var timer =  new Timer();
	var joyStick = new JoyStick(snake);
	
	
	snake.init();
	setInterval(function(){
			
		   snake.propogate(canvas);
		   canvas.render(snake);
		
	}, timer.getInterval())
	
})();