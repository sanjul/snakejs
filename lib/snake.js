var Snake = function(canvas){
	
	var _this = this;
	
	var DEFAULT_LENGTH = 30;
    
	var _bodyBlocks = [];
	var _length = DEFAULT_LENGTH;
		
	var _isInit = false;
	var _currentX;
	var _currentY;
	var _currentDirection;
	var _delta = 1;
	
	var Block = function(coord){
			var _this = this;
			_this.coord = coord;
			
			_this.getCoords = function(){
				return coord;
			};
			
			_this.translate = function(dir, canvas){
				_this.coord = applyDelta(_this.coord, getDeltaCoords(dir));
			}
			
			_this.clone = function(){
				var newCoord = {"x" : coord.x, "y" :coord.y};
				return new Block(newCoord);
			}
	};
	
	var getDeltaCoords = function(dir){
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
	
	var applyDelta = function(coord, deltaCoord, inv){
			
			var invDelta = 1;
			if (inv){
				invDelta = -1;
			}
			
			coord.x += deltaCoord.x * invDelta;
			coord.y += deltaCoord.y * invDelta;
			return coord;
	}
	
	_this.getBlocks = function(){
		return _bodyBlocks;
	}
	
	_this.getClonedBlocks = function(){
		var clonedBlocks = [];
		for ( var i = 0 ; i < _length; i++){
			clonedBlocks[i] = _bodyBlocks[i].clone();
		}
		
		return clonedBlocks;
	}
	_this.setDirection = function(dir){
		_currentDirection = dir;
	}
	
	
	_this.init = function(){
			_currentX = Math.round( Math.random() * canvas.getWidth());
			_currentY = Math.round( Math.random() * canvas.getWidth());
			_currentDirection = Math.round( Math.random() * Direction.DOWN);
			
			var coords =  {"x": _currentX, "y" : _currentY};
		
			for ( i = 0; i < _length; i ++){
				 _bodyBlocks[i] = new Block(coords);
				 coords = applyDelta(coords, getDeltaCoords(_currentDirection), true);
			}
			
	}
	
	_this.propogate = function(){

			var clonedBlocks = _this.getClonedBlocks();
			
			//get the body blocks to go along the path of adjacent blocks
			 for (var  i = 1; i < _length; i++){
				  _bodyBlocks[i] = clonedBlocks[i-1].clone();
			 }
			 
			 //move the head to the direction
			 _bodyBlocks[0].translate(_currentDirection, canvas);

	}
}

var Direction = {"LEFT": 0, "UP": 1, "RIGHT":2, "DOWN" :3};

var Timer = function(){
	 var _this = this;
	 _this.getInterval = function(){
		 return 500;
	 }
}


var JoyStick = function(object){
	var _this = this;
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
			object.setDirection(dirObj.val);
		}
		
	});
	
}


var Canvas = function(width, height){
	
	var _this = this;
	var _painter = new Painter(_this, width, height);
	var _width = width;
	var _height = height;
	
	_this.getWidth = function(){
		return width;
	}
	
	_this.getHeight = function(){
		return height;
	}
	
	_this.wrapCoords = function(coord){
		var wCoords = {};
		wCoords.x = Math.abs(coord.x % _this.getWidth());
		wCoords.y = Math.abs(coord.y % _this.getHeight());
		return wCoords;
	}
	
	_this.render = function(snake){
		// document.getElementById('log').innerHTML = JSON.stringify(snake.getBlocks(), null, 2);
		var blocks = snake.getBlocks();
		_painter.clean();
		for ( var i = 0 ; i < blocks.length; i++){
			_painter.drawBlock(blocks[i].getCoords());
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
		_context.stroke();
	}
	
	_this.drawBlock = function(coords){
		 var blockWidth = Math.round(_this.getWidth() / blockWiseWidth);
		 var blockHeight = Math.round(_this.getHeight() / blockWiseHeight);
		 var radius = blockWidth / 2;
		 
		 var wCoords = canvas.wrapCoords(coords);
	 
		 drawCircle ( blockWidth * wCoords.x , blockHeight * wCoords.y, radius);
	}
	 
}


