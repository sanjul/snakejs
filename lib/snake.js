var Sprite = function(coord){
		var _this = this;
		_this.coord = coord;
		
		_this.getCoords = function(){
			return _this.coord;
		};
		
		_this.setCoords = function(coord){
			_this.coord = coord;
		}
		
		_this.clone = function(){
			var newCoord = {"x" : _this.coord.x, "y" :_this.coord.y};
			return new Sprite(newCoord);
		}
};
	
	
var Snake = function(canvas){
	
	var _this = this;
	
	var DEFAULT_LENGTH = 4;
    
	var _bodySprites = [];
	var _foodSprite = null;
	var _length = DEFAULT_LENGTH;
		
	var _isInit = false;
	var _currentDirection;
	var _delta = 1;
	

	var getTranslationVector = function(dir){
		 var x = 0, y = 0;
		 if (dir == Direction.LEFT ){
				x = -1 * _delta;
		 } else if(dir == Direction.RIGHT){
			    x = 1 * _delta;
		 } else if(dir == Direction.DOWN){
			    y = 1 * _delta;
		 } else if (dir == Direction.UP){
			    y = -1 * _delta;
		 }
		 
		 return {"x" : x, "y" : y};
	}
	
	var applyDelta = function(coord, transfVector, inv){
			
			var invDelta = 1;
			if (inv){
				invDelta = -1;
			}
			
			coord.x += (transfVector.x * invDelta);
			coord.y += (transfVector.y * invDelta);
			
		    coord = canvas.wrapCoords(coord);
			
			return coord;
	}
	
	_this.getSprites = function(){
		var sprites = [];
		sprites = sprites.concat(_bodySprites);
		
		if (_foodSprite){
			sprites = sprites.concat(_foodSprite);	
		}
		
		return sprites;
	}
	
	_this.getClonedSprites = function(){
		var clonedSprites = [];
		for ( var i = 0 ; i < _length; i++){
			clonedSprites[i] = _bodySprites[i].clone();
		}
		
		return clonedSprites;
	}
	_this.setDirection = function(dir){
		// Change direction, avoiding a reverse move
		// Too lazy right now to write if-else for it :D
		if ( Math.abs(_currentDirection - dir) != 2){
			_currentDirection = dir;
		}
	}
	

	_this.generateNewFood = function(){
		var foodCoords =  canvas.getRandomCoords();
		var bodySpriteCoord = null;
		
		var isInBody = false;		
		for ( var i = 0; i< _length; i++){
			bodySpriteCoord = _bodySprites[i].getCoords();
			if (bodySpriteCoord.x == foodCoords.x && bodySpriteCoord.y == foodCoords.y){
				isInBody = true;
			}
		}
		
		if (isInBody){
			_this.generateNewFood();
		} else {
			_foodSprite = new Sprite(foodCoords);
		}
		
	}
	
	_this.hasFood = function(){
		var headCoords = _bodySprites[0].getCoords();
		var foodCoords = _foodSprite.getCoords();
		return headCoords.x == foodCoords.x && headCoords.y == foodCoords.y;
	}
	
	
	_this.init = function(){
			_currentDirection = Math.round( Math.random() * Direction.DOWN);
			var coords =  canvas.getRandomCoords();

			var newCoords = null;
		
			for ( i = 0; i < _length; i++){
				 _bodySprites[i] = new Sprite(coords); 
				 coords = applyDelta(coords, getTranslationVector(_currentDirection), true);
			}
			
			_this.generateNewFood();
			
			canvas.render(_this);
			
	}
	
	_this.propogate = function(){

			var clonedSprites = _this.getClonedSprites();
			
			//get the body blocks to go along the path of adjacent blocks
			 for (var  i = 1; i < _length; i++){
				  _bodySprites[i] = clonedSprites[i-1].clone();
			 }
			 
			 //move the head to the _currentDirection
			 _bodySprites[0].setCoords(applyDelta(_bodySprites[0].getCoords(), 
																getTranslationVector(_currentDirection)));
																
			if(_this.hasFood()){
				// grow
				_bodySprites[_length] = clonedSprites[_length - 1];
				_length = _length + 1;
				_this.generateNewFood();
			}
			 
			 canvas.render(_this);

	}
}

var Direction = {"LEFT": 0, "UP": 1, "RIGHT":2, "DOWN" :3};


var JoyStick = function(object){
	var _this = this;
	var _listeners = [];
	var _direction = null;
	var _dirKeyMap = {
									"37" : {"name": "LEFT", "val": 0},
									"38" : {"name": "UP", "val" : 1},
									"39" : {"name": "RIGHT", "val" : 2},
									"40" : {"name": "DOWN", "val" : 3}
								};
								
	document.addEventListener("keyup", function(e){
		
		e = e || event;
		var keyCode = e.keyCode;
		var dirObj = _dirKeyMap[keyCode];
		
		if ( dirObj){
			for ( var i = 0; i < _listeners.length; i++){
				_listeners[i](dirObj.val);
				//object.setDirection(dirObj.val);
			}
		}
		
	});
	
	_this.addListener = function(listener){
		 _listeners.push(listener);
	}
	
}


var Canvas = function(width, height){
	
	var _this = this;
	var _painter = new Painter(_this, width, height);
	var _width = width;
	var _height = height;
	
	_this.getRandomCoords = function(){
			var x = Math.round( Math.random() * _this.getWidth());
			var y = Math.round( Math.random() * _this.getHeight());
			return {"x" : x, "y" :y}
	}
	
	_this.getWidth = function(){
		return width;
	}
	
	_this.getHeight = function(){
		return height;
	}
	
	_this.wrapCoords = function(coord){
		var wCoords = {};
		
		wCoords.x = coord.x != 0 ? Math.abs(coord.x % _this.getWidth()) : _this.getWidth();
		wCoords.y = coord.y != 0 ? Math.abs(coord.y % _this.getHeight()) : _this.getHeight();

		return wCoords;
	}
	
	_this.render = function(object){
		document.getElementById('log').innerHTML = JSON.stringify(object.getSprites(), null, 2);
		var sprites = object.getSprites();
		_painter.clean();
		for ( var i = 0 ; i < sprites.length; i++){
			_painter.drawSprite(sprites[i]);
		}
		
	}
}


var Painter = function(canvas, blockWiseWidth, blockWiseHeight){
	
	var _canvas = document.getElementById("myCanvas");
	var _context = _canvas.getContext("2d");
 
	var  _this = this;
	
	_this.getWidth = function(){
		 return _canvas.width;
	}
	
	_this.getHeight = function(){
		return _canvas.height;
	}
	
	_this.clean = function(){
		_context.clearRect(0, 0, _canvas.width, _canvas.height);
	}
	
	var drawCircle = function(x, y, radius){
		_context.beginPath();
		_context.arc(x,y, radius ,0,2*Math.PI);
		_context.strokeStyle = '#81BEF7';
		_context.fillStyle = '#81BEF7';
		_context.stroke();
		_context.fill();
	}
	
	_this.drawSprite = function(sprite){
		 var coords = sprite.getCoords();
		 var blockWidth = Math.round(_this.getWidth() / blockWiseWidth);
		 var blockHeight = Math.round(_this.getHeight() / blockWiseHeight);
		 var radius = blockWidth / 2;
		 drawCircle ( blockWidth * coords.x , blockHeight * coords.y, radius);
	}
	 
}


