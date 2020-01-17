var board = new Array();
var score = 0;
var hasConfilected = new Array();

// 手机触控信息
var startx=0;
var starty=0;
var endx=0;
var endy=0;


$(document).ready(function() {
	prapareMobile();
	newgame();
});

function prapareMobile() {
	if (documentWidth > 500) {
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}
	$("#grid-container").css({
		"width": gridContainerWidth - 2 * cellSpace + "px",
		"height": gridContainerWidth - 2 * cellSpace + "px",
		"padding": cellSpace + "px",
		"border-radius": 0.02 * gridContainerWidth + "px"
	})
	$(".grid-cell").css({
		"width": cellSideLength + "px",
		"height": cellSideLength + "px",
		"border-radius": 0.02 * gridContainerWidth + "px"
	})
}

function newgame() {
	// 游戏的初始化
	init();

}

function init() {
	// 用一个循环把每一个grid-cell绝对定位到相应的位置
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			var gridCell = $('#grid-cell-' + i + "-" + j);
			gridCell.css({
				"left": getPosLeft(i, j) + "px",
				"top": getPosTop(i, j) + "px"
			})
			// 		gridCell.css('left',getPosLeft(i,j)+"px");
			// 		gridCell.css('top',getPosTop(i,j)+"px");
		}

	// 使数组board变为二维数组
	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		hasConfilected[i] = new Array();
		for (var j = 0; j < 4; j++)
			board[i][j] = 0;
		hasConfilected[i][j] = false;
	}
	// 更新视图层
	updateBoradView();
	//随机在两个位置生成一个随机数
	generateOneNumber();
	generateOneNumber();
	score = 0;
}

function updateBoradView() {
	// 直接移除所有的number-cell
	$(".number-cell").remove();
	// 用一个循环把number-cell加入grid-container里
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
			var theNumberCell = $('#number-cell-' + i + '-' + j);
			if (board[i][j] == 0) {
				// 如果它的值为0，number-cell就不显现，并放在中间
				theNumberCell.css({
					"height": 0,
					"width": 0,
					"left": getPosLeft(i, j) + cellSideLength / 2 + "px",
					"top": getPosTop(i, j) + cellSideLength / 2 + "px"
				})
			} else {
				// 如果值不为0，就使其与grid-cell一样，并给他相应的背景颜色、字体色及其内容
				theNumberCell.css({
					"height": cellSideLength + "px",
					"width": cellSideLength + "px",
					"left": getPosLeft(i, j) + "px",
					"top": getPosTop(i, j) + "px",
					"background-color": getNumberBackgroundColor(board[i][j]),
					"color": getNumberColor(board[i][j])
				});
				theNumberCell.text(board[i][j]);
			}
			hasConfilected[i][j] = false;
		}
	$(".number-cell").css({
		"line-height": cellSideLength + "px",
		"border-radius": 0.02 * gridContainerWidth + "px",
		"font-size": 0.4 * cellSideLength + "px"
	});
}

function generateOneNumber() {
	if (nospace(board))
		return false;
	//随机生成一个位置 
	var randX = parseInt(Math.floor(Math.random() * 4));
	var randY = parseInt(Math.floor(Math.random() * 4));
	var times = 0;
	while (times < 50) {
		if (board[randX][randY] == 0)
			break;
		randX = parseInt(Math.floor(Math.random() * 4));
		randY = parseInt(Math.floor(Math.random() * 4));

	}
	if (times == 50) {
		for (var i = 0; i < 4; i++)
			for (var j = 0; j < 4; j++) {
				if (board[i][j] == 0) {
					randX = i;
					randY = j;
				}
			}
	}

	// 随机生成一个数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;

	// 把数字添加到位置里
	board[randX][randY] = randNumber;
	showNumberWithAnimation(randX, randY, randNumber);
	return true;
}

$(document).keydown(function(event) {
	// 记住要写break来跳出
	switch (event.keyCode) {
		case 37: //left
			if (moveLeft()) {
				setTimeout("generateOneNumber()", 310);
				setTimeout("isgameover()", 400);
			}
			break;
		case 38: //up
			if (moveUp()) {
				setTimeout("generateOneNumber()", 310);
				setTimeout("isgameover()", 400);
			}
			break;
		case 39: //right
			if (moveRight()) {
				setTimeout("generateOneNumber()", 310);
				setTimeout("isgameover()", 400);
			}
			break;
		case 40: //down
			if (moveDown()) {
				setTimeout("generateOneNumber()", 310);
				setTimeout("isgameover()", 400);
			}
			break;
		default:
			break;
	}
});

// 触控开始的坐标
document.addEventListener("touchstart",function(event){
	// 因为是单点触控,所以是数组里的第0个
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
});

// 触控结束的坐标
document.addEventListener("touchend",function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;
	
	var deltax=endx-startx;
	var deltay=endy-starty;
	
	// 如果移动范围较小,就不做任何动作
	if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth){
		return;
	}
	
	// 在横坐标移动
	if(Math.abs(deltax)>Math.abs(deltay)){
		// 向右移动
		if(deltax>0){
			if (moveRight()) {
				setTimeout("generateOneNumber()", 310);
				setTimeout("isgameover()", 400);
			}
		}else{
			// left
			if (moveLeft()) {
				setTimeout("generateOneNumber()", 310);
				setTimeout("isgameover()", 400);
			}
		}
	}else{
		// 在纵坐标移动
		if(deltay>0){
			if (moveDown()) {
				setTimeout("generateOneNumber()", 310);
				setTimeout("isgameover()", 400);
			}
		}else{
			if (moveUp()) {
				setTimeout("generateOneNumber()", 310);
				setTimeout("isgameover()", 400);
			}
		}
	}
})

function isgameover() {
	if (nospace(board) && nomove(board)) {
		gameover();
	}
}

function gameover() {
	alert("游戏结束！");
	prapareMobile();
	newgame();
	updateScore(score);
}

function moveLeft() {
	// 判断是否可以向左移动
	if (!canMoveLeft(board))
		return false;
	//循环判断是否可以向左移动或者落脚位置的数字和当前的数字是否相等以及移动路径是否有障碍物 
	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++) {
			if (board[i][j] != 0) {
				// 循环遍历当前位置的前面落脚位置
				for (var k = 0; k < j; k++) {
					// 落脚位置为空并且移动路径没有障碍物
					if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
						// 落脚位置的数字等于当前位置的数字并且移动路径没有障碍物
						// 在落脚的位置使其为false
					} else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConfilected[i][k]) {
						showMoveAnimation(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						updateScore(score);
						hasConfilected[i][k] = true;
						continue;
					}
				}
			}
		}
	setTimeout("updateBoradView()", 200);
	return true;
}

function moveUp() {
	// 判断是否可以向上移动
	if (!canMoveUp(board))
		return false;
	//循环判断是否可以向上移动或者落脚位置的数字和当前的数字是否相等以及移动路径是否有障碍物 
	for (var j = 0; j < 4; j++)
		for (var i = 1; i < 4; i++) {
			if (board[i][j] != 0) {
				// 循环遍历当前位置的前面落脚位置
				for (var k = 0; k < i; k++) {
					// 落脚位置为空并且移动路径没有障碍物
					if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
						// 落脚位置的数字等于当前位置的数字并且移动路径没有障碍物
					} else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConfilected[k][j]) {
						showMoveAnimation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						score += board[k][j];
						updateScore(score);
						hasConfilected[k][j] = true;
						continue;
					}
				}
			}
		}
	setTimeout("updateBoradView()", 200);
	return true;
}


function moveRight() {
	// 判断是否可以向右移动
	if (!canMoveRight(board))
		return false;
	//循环判断是否可以向右移动或者落脚位置的数字和当前的数字是否相等以及移动路径是否有障碍物 
	for (var i = 0; i < 4; i++)
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] != 0) {
				// 循环遍历当前位置的前面落脚位置
				for (var k = 3; k > j; k--) {
					// 落脚位置为空并且移动路径没有障碍物
					if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
						// 落脚位置的数字等于当前位置的数字并且移动路径没有障碍物
					} else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConfilected[i][k]) {
						showMoveAnimation(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						updateScore(score);
						hasConfilected[i][k] = true;
						continue;
					}
				}
			}
		}
	setTimeout("updateBoradView()", 200);
	return true;
}

function moveDown() {
	// 判断是否可以向上移动
	if (!canMoveDown(board))
		return false;
	//循环判断是否可以向上移动或者落脚位置的数字和当前的数字是否相等以及移动路径是否有障碍物 
	for (var j = 0; j < 4; j++)
		for (var i = 2; i >= 0; i--) {
			if (board[i][j] != 0) {
				// 循环遍历当前位置的前面落脚位置
				for (var k = 3; k > i; k--) {
					// 落脚位置为空并且移动路径没有障碍物
					if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
						// 落脚位置的数字等于当前位置的数字并且移动路径没有障碍物
					} else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConfilected[k][j]) {
						showMoveAnimation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						score += board[k][j];
						updateScore(score);
						hasConfilected[k][j] = true;
						continue;
					}
				}
			}
		}
	setTimeout("updateBoradView()", 200);
	return true;
}
