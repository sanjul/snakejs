(function(){
	
	var snake = new Snake();
	var timer =  new Timer();
	var joyStick = new JoyStick();
	var canvas = new Canvas();
	
	setInterval(function(){
		
		   snake.propogate(joyStick.getDirection());
		   canvas.render(snake);
		
	}, timer.getInterval())
	
})()