var nv = window.navigator;
$('html').click(function(){
var result = nv.vibrate([10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]);
if(result)
	$('body').css('backgroundColor','green').html(result);
else
	$('body').css('backgroundColor','red').html(result);
});

$('html').click();