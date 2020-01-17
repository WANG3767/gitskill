function showNumberWithAnimation(i,j,randNumber){
	var theNumberCell = $('#number-cell-' + i + '-' + j);
	
	theNumberCell.css({
		"background-color":getNumberBackgroundColor(randNumber) ,
		"color":getNumberColor(randNumber)
	});
	theNumberCell.text(randNumber);
	
	theNumberCell.animate({
		"height":cellSideLength+"px",
		"width":cellSideLength+"px",
		"left":getPosLeft(i,j)+"px",
		"top":getPosTop(i,j)+"px"
	},50);
}

function showMoveAnimation(fromX,fromY,toX,toY){
	var numberCell=$('#number-cell-'+fromX+'-'+fromY);
	numberCell.animate({
		"left":getPosLeft(toX,toY),
		"top":getPosTop(toX,toY)
	},200);
}

function updateScore(score){
	$("#score").text(score);
}