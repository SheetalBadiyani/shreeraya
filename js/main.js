var $ = jQuery.noConflict();
// Settings and Variables
var bgRunning = false;
var bgTimer;
var menuTimer;
var subMenuTimer;
var pageLoading=false;
var myAudio;
var btnSound;
var animateMenuPosition = false;
var muteAudioChangedBy = '';
var muteAudioChangedStatus = '';
var showBgCaption = false;
var audioSupport = false;
var bgImagesMove = false;
var bgImagesInProsses = false;
var useFullImage = false;
var useFitMode = false;
var ytplayer;
var ytPlayerReady = false;
var subThumbsActive = false;
var hasTouch = 'ontouchstart' in window;
var noDraw = ['#contentBoxScrollDragger', '#playerLoadBar', '#volumeLoadBar', '.mapContact', '#palette'];
var noDrawElement = ['input', 'textarea', 'a', 'button'];
var tempbgPaused;
var tempThumbs='';
var tempActive='';
var minWidth = 900;
var minHeight = 500;

var mobileDevice = false;
if( navigator.userAgent.match(/Android/i) ||
 navigator.userAgent.match(/webOS/i) ||
 navigator.userAgent.match(/iPhone/i) ||
 navigator.userAgent.match(/iPad/i) ||
 navigator.userAgent.match(/iPod/i)
 ){
	mobileDevice = true;
}

var drawC_enable = false;
var circleCTX;
$(document).ready(function(){
	showLoading();
});




// Init after Loaded
$(window).bind('load', init);
function init(){
	// Set deeplink
	$.history.init(openPage);
	// Dedect browser
	if(!document.createElement('audio').canPlayType)
	{
		$('#footeraudio .soundplaylist').hide();
		$('#footeraudio .soundicon').hide();
		$('#footeraudio .soundmute').hide();
		audioSupport = false;
	}
	$(window).bind('resize', function() {
		doSize();
	});
	$(window).bind('scroll', function() {
		doSize();
	});
	if(mobileDevice){
		$('#thumbOpener').show().click(function(){
			if(parseInt($('#bgImages').css('bottom'))<30){
				$('#thumbOpener').animate({bottom:130}, 300);
				galeriThumbsMoveUp();
				$('#bgImages').bind('touchstart', bgThumbsTouchStart);
			}else{
				$('#thumbOpener').animate({bottom:45}, 300);
				$('#bgImages').unbind('touchstart', bgThumbsTouchStart);
				galeriThumbsMoveDown();
			}
		});
	}
	
	if(!mobileDevice){
		$(document).bind('mousemove', galeriThumbsMouseMove);
		$(document).bind('mousemove', bgImageMove);
	}
	
	initMenu();
	doSize();
	
	$('#bodyLoading').animate({opacity:'0', top:-200}, 1000, 'easeOutBack', function(){
		$(this).remove();
		hideLoading();
	});
	$('#body-wrapper').delay(500).animate({opacity:'1'}, 1000);
	
	setPlaylist();
	galleryThumbs();	
    setScroll();

    
    if(drawActions && isCanvasSupported() && !mobileDevice){
    createCanvas();
    $(document).bind('mousedown',canvasDown);
    }    
    
    if(isCanvasSupported()){
    var circleCanvas = document.getElementById('circleC');
    circleCTX = circleCanvas.getContext('2d');
    timerC = setInterval(drawC, 40);
    }
    
}

function bgThumbsTouchStart(e){
	var firstX;
	var event = window.event;
	if(hasTouch && event.touches.length==1)
		firstX = event.touches[0].pageX;
	$('#bgImages').bind('touchmove', {firstX:firstX}, bgThumbsTouchMove);
	$('#bgImages').bind('touchend', bgThumbsTouchEnd);
}
function bgThumbsTouchMove(e){
	var pX;
	var event = window.event;
	if(hasTouch && event.touches.length==1)
		pX = event.touches[0].pageX;
	var dX = parseInt($('#bgImages').position().left+pX-e.data.firstX);
	if(dX<$('#body-wrapper').width()-$('#bgImages').width())
		dX = $('#body-wrapper').width()-$('#bgImages').width();
	if(dX>0)
		dX=0;
	$('#bgImages').css({left:dX+'px'});
}
function bgThumbsTouchEnd(e){
	$('#bgImages').unbind('touchmove', bgThumbsTouchMove);
	$('#bgImages').unbind('touchend', bgThumbsTouchEnd);
}

/*Loading Animation*/
function showLoading(){
	if($('#circleC').is(':hidden')){
		$('#circleC').show().css('opacity', '0');
		$('#circleC').stop(true).animate({opacity:'1'}, 300);
		drawC_enable = true;
		if(!mobileDevice)
			$(document).bind('mousemove', loadingDraw);
		else{
			$('#circleC').css({left:((winW-100)/2)+'px', top:((winH-100)/2)+'px'});
		}
	}
}
function hideLoading(){
	if(!$('#circleC').is(':hidden')){
		$('#circleC').stop(true).animate({opacity:'0'}, 300, function(){
			$('#circleC').hide(); 
		});
		drawC_enable = false;
		$(document).unbind('mousemove', loadingDraw);
	}
}
var ca=0;
function drawC(){
	if(drawC_enable)
	{
		circleCTX.clearRect (0,0,100,100);
		circleCTX.strokeStyle=$('#REF_ColorFirst').css('color');
		circleCTX.lineWidth = 6;
		circleCTX.beginPath();
		circleCTX.arc(50, 50, 27, (Math.PI*ca)-4, Math.PI*ca, true);
		circleCTX.stroke();
		ca+=0.15;
		ca = ca>2?0:ca;
	}
}
function loadingDraw(evt){
	$('#circleC').css({left:(evt.pageX-50)+'px', top:(evt.pageY-50)+'px'});
}

/*Play List Show Hide */
function playListShow(){
	if($('#playList').is(':hidden')){
		$('#playList, #playWrapper').css({opacity:'0'}).show();
		doSize();
		$('#playWrapper').animate({top:'-=200'},0);
		$('#playList').animate({opacity:'1'}, 400, 'easeOutBack', function(){
			$('#playWrapper').animate({top:'+=200', opacity:'1'},400, 'easeOutBack');
		});
	}
	$('#playList').bind('mousedown', playListClose);
	$('#playList').bind('mousemove', playListMove);
	$(document).unbind('mousemove', galeriThumbsMouseMove);
	galeriThumbsMoveDown();
}
function playListClose(evt){
	var activeElement = document.elementFromPoint(evt.pageX,evt.pageY);
	if($(activeElement).attr('id')=='playList'){
		$('#playList').css({'cursor' : 'auto'});
		$('#playWrapper').animate({top:'-=200', opacity:'0'}, 'easeOutBack', function(){
			$('#playList').animate({opacity:'0'}, 400, 'easeOutBack', function(){
				$('#playList').hide();
				$(document).bind('mousemove', galeriThumbsMouseMove);
			});
		});
		$('#playList').unbind('mousedown', playListClose);
		$('#playList').unbind('mousemove', playListMove);
	}
}
function playListMove(evt){
	var activeElement = document.elementFromPoint(evt.pageX,evt.pageY);
	if($(activeElement).attr('id')=='playList'){
		$('#playListCloseIcon').show();
		$('#playList').css({'cursor' : 'none'});
	}
	else{
		$('#playListCloseIcon').hide();
		$('#playList').css({'cursor' : 'auto'});
	}
	$('#playListCloseIcon').css({left:(evt.pageX+10)+'px', top:(evt.pageY+10)+'px'});
}

/* Screen Draw */
var lastCanvas, context;
function createCanvas(){
	$(document).unbind('mousemove',canvasMove);
	$(document).unbind('mouseup', canvasUp);
	
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	paint=false;
	canvas = document.createElement('canvas');
	$('body').append(canvas);
	lastCanvas = 'canvas'+randomString(5);
	$(canvas).attr({width:$('#bgPattern').width(), height:$('#bgPattern').height(), id:lastCanvas}).addClass('bgCanvas');
	if(typeof G_vmlCanvasManager != 'undefined') {
	canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");
	$(canvas).hide();
	
}

function canvasDown(e){
	var elm = document.elementFromPoint(e.pageX,e.pageY);
	var foundElm = false
	for(i=0; i<noDraw.length; i++){
		if($(elm).closest(noDraw[i]).length>0)
			foundElm = true;
	}
	for(j=0; j<noDrawElement.length; j++){
		if($(elm).get(0).tagName==noDrawElement[j].toUpperCase())
			foundElm = true;
	}
	if(foundElm)
		return true;
	paint = false;
	addClick(e.pageX, e.pageY);
	redraw();
	$(document).bind('selectstart dragstart', rFalse);
	$(document).bind('mouseup', canvasUp);
	$(document).bind('mousemove', {fX:e.pageX, fY:e.pageY}, canvasMove);
}

function canvasMove(e){
	if((Math.abs(e.pageX-e.data.fX)>10 || Math.abs(e.pageY-e.data.fY)>10) && document.getSelection().toString()=='' && !paint)
	{
		paint = true;
		if($('#'+lastCanvas).is(':hidden'))
			$('#'+lastCanvas).show();
		if(typeof document.body.style.MozUserSelect!="undefined") //Firefox route
			document.body.style.MozUserSelect="none";
	}
	
	if(paint){
		addClick(e.pageX , e.pageY, true);
		redraw();
	}
}

function canvasUp(e){
	$(document).unbind('selectstart dragstart', rFalse);
	$(document).unbind('mousemove',canvasMove);
	$(document).unbind('mouseup', canvasUp);
	
	paint = false;
	$('#'+lastCanvas).delay(500).animate({opacity:0}, 300, function(){
		$(this).remove();
	});
	
	var xD = clickX[0]-clickX[clickX.length-1];
	var yD = clickY[0]-clickY[clickY.length-1];
	var xA = parseInt((clickX[0]+clickX[clickX.length-1])/2);
	var yA = parseInt((clickY[0]+clickY[clickY.length-1])/2);
	var direction = 'none';

	if(Math.abs(xD)>40 || Math.abs(yD)>40)
	{
		var dd=true;
		if(Math.abs(xD)>Math.abs(yD) && Math.abs(yD)<30)
		{
			for(i=0; i<clickY.length; i++)
				if(clickY[i]<yA-15 || clickY[i]>yA+15)
					dd=false;
			if(dd)
				direction = (xD>0)?'left':'right';
		}
		if(Math.abs(yD)>Math.abs(xD) && Math.abs(xD)<30){
			for(i=0; i<clickX.length; i++)
				if(clickX[i]<xA-15 || clickX[i]>xA+15)
					dd=false;
			if(dd)
				direction = (yD>0)?'up':'down';
		}
		if(direction!='none'){
			
				if(direction=='right')
					nextBg();
				else if(direction=='left')
					prevBg();
				else if(direction=='up')
					pauseBg();
				else if(direction=='down')
					playBg();
			
		}
	}
	
	if(typeof document.body.style.MozUserSelect!="undefined") //Firefox route
		document.body.style.MozUserSelect="";

	createCanvas();
}

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}
function redraw(){
	canvas = document.getElementById(lastCanvas);
	canvas.width = canvas.width; // Clears the canvas
	context.strokeStyle = $('#REF_ColorFirst').css('color');
	context.lineJoin = "round";
	context.lineCap = "round";
	context.lineWidth = 2;
			
	for(var i=0; i < clickX.length; i++)
	{		
	context.beginPath();
	if(clickDrag[i] && i){
	  context.moveTo(clickX[i-1], clickY[i-1]);
	 }else{
	   context.moveTo(clickX[i]-1, clickY[i]);
	 }
	 context.lineTo(clickX[i], clickY[i]);
	 context.closePath();
	 context.stroke();
	}
}


/* Sub Thumb Gallery */
function galeriThumbsMouseMove(e)
{
	// Horizontal Move
	galeriThumbsHorizontalMove(e.pageX);
	// Vertical Move
	if(e.pageY > $('#bgImages').position().top-10 && parseInt($('#bgImages').css('bottom'))<32)
		galeriThumbsMoveUp();
	else if(e.pageY < $('#bgImages').position().top-10)
		galeriThumbsMoveDown();
}
function galeriThumbsHorizontalMove(param_pageX){
	if((parseInt($('#bgImages').css('bottom'))>-40 && $('#bgImages').width()>$('#body-wrapper').width())){
		var posTop = parseInt((($('#body-wrapper').width()-$('#bgImages').width())/$('#body-wrapper').width())*param_pageX);
		if(posTop>0)
			posTop=0;
		$('#bgImages').animate({left:posTop}, {queue:false, duration:400, easing:'easeOutQuad'});
	}
}

function galeriThumbsMoveDown(){
	$('#bgImages').animate({bottom:-50}, {queue:false, duration:300, easing:'easeOutQuad', complete:function(){ } } );
	$('#bgText').animate({bottom:64}, {queue:false, duration:300, easing:'easeOutQuad', complete:function(){ } } );
}

function bgImageMove(e){
	if(useFullImage && !useFitMode && activePlayer=='none')
	{
		if($('#body-wrapper').width()<$('#bgImageWrapper .new').width())
			var xPos = parseInt((($('#body-wrapper').width()-$('#bgImageWrapper .new').width())/$('#body-wrapper').width())*e.pageX);
		else
			var xPos = ($('#body-wrapper').width()-$('#bgImageWrapper .new').width())/2;
		if($('#body-wrapper').height()<$('#bgImageWrapper .new').height())
			var yPos = parseInt((($('#body-wrapper').height()-$('#bgImageWrapper .new').height())/$('#body-wrapper').height())*e.pageY);
		else
			var yPos = ($('#body-wrapper').height()-$('#bgImageWrapper .new').height())/2;
		$('#bgImageWrapper .new').animate({left:xPos, top:yPos}, {queue:false, duration:400, easing:'easeOutQuad'});
	}
}

function galleryThumbs(activeItem, mode){
    if(mobileDevice){
		$('#bgImages li').each(function(){
			var mediaType = getMediaType($(this).find('a').attr('href'));
			if(mediaType=='youtube' || mediaType=='vimeo' || mediaType=='jwplayer')
				$(this).remove();
		});
	}

   
	$('#bgImages li a').live('click', function () {
	    return false;
	});
   
	
	var totalBgImagesWidth = 0;
	$('#bgImages li img.thumb').each(function(){
		totalBgImagesWidth+=$(this).width()+6;
	});
	totalBgImagesWidth+=2;
	$('#bgImages').css('width', totalBgImagesWidth+'px');

	$('#bgImages li').hover(function () {
	    $(this).find('img.thumb').stop().animate({ opacity: '1' }, 500);
	    $(this).find('.thumbType').stop().animate({ opacity: '1' }, 500);
	}, function () {
	    if (!$(this).hasClass('active')) {
	        $(this).find('img.thumb').stop().animate({ opacity: '.3' }, 500);
	        $(this).find('.thumbType').stop().animate({ opacity: '0' }, 500);
	    }
	}).click(function () {
	    if (!$(this).hasClass('active') && !bgRunning) {
	        clearInterval(bgTimer);
	        $('#bgImages li').removeClass('active');
	        $(this).addClass('active');
	        runBg();
	    }
	});
	
	
	
	if(activeItem==undefined){
		if($('#bgImages li.active').length!=1){
			$('#bgImages li').removeClass('active');
			$('#bgImages li:first-child').addClass('active');
		}
	}else{
		$('#bgImages li').removeClass('active');
		$('#bgImages li a[href="'+activeItem+'"]').parent().addClass('active');
		if($('#bgImages li.active').length!=1){
			$('#bgImages li').removeClass('active');
			$('#bgImages li:first-child').addClass('active');
		}
	}

	setBgPlayStatus();
	if(mode==undefined)
		changeMode(false, false);
	else if(mode=='fit')
		changeMode(true, true);
	else if(mode == 'full')
		changeMode(true, false);
	runBg();
}

function changeMode(fullM, fitM){
	if(fitM==true)
		fullM=true
	
	if(fitM){
		$('#bgControl .fitte').hide();
		$('#bgControl .full').hide();
	}else{
		$('#bgControl .full').hide();
		$('#bgControl .fitte').hide();
	}
	
	if(useFullImage!=fullM || fitM!=useFitMode)
	{
		useFullImage = fullM;
		useFitMode = fitM;
		
		var addC='';
		if(fullM){
			if($('#contentBoxContainer').html()!='')
				addC = ', #content, #contentBoxScroll';
			$('#bgPattern, #bgText, #menu-container'+addC).animate({opacity:0}, 500);
			$('#fullControl').animate({opacity:1}, 500, function(){
				$('#bgPattern, #bgText, #content, #menu-container').hide();
				$('#bgControl .close').show();
				$('#bgControl .info').show();
				$('#bgControl .info').hover(function(){
					$('#bgText').show().css('opacity','0');
					$('#bgText, #bgText div').stop().animate({opacity:'1'}, 300);
				}, function(){
					$('#bgText, #bgText div').stop().animate({opacity:'0'}, 300, function(){
						$('#bgText').hide();
					});
				});
				doSize();
			});
		}else{
			if($('#contentBoxContainer').html()!='')
				addC = ', #content, #contentBoxScroll';
			else
				$('#bgText, #bgText div').stop().animate({opacity:'1'}, 300);
			
			$('#bgPattern, #bgText, #menu-container'+addC).show();
			$('#bgControl .close').hide();
			$("#dim").fadeIn(1000);
			$('#bgControl .info').hide();
			$('#bgControl .info').unbind('mouseover', 'mouseout', 'mouseenter', 'mouseleave');
			$('#bgPattern, #bgText, #menu-container'+addC).animate({opacity:1}, 500);
			$('#fullControl').animate({opacity:0}, 500, function(){
				if(tempThumbs!=''){
					$('#bgImages').html(tempThumbs);
					$('#bgImage').html(tempActive);
					bgPaused = tempbgPaused;
					tempThumbs = '';
					tempActive = '';
					galleryThumbs();
					activePlayer='none';
					if($('#bgImage').find('#ytVideo').length>0)
						activePlayer = 'youtube';
					else if($('#bgImage').find('#vmVideo').length>0)
						activePlayer = 'vimeo';
					else if($('#bgImage').find('#jwVideo').length>0)
						activePlayer = 'jwplayer';
				}
				doSize();
			});
		}
	}
	useFullImage = fullM;
	useFitMode = fitM;
}

function setFull(){
	changeMode(true, false);
}

function setMin(){
	changeMode(false, false);
}

function setFit(){
	changeMode(true, true);
}

// init menu
function initMenu(){
	showMenu();
	$('#mainmenu ul li ul').each(function(){
		var firstwidth = $(this).width()+20;
		var firstleft = $(this).parent().find('a').width()+6;
		$(this).attr('firstwidth', firstwidth);
		$(this).attr('firstleft', firstleft);
		$(this).css({position:'absolute', width:firstwidth, left:firstleft});
		var firstheight = $(this).height();
		$(this).attr('firstheight', firstheight);
		$(this).css({clip: 'rect(0px, 0px, '+firstheight+'px, 0px)'});
	});
}

function setBgPlayStatus(){
	if(!bgPaused){
		bgTimer = setInterval(nextBg, bgTime);
		$('#bgControl .play').hide();
		$('#bgControl .pause').show();
	}
	else{
		$('#bgControl .play').show();
		$('#bgControl .pause').hide();
	}
}

// Resize All Elements
var winW = $(window).width();
var winH = $(window).height();
var contentWidth = 640;
function doSize(){ 
	winW = $(window).width();
	winH = $(window).height();
	if(mobileDevice){
		if(winW<minWidth)
			winW = minWidth;
		if(winH<minHeight)
			winH = minHeight;
	}
	var winRatio = winW/winH;
	$('#body-wrapper').css({width:winW+'px', height:winH+'px'});
	if(activePlayer!='none'){
		var mediaUrl = $('#bgImages li.active a').attr('href');
		var mediaParams = getParamsFromUrl(mediaUrl);
		imgWO = parseInt(mediaParams['width']);
		imgHO = parseInt(mediaParams['height']);		
	}else{
		var imgWO = parseInt($('#bgImage img.new').attr('width'));
		var imgHO = parseInt($('#bgImage img.new').attr('height'));
	}
	var imgRatio = imgWO/imgHO;
	var imgLeft=0;
	var imgTop=0;
	
	if((winRatio>imgRatio))
	{
		var imgW = parseInt(winW);
		var imgH = parseInt(imgW/imgRatio);
		
	}else{
		var imgH = winH;
		var imgW = parseInt(imgH*imgRatio);
	}
	
	if((winRatio>imgRatio))
	{
		var imgHF = parseInt(winH);
		var imgWF = parseInt(imgHF*imgRatio);
		
	}else{
		var imgWF = parseInt(winW);
		var imgHF = parseInt(imgWF/imgRatio);
	}
	
	// Set Bg Image W, H
	var newImageW = 0;
	var newImageH = 0;
	if(!useFullImage){
		newImageW = imgW;
		newImageH = imgH;
		if(activePlayer == 'youtube'){
			ytplayer.setSize(imgW, imgH);
		}
		else if(activePlayer == 'vimeo')
			$('#vimeoplayer').css({width:imgW+'px', height:imgH+'px'});
		else if(activePlayer == 'jwplayer')
			jwplayer('jwP').resize(imgW, imgH);
	}else{
		if(!useFitMode){
			newImageW = imgWO;
			newImageH = imgHO;
		}else{
			newImageW = imgWF;
			newImageH = imgHF;
		}
		if(activePlayer == 'youtube'){
			ytplayer.setSize(winW, (winH-80));
		}
		else if(activePlayer == 'vimeo')
			$('#vimeoplayer').css({width:winW+'px', height:(winH-80)+'px'});
		else if(activePlayer == 'jwplayer')
			jwplayer('jwP').resize(winW, (winH-80));
	}
	if($('#bgImages').width()<$('#body-wrapper').width()){
		$('#bgImages').css('left', (($('#body-wrapper').width()-$('#bgImages').width())/2)+'px');
	}
	
	if(useFullImage && activePlayer!='none'){
		imgLeft = imgTop = 0;
	}else{
		imgLeft = parseInt((winW-newImageW)/2);
		imgTop = parseInt((winH-newImageH)/2);
	}
	
	// Set Bg Image Position
	if(!bgRunning)
		$('#bgImage .new').stop(true).animate({left:imgLeft, top:imgTop, width:newImageW, height:newImageH}, {queue:false, duration: 500});
	else
		$('#bgImage .new').stop(true).css({left:imgLeft+'px', top:imgTop+'px', width:newImageW+'px', height:newImageH+'px'});
	
	// Set Pattern W, H
	$('#bgPattern').css({width:winW+'px', height:winH+'px'});
	setContentHeight();
	$('#playList').css({width:winW+'px', height:winH+'px'});
	$('#playWrapper').css({left:((winW-$('#playWrapper').width())/2)+'px', top:((winH-$('#playWrapper').height())/2)+'px'});

	setScroll();
}

function setContentHeight(){
	if(!mobileDevice){
		$('#content').css({left:((winW-contentWidth)/2)+'px', height:(winH-$('#footer').height()-150)+'px'});
		//$('#content').css({left:((winW-contentWidth)-50)+'px', height:(winH-$('#footer').height()-150)+'px'});
		//$('#contentBoxScroll').css({height:($('#content').height()+40)+'px', left:(((winW-contentWidth)-50)+contentWidth)+'px'});
		$('#contentBoxScroll').css({height:($('#content').height()+40)+'px', left:(((winW-contentWidth)/2)+contentWidth)+'px'});
	}else{
		$('#content').css({left:'auto', right:'40px', top:'80px', height:(winH-$('#footer').height()-139)+'px'});
		$('#contentBoxScroll').css({height:($('#content').height()+40)+'px', left:'auto', right:'20px', top:'80px'});
	}
	if($('#contentBoxContainer').height()<$('#content').height())
	{
		$('#content').css({height:$('#contentBoxContainer').height()+'px'});
		$('#contentBoxScroll').css({height:($('#content').height()+40)+'px'});
	}
	$('#contentBox').css({height:($('#content').height())+'px'});
	$('#contentBoxScroll .dragcontainer').height($('#contentBoxScroll').height()-32);
}
function setScroll(){
	$("#contentBoxScroll .dragger").unbind('mousedown', 'mouseup');
	if(hasTouch)
		$("#contentBox").unbind('touchstart');
	$('#contentBoxScrollDragger').css('top', '0px');
	if($('#contentBoxContainer').height()>$('#contentBox').height())
	{	
		$('#contentBoxScroll .dragcontainer').show();
		$("#contentBoxScroll .dragger").bind('mousedown', setScrollMouseDown).mouseenter(function(){
			$(this).stop().animate({opacity:'.5'}, 300);
		}).mouseleave(function(){
			$(this).stop().animate({opacity:'1'}, 300);
		}); 
		
		if(hasTouch)
			$("#contentBox").bind('touchstart', setScrollMouseDown);
		
		$('#contentBox').mousewheel(function(event, delta) {
			scrollMove(delta);
			return false;
		});
		$('#contentBoxScrollDragger').parent().bind('mousedown', function(evt){
			$(this).find('.dragger').stop().animate({opacity:'.5'}, 300);
			var newpx = evt.pageY-$(this).offset().top-$(this).find('.dragger').height()/2;
			var sbah = $(this).height()-$(this).find('.dragger').height();
			if(newpx<0)
				newpx=0;
			if(newpx>sbah)
				newpx=sbah;
			$(this).find('.dragger').css('top', newpx+'px');
			scrollContentPosition($(this).find('.dragger'),'animate', newpx);
		});
	}else{
		$('#contentBox').unbind('mousewheel');
		$('#contentBoxScroll .dragcontainer').hide();
		scrollUnBinds();
	}
}

function rFalse(event){
	return false;
}

function setScrollMouseDown(s)
{
	if(typeof document.body.style.MozUserSelect!="undefined") //Firefox route
		document.body.style.MozUserSelect="none";
	var obj = $('#contentBoxScrollDragger');
	$(document).bind('selectstart dragstart', rFalse);
	if(!hasTouch)
		var startPositionY = $(obj).position().top;
	else
		var startPositionY = $(obj).offset().top;
	
	var event = window.event;
	if(hasTouch && event.touches.length==1){
		pointY = event.touches[0].pageY;
	}else{
		pointY = s.pageY;
	}
	
	var startMouseFirstY = pointY;
	$(obj).unbind('mousedown');
	$('#contentBox').unbind('touchstart', setScrollMouseDown); 
	$(document).bind('mouseup', setScrollMouseUp);
	$(document).bind('mousemove', {startPositionY:startPositionY, startMouseFirstY:startMouseFirstY}, setScrollMouseMove);
	
	if(hasTouch){
		$(document).unbind('touchmove', setScrollMouseMove);
		$(document).bind('touchmove', {startPositionY:startPositionY, startMouseFirstY:startMouseFirstY}, setScrollMouseMove);
		$(document).bind('touchend', setScrollMouseUp);
	}
}

function setScrollMouseMove(s){
	var obj = $('#contentBoxScrollDragger');
	$(this).find('.dragger').stop().animate({opacity:'.5'}, 300);
	
	var event = window.event;
	if(hasTouch && event.touches.length==1){
		s.preventDefault();
		pointY = event.touches[0].pageY;
	}else
		pointY = s.pageY
	
	if(!hasTouch)
		var drY = s.data.startPositionY + (pointY-s.data.startMouseFirstY);
	else
		var drY = $('#contentBoxScrollDragger').position().top - (pointY-s.data.startMouseFirstY);

	if(drY<0)
		drY=0;
	else if(drY>$(obj).parent().height()-$(obj).height())
		drY=$(obj).parent().height()-$(obj).height();
		
	$(obj).css({top:drY+'px'});
	scrollContentPosition(obj, 'direct', drY);
}

function scrollContentPosition(obj, aniType, dYPosition){ 
	if(dYPosition==null)
		var dY = $(obj).position().top;
	else
		var dY = dYPosition;
	var ch = $('#contentBoxContainer').height()-$('#contentBox').height();
	var sbah = $(obj).parent().height()-$(obj).height();
	var contentPos = (ch/sbah)*dY*-1;

	if(aniType=='animate')
		$('#contentBoxContainer').stop(true).animate({top:contentPos}, {queue:false, duration:300, easing:'easeOutQuad'} );
	else
		$('#contentBoxContainer').stop(true).css({top:contentPos+'px'});
}

function setScrollMouseUp(){
	scrollUnBinds();
	$('#contentBoxScrollDragger').bind('mousedown', setScrollMouseDown);
	if(hasTouch)
		$('#contentBox').bind('touchstart', setScrollMouseDown);
	$(this).find('.dragger').stop().animate({opacity:'1'}, 300);
}
function scrollUnBinds(){
	$(document).unbind('selectstart dragstart', rFalse);
	if(typeof document.body.style.MozUserSelect!="undefined") //Firefox route
		document.body.style.MozUserSelect="";
	$(document).unbind('mousemove', setScrollMouseMove);
	$(document).unbind('mouseup', setScrollMouseUp);
	if(hasTouch){
		$(document).unbind('touchemove', setScrollMouseMove);
		$(document).unbind('touchend', setScrollMouseUp);
	}
}

function scrollMove(dir){
	var movepx=0;
	var dragger = $('#contentBoxScrollDragger');
	
	var sbah = $(dragger).parent().height()-$(dragger).height();
	var ch = (($('#contentBoxContainer').height()-$('#contentBox').height())/sbah)*2;
	
	if(dir>0)
		movepx=(sbah/ch)*-1;
	else
		movepx=sbah/ch;
	var newpx = $(dragger).position().top + parseInt(movepx);
	if(newpx<=$(dragger).height()/2)
		newpx = 0;
	if(newpx>=(sbah-$(dragger).height()/2))
		newpx=sbah;
	if(newpx<0)
		newpx=0;
	if(newpx>sbah)
		newpx=sbah;
	newpx = parseInt(newpx);
	$(dragger).animate({top:newpx}, {queue:false, duration:300, easing:'easeOutQuad'} );
	scrollContentPosition(dragger, 'animate', newpx);
}

// Background Image Auto Next
function autoBg(){
	if(bgPaused) return false;
	nextBg();
}

// Background Image Next Button
function nextBg() {
	if(bgRunning) return false;
	clearInterval(bgTimer);
	if(!$('#bgImages li.active').is(':last-child')){
		$('#bgImages li.active').removeClass('active').next().addClass('active');
		runBg();
	}
	else if(loopBg){
		$('#bgImages li.active').removeClass('active').parent().find('li:first-child').addClass('active');
		runBg();
	}
}

// Background Image Prev Button
function prevBg(){
	if(bgRunning) return false;
	clearInterval(bgTimer);
	if(!$('#bgImages li.active').is(':first-child'))
		$('#bgImages li.active').removeClass('active').prev().addClass('active');
	else
		$('#bgImages li.active').removeClass('active').parent().find('li:last-child').addClass('active');
	runBg();
}

// Background Image Pause Button
function pauseBg(){
	if(activePlayer=='youtube')
		ytplayer.stopVideo();
	else if(activePlayer=='vimeo')
		$f(vmplayer).api('pause');
	else if(activePlayer=='jwplayer')
		jwplayer('jwP').pause();
	clearInterval(bgTimer);
	$('#bgControl .play').show();
	$('#bgControl .pause').hide();
	bgPaused = true;
	$('#bgImage img.new').stop();
}

// Background Image Play Button
function playBg(){
	clearInterval(bgTimer);
	$('#bgControl .play').hide();
	$('#bgControl .pause').show();
	bgPaused = false;
	if(activePlayer=='youtube')
		ytplayer.playVideo();
	else if(activePlayer=='vimeo')
		$f(vmplayer).api('play');
	else if(activePlayer=='jwplayer')
		jwplayer('jwP').play();
	else
		nextBg();
}


function videoMute(){
	if(activePlayer=='youtube')
		ytplayer.mute();
	else if(activePlayer=='vimeo')
		$f(vmplayer).api('setVolume',0);
	else if(activePlayer=='jwplayer')
		jwplayer('jwP').setMute(true);
	videoMuted=true;
	setVideoMuteIcon();
}

function videoUnMute(){
	if(activePlayer=='youtube')
		ytplayer.unMute();
	else if(activePlayer=='vimeo')
		$f(vmplayer).api('setVolume',1);
	else if(activePlayer=='jwplayer')
		jwplayer('jwP').setMute(false);
	videoMuted=false;
	setVideoMuteIcon();
}

function setVideoMuteIcon(){
	if(activePlayer=='youtube' || activePlayer=='vimeo' || activePlayer=='jwplayer'){
		if(videoMuted){
			$('#bgControlButtons .soundmute').show();
			$('#bgControlButtons .soundicon').hide();
		}else{
			$('#bgControlButtons .soundmute').hide();
			$('#bgControlButtons .soundicon').show();
		}
	}else{
		$('#bgControlButtons .soundmute').hide();
		$('#bgControlButtons .soundicon').hide();
	}
}


  

function getParamsFromUrl(mediaURL){
	var params = new Array();
	var urlSections = mediaURL.split('index.html');
	var lastSection = urlSections[urlSections.length-1];
	var qmPosition = lastSection.indexOf('?');
	if(mediaURL.indexOf('?')>-1)
		params['vurl'] = mediaURL.substring(0, mediaURL.indexOf('?'));
	else
		params['vurl'] = mediaURL;
		
	if(qmPosition>-1){
		params['v'] = lastSection.substring(0, qmPosition);
		var queryString = lastSection.substring(qmPosition+1);
		var qsSections = queryString.split('&');
		for(var i=0; i<qsSections.length; i++){
			var keyValue = qsSections[i].split('=');
			if(keyValue[0]!=undefined)
				params[keyValue[0]] = keyValue[1];
		}
	}else{
		params['v'] = lastSection;
	}
	return params;
}

function getMediaType(mediaUrl){
	if (mediaUrl.indexOf('youtu.be')>-1 || mediaUrl.indexOf('youtube.com/watch')>-1)
		return 'youtube';
	else if(mediaUrl.indexOf('vimeo.com')>-1)
		return 'vimeo';
	else{
		var extensions = mediaUrl.split('.');
		if(extensions.length>1)
		{
			var qmPosition = extensions[extensions.length-1].indexOf('?');
			if(qmPosition>0)
				var le = extensions[extensions.length-1].substring(0, qmPosition);
			else
				var le = extensions[extensions.length-1]
			le = le.toLowerCase();
			
			if(le=='flv' || le=='f4v' || le=='m4v' || le=='mp4' || le=='mov')
				return 'jwplayer';
			else
				return '';
		}else
			return '';
	}
}

function bgSoundMute(state){
	if(muteWhilePlayVideo && audioSupport){
		if(state)
			doMute();
		else if(muteAudioChangedBy==''){
			doUnMute();
		}else if(muteAudioChangedBy!=''){
			if(muteAudioChangedStatus=='mute')
				doMute();
			else if(muteAudioChangedStatus=='unmute')
				doUnMute();
		}
	}
}

// Background Image Animation
var activePlayer = 'none';
function runBg(){
	if($('#bgImages li').length<=0)	return false;
	
	activeNo = 0;
	$('#bgImages li').each(function(index, value){
		if($(this).hasClass('active'))
			activeNo = index+1;
	});
	$('#bgControlCount').text(activeNo+'/'+$('#bgImages li').length);
	$('#bgImageWrapper .source').removeClass('new').addClass('old');
	var mediaUrl = $('#bgImages li.active a').attr('href');
	if(getMediaType(mediaUrl)=='youtube' || getMediaType(mediaUrl)=='vimeo' || getMediaType(mediaUrl)=='jwplayer'){
		if(getMediaType(mediaUrl)=='youtube')
		{
			bgSoundMute(true);
			var mediaParams = getParamsFromUrl(mediaUrl);
			if(ytPlayerReady)
			{
				activePlayer = 'youtube';
				$('#bgImageWrapper').prepend($('<div id="ytVideo"><div id="ytVideoPlayer"></div></div>').addClass('new').addClass('source').css('opacity','0'));
				ytplayer = new YT.Player('ytVideoPlayer', {
				  height: mediaParams['height'],
				  width: mediaParams['width'],
				  videoId: mediaParams['v'],
				  playerVars: {
					controls: 1,
					showinfo: 0 ,
					modestbranding: 1,
					wmode: 'opaque'
				},
				  events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				  }
				});
			}
			
			
		}
		else if(getMediaType(mediaUrl)=='vimeo'){
			bgSoundMute(true);
			var mediaParams = getParamsFromUrl(mediaUrl);
			activePlayer = 'vimeo';
			$('#bgImageWrapper').prepend($('<div id="vmVideo"></div>').addClass('new').addClass('source').css('opacity','0'));
			$('#vmVideo').append($('<iframe width="'+mediaParams['width']+'" height="'+mediaParams['height']+'" src="http://player.vimeo.com/video/'+mediaParams['v']+'?api=1&amp;title=0&amp;byline=0&amp;portrait=0&autoplay=0&loop=0&controls=1&player_id=vimeoplayer" frame webkitAllowFullScreen allowFullScreen></iframe>').attr('id', 'vimeoplayer'));
			$('#vmVideo iframe').each(function(){
				$f(this).addEvent('ready', vimeoApiReady);
			});
		}else if(getMediaType(mediaUrl)=='jwplayer'){
			bgSoundMute(true);
			var mediaParams = getParamsFromUrl(mediaUrl);
			activePlayer = 'jwplayer';
			$('#bgImageWrapper').prepend($('<div id="jwVideo"><div id="jwP"></div></div>').addClass('new').addClass('source').css('opacity','0'));
			jwplayer('jwP').setup({
				flashplayer: 'jwplayer/player.swf',
				autostart: true,
				skin: 'jwplayer/glow/glow.xml',
				file: mediaParams['vurl'],
				height: mediaParams['height'],
				width: mediaParams['width'],
				events: {
					onComplete: function(event){
						if(bgPaused==false)
							nextBg();
						else if(videoLoop)
							jwplayer('jwP').play();
					}
				}
			 });
			 if(videoMuted)
				videoMute();
			else
				videoUnMute();
		}
		
		bgRunning = true;
		clearInterval(bgTimer);
		doSize();
		
		runBgAni();
	}else{
		bgSoundMute(false);
		activePlayer = 'none';
		bgRunning = true;
		showLoading();
		$('#bgImageWrapper').prepend($('<img src="'+$('#bgImages li.active a').attr('href')+'" />').addClass('new source').css('opacity','0'));
		$('#bgImageWrapper img.new').load(function () {
		    $(this).css('opacity', '0');
		    $(this).attr('width', $(this).width());
		    $(this).attr('height', $(this).height());
            $(this).attr('height', $(this).height());
		    doSize();
		    clearInterval(bgTimer);
		    hideLoading();
		    runBgAni();
		}).click(function () {
           window.location = $('#bgImages li.active a').attr('title'); 
        }).error(function () {
		    bgRunning = false;
		    hideLoading();
		    nextBg();
		}).dequeue();
        
        setVideoMuteIcon();
	}
	
	
}

function runBgAni(){
	clearInterval(bgTimer);
	$('#bgText').stop().animate({clip: 'rect(0px, '+$('#bgText').width()+'px, '+($('#bgText').height()+20)+'px, '+$('#bgText').width()+'px)'}, 800 , 'easeOutQuad', function(){
		$('#bgText .headerText').html($('#bgImages li.active h3').text());
		$('#bgText .subText').html($('#bgImages li.active p').text());
		$('#bgText').css('clip','rect(0px, 0px, '+($('#bgText').height()+20)+'px, 0px)');
		$('#bgText').animate({clip: 'rect(0px, '+$('#bgText').width()+'px, '+($('#bgText').height()+20)+'px, 0px'}, 800, 'easeOutQuad');
	});
	
	$('#bgImages li img').stop().animate({opacity:'.4'},500);
	$('#bgImages li.active img').stop().animate({opacity:'1'},500);
	if($('#bgImageWrapper .old').length>0)
	{
		$('#bgImageWrapper .old').stop(true).animate({opacity:0}, 500, function(){
			$(this).remove();
			bgRunning = false;
		});
	}else{bgRunning = false;}
	
	if(!NormalFade){
		$('#bgImageWrapper .new').css('opacity', '1');
		if(activePlayer=='none' && !useFullImage){
			var beforeAniLeft = $('#bgImageWrapper .new').css('left');
			$('#bgImageWrapper .new').css('left', '-'+$('#bgImageWrapper .new').width()+'px');
			$('#bgImageWrapper .new').animate({left:beforeAniLeft},600, 'easeOutQuad');
		}
	}else{
		$('#bgImageWrapper .new').css('opacity', '0');
			$('#bgImageWrapper .new').animate({opacity:'1'},600, 'easeOutQuad');
	}
	setBgTimer();
}

function setBgTimer(){
	if(bgTime>0 && bgPaused==false && activePlayer == 'none')
	bgTimer = setInterval(autoBg, bgTime);
}

// Open Inner Page
function openPage(getURL){
	// Page Loading on Click
	if(getURL=='')
		getURL='index.html';
	if(pageLoading || getURL=='' || getURL.indexOf('gallery[')>-1 || getURL.substr(0,1)=='#') return false;
	var pageLoadingURL = $.trim(getURL);
	pageLoading = true;
	$('#contentBoxContainer').error(function(){
		alert('page not found');
		pageLoading = false;
	});
	if($('#contentBoxContainer').html()=='')
	{
			if(frontPage!='' && pageLoadingURL=='index.html')
			{
				showLoading();
				pageLoadingURL = frontPage;
				$('#contentBoxContainer').load(pageLoadingURL, pageLoadReady);
			}else if(!(pageLoadingURL=='/' || pageLoadingURL=='//')){
				showLoading();
				$('#contentBoxContainer').load(pageLoadingURL, pageLoadReady);
			}else{
			pageLoading = false;
			showBgCaption = true;
			}
	}else{
		$('#contentBoxScroll').animate({opacity:'0', marginTop:-200}, 600, 'easeOutExpo');
		$("#dim").fadeOut(1000);
		$('#content').animate({opacity:'0', marginTop:-200}, 600, 'easeOutExpo', function(){
			$('#content, #contentBoxScroll').hide();
			if(!(pageLoadingURL=='/' || pageLoadingURL=='//')){
				showLoading();
				$('#contentBoxContainer').load(pageLoadingURL, pageLoadReady);
			}else{
				if(frontPage!='' && pageLoadingURL=='index.html'){
					showLoading();
					pageLoadingURL = frontPage;
					$('#contentBoxContainer').load(pageLoadingURL, pageLoadReady);
				}else{
					$('#contentBoxContainer').html('');
					pageLoading = false;
					showBgCaption = true;
				}
			}
			setCaptionPosition();
		});
	}
	setCaptionPosition();
	return false;
}

function pageLoadReady(){
	pageLoading = false;
	var imageTotal = $('#contentBoxContainer img').length;
    var imageCount = 0;
	if(imageTotal>0)
	{
		$('#contentBoxContainer img').load(function(){
			if(++imageCount == imageTotal){
				pageLoaded();
				return true;
			}
		}).error(function(){
			if(++imageCount == imageTotal){
				pageLoaded();
				return true;
			}
		});
	}else{
		pageLoaded();
	}
}

// Inner Page Loaded Actions
function pageLoaded(){
	hideLoading();
	showBgCaption = false;
	setCaptionPosition();
	pageLoading = false;
	
	$('#content').show().css({opacity:'1'});
	$("#dim").fadeIn(1000);
	$('#contentBoxScroll').show().css({opacity:'0', marginTop:'200px'});
	$('#content').show().css({opacity:'0', marginTop:'200px'});
		setContentHeight();
		setScroll();
	$('#content, #contentBoxScroll').stop(true).delay(500).animate({opacity:'1', marginTop:0}, 600, 'easeOutExpo');
	$('#contentBoxContainer').css('top', '0px');
	$('#contentBoxScrollDragger').css('top', '0px');
	
	$('#contentBox a').mouseover(function(){
		if(audioSupport)
			btnSound.play();
	});
	
	// Set click sound to all links
	$('#contentBox .blogTop a').click(function(){
		$('#content').stop().animate({scrollTop:0}, 1000, 'easeOutExpo');
	});
	
	
	setImageModal(); 
	
	// Set Tips
	$('#contentBoxContainer .meta-links a, #contentBox .tip').hover(function(){
		if($(this).attr('tips-id')==undefined)
			$(this).attr('tips-id', 'tips-'+randomString(5));
		var tipsID = $(this).attr('tips-id');
		if($('#'+tipsID).length==0){
			var pos = $(this).position();
			$('#contentBoxContainer').append($('<div id="'+tipsID+'" class="meta-tips">'+$(this).attr('rel')+'<span><svg xmlns="http://www.w3.org/2000/svg" version="1.1"><polygon points="0,0 10,0 10,10" /></svg></span></div>'));
			$('#'+tipsID).css({top:(pos.top-$('#'+tipsID).height()-21)+'px', opacity:'0', left:(pos.left-$('#'+tipsID).width()-20+$(this).width()/2)+'px'});
		}
		$('#'+tipsID).stop().delay(100).animate({opacity:'1'});
	}, function(){
		var tipsID = $(this).attr('tips-id');
		$('#'+tipsID).stop().delay(100).animate({opacity:'0'}, function(){
			$(this).remove();
		});
	});
	
	setImageAnimations();
	
	// Form Focus
	$('#contentBox .dform input[type=text], #contentBox .dform select, #contentBox .dform textarea').focus(function(){
		$(this).parent().addClass('dFormInputFocus');
	}).blur(function(){
		$(this).parent().removeClass('dFormInputFocus');
	});
	
	// Button Animation
	$('#contentBox .buttonSmall, #contentBox .buttonMedium').hover(function(){
		$(this).stop().animate({opacity:'.50'}, 400);
	}, function(){
		$(this).stop().animate({opacity:'1'}, 400);
	});
	
	//Filter
	var $applications = $('#contentBox .portfolioitems');
	var $data = $applications.clone();
	
	$('#contentBox .portfolioFilter li a').click(function(e) {
		var dataValue = $(this).parent().attr('data-value');
		if (dataValue=='all'){
			var $filteredData = $data.find('li');
		} else {
			var $filteredData = $data.find('li[data-type~="cat' + dataValue + '"]');
		}

		// finally, call quicksand
		$('.hoverWrapper, .hoverWrapper a').hide();
		$applications.quicksand($filteredData, {
		  duration: 800,
		  easing: 'easeInOutQuad',
		  enhancement: function(){ 
			setImageModal();
			setImageAnimations(); }
		}, function(){
			//
		});
	});
	
}

function setImageModal(){
	var modalid = randomString(5);
	$('#contentBox .image_frame a img').not('.nomodal').parent().attr('rel','gallery[photo'+modalid+']');
	
}

function setImageAnimations(){
	// Image Animation
	$('#contentBox .image_frame a img').each(function(){
		// Set First Position and Size for Image Hover
		$(this).parent().parent().find('.hoverWrapperBg').css({width:$(this).width()+'px', height:$(this).height()+'px', opacity:'0'});
		$(this).parent().parent().find('.hoverWrapper').css({width:$(this).width()+'px', height:$(this).height()+'px'});
		$(this).parent().parent().find('.hoverWrapper h3, .hoverWrapper .enter-text').css({opacity:'0'});
		$(this).parent().parent().find('.hoverWrapper a').css({opacity:'0'})
		$(this).parent().parent().find('.hoverWrapper a.link').click(function(event){
			event.stopPropagation();
		});
		$(this).parent().click(function(event){
			event.stopPropagation();
		});
		// Set Image Hover Animation
		if(!mobileDevice){
			$(this).parent().parent().hover(imageAniHover, imageAniHout).click(function(event){
			event.stopPropagation();
			$(this).find('> a').trigger('click');
			});
		}else{
			$(this).parent().parent().click(function(event){
				event.stopPropagation();
				
				if(parseInt($(this).find('.link').css('opacity'))==1)
					$(this).find('> a').trigger('click');
				else
					imageAniHover(event, this);
			});
		}
	});
}
function imageAniHover(event, obj){
	obj = (obj==undefined)?this:obj;
	event.stopPropagation();
	$(obj).find('.modal, .modalVideo').stop().delay(100).animate({opacity:'1', bottom:15}, 100 );
	$(obj).find('.link').stop().animate({opacity:'1', bottom:15}, 100);
	$(obj).find('.hoverWrapperBg').stop().animate({opacity:'.50'}, 400);
	$(obj).find('.hoverWrapper h3').stop().delay(100).animate({opacity:'1'}, 300);
	$(obj).find('.hoverWrapper .enter-text').stop().delay(200).animate({opacity:'1'}, 300);
}
function imageAniHout(event, obj){
	obj = (obj==undefined)?this:obj;
	event.stopPropagation();
	$(obj).find('.modal, .modalVideo').stop().delay(100).animate({opacity:'0', bottom:5}, 100);
	$(obj).find('.link').stop().animate({opacity:'0', bottom:5}, 100);
	$(obj).find('.hoverWrapperBg').stop().animate({opacity:'0'}, 400);
	$(obj).find('.hoverWrapper h3').stop().animate({opacity:'0'}, 300);
	$(obj).find('.hoverWrapper .enter-text').stop().animate({opacity:'0'}, 300);
};

// Close Sub Menu
function closeSubMenu(menuID){
	if(menuID=="undefined"){
		$('#mainmenu ul li[id='+menuID+'] ul').each(function(){
			$(this).animate({clip: 'rect(0px, 0px, '+$(this).attr('firstheight')+'px, 0px)', left:parseInt($(this).attr('firstleft'))}, 300, 'easeOutQuad');
		});
	}else{
		$('#mainmenu ul li:not([id='+menuID+']) ul').each(function(){
			$(this).animate({clip: 'rect(0px, 0px, '+$(this).attr('firstheight')+'px, 0px)', left:parseInt($(this).attr('firstleft'))}, 300, 'easeOutQuad');
		});
		$('#mainmenu ul li[id='+menuID+'] ul').stop(true,true).delay(300).animate({left:parseInt($('#mainmenu ul li[id='+menuID+'] ul').attr('firstleft')), clip: 'rect(0px, '+$('#mainmenu ul li[id='+menuID+'] ul').attr('firstwidth')+'px, '+$('#mainmenu ul li[id='+menuID+'] ul').attr('firstheight')+'px, 0px)'}, 300, 'easeOutQuad');
	}
}

// Main Menu Item over Animation
function menuItemOver(obj){
	clearTimeout(menuTimer);			
	if(audioSupport)
		btnSound.play();
}

// Main Menu Show Animation
function showMenu(){
	$('ul.menu > li').each(function(i,el){
		$(el).find('> a').hover(function(event){

			clearTimeout(subMenuTimer);
			closeSubMenu($(this).parent().attr('id')); 
			menuItemOver(this);
		}, function(){
			subMenuTimer = setTimeout(closeSubMenu, menuTime);
		});
	});
	
	$('#mainmenu ul li ul li a').each(function(i,el){
		$(this).hover(function(event){
			clearTimeout(subMenuTimer);
			$(this).closest('.sub-menu').parent().addClass('active');
			menuItemOver(this);
			closeSubMenu($(this).closest('.sub-menu').parent().attr('id'));
		}, function(){
			$(this).closest('.sub-menu').parent().removeClass('active');
			$(this).parent().parent().parent().removeClass('active');
			subMenuTimer = setTimeout(closeSubMenu, menuTime);
		}).click(function(event){
			closeSubMenu();
		});
	});
}

function setCaptionPosition(){
	if(showBgCaption)
		$('#bgText div').stop().animate({opacity:'1'}, 500, 'easeOutQuad');
	else
		$('#bgText div').stop().animate({opacity:'0'}, 500, 'easeOutQuad');
}

/*Time Bar*/
function playerBarMouseDown(event){
	$(document).bind('selectstart dragstart', rFalse);
	var firstX = event.pageX-$('#playerBar').offset().left;
	setBarPosition(firstX);
	$(document).bind('mousemove', {pageX:event.pageX, firstWidth:firstX}, playerMouseMove);
	$(document).bind('mouseup', playerMouseUp);
	$('#playerBar').unbind('mousedown', playerBarMouseDown);
}
function playerMouseMove(event){
	var newWidth = event.data.firstWidth+(event.pageX-event.data.pageX);
	if(newWidth<0)
		newWidth=0;
	if(newWidth>$('#playerBar').width())
		newWidth=$('#playerBar').width();
	
	setBarPosition(newWidth);
}
function playerMouseUp(event){
	$(document).unbind('selectstart dragstart', rFalse);
	$(document).unbind('mousemove', playerMouseMove);
	$(document).unbind('mouseup', playerMouseUp);
	$('#playerBar').bind('mousedown', playerBarMouseDown);
}
function setBarPosition(barX){
	if(!myAudio.paused){
		var posW=parseInt((myAudio.duration/$('#playerBar').width())*barX);
		myAudio.currentTime = posW;
	}
}

/*Volume Bar*/
function volumeBarMouseDown(event){
	$(document).bind('selectstart dragstart', rFalse);
	var firstX = event.pageX-$('#volumeBar').offset().left;
	setVolumeBarPosition(firstX);
	$(document).bind('mousemove', {pageX:event.pageX, firstWidth:firstX}, volumeMouseMove);
	$(document).bind('mouseup', volumeMouseUp);
	$('#volumeBar').unbind('mousedown', volumeBarMouseDown);
}
function volumeMouseMove(event){
	var newWidth = event.data.firstWidth+(event.pageX-event.data.pageX);
	if(newWidth<0)
		newWidth=0;
	if(newWidth>$('#volumeBar').width())
		newWidth=$('#volumeBar').width();
	
	setVolumeBarPosition(newWidth);
}
function volumeMouseUp(event){
	$(document).unbind('selectstart dragstart', rFalse);
	$(document).unbind('mousemove', volumeMouseMove);
	$(document).unbind('mouseup', volumeMouseUp);
	$('#volumeBar').bind('mousedown', volumeBarMouseDown);
}
function setVolumeBarPosition(barX){
	var posW=(1/$('#volumeBar').width())*barX;
	myAudio.volume = posW;
}

/*Audio Functions*/
function setPlaylist(){
	if(audioSupport)
	{
		myAudio = new Audio();
		var audioTagSupport = !(myAudio.canPlayType);
		{
			$(myAudio).bind('timeupdate', function(){
				var rem = parseInt(myAudio.duration - myAudio.currentTime, 10),
				activeWidth = (myAudio.currentTime / myAudio.duration)*$('#playerBar').width(),
				volWidth = (myAudio.volume / 1)*$('#volumeBar').width(),
				Dmins = Math.floor(parseInt(myAudio.duration,10)/60,10),
				Dsecs = parseInt(myAudio.duration,10) - Dmins*60;
				Cmins = Math.floor(parseInt(myAudio.currentTime,10)/60,10),
				Csecs = parseInt(myAudio.currentTime,10) - Cmins*60;
				$('#playerBarActive').css('width', activeWidth+'px');
				$('#volumeBarActive').css('width', volWidth+'px');
				if(Cmins!=NaN && Csecs!=NaN)
					$('#playerSongDuration .current').html(Cmins+':'+(Csecs>9?Csecs:'0'+Csecs));
				else
					$('#playerSongDuration .current').html('');
				if(Dmins!=NaN && Dsecs!=NaN)
					$('#playerSongDuration .total').html(' / '+Dmins+':'+(Dsecs>9?Dsecs:'0'+Dsecs));
				else
					$('#playerSongDuration .total').html('');
			});
			$('#playerBar').bind('mousedown', playerBarMouseDown);
			$('#volumeBar').bind('mousedown', volumeBarMouseDown);
			
			$('#playerController .pause').click(function(){
				if(myAudio.duration>0)
				{
					myAudio.pause();
					$('#playerController .pause').hide();
					$('#playerController .play').show();
				}
				return false;
			});
			$('#playerController .play').click(function(){
				if(myAudio.duration>0)
				{
					myAudio.play();
					$('#playerController .pause').show();
					$('#playerController .play').hide();
					return false;
				}
			});
			$('#playerController .stop').click(function(){
				if(myAudio.duration>0)
				{
					myAudio.pause();
					myAudio.currentTime=0;
					$('#playerController .play').show();
					$('#playerController .pause').hide();
				}
				return false;
			});
			$('#playerController .loop').click(function(){
				loop = false;
				$('#playerController .loop').hide();
				$('#playerController .nextsong').show();
			});
			$('#playerController .nextsong').click(function(){
				loop = true;
				$('#playerController .loop').show();
				$('#playerController .nextsong').hide();
			});

			$('#footeraudio .soundicon, #playerController .unmute').click(doMute);
			$('#footeraudio .soundmute, #playerController .mute').click(doUnMute);
			
			btnSound = new Audio();
			var canPlayMp3 = !!btnSound.canPlayType && "" != btnSound.canPlayType('audio/mpeg');
			if(canPlayMp3)
				btnSound.src = btnSoundUrlMp3;
			else
				btnSound.src = btnSoundUrlOgg;
			
			$('a').mouseover(function(){
				btnSound.play();
			});
			
			if(autoPlay){
				playAudio($('#audioList li:first-child'), 'auto');
			}else{
				$('#playerController .pause').hide();
			}
			if(loop)
				$('#playerController .nextsong').hide();
			else
				$('#playerController .loop').hide();
		}
	}
	$('#audioList ul li').click(function(){
		playAudio(this, 'direct');
	});
}

function doUnMute(e){
	if(e!=undefined){
		muteAudioChangedBy = e.target.nodeName;
		muteAudioChangedStatus = 'unmute';
	}
	myAudio.muted = false;
	$('#footeraudio .soundicon').show();
	$('#footeraudio .soundmute').hide();
	$('#playerController .mute').hide();
	$('#playerController .unmute').show();
}
function doMute(e){
	if(e!=undefined){
		muteAudioChangedBy = e.target.nodeName;
		muteAudioChangedStatus = 'mute';
	}
	myAudio.muted = true;
	$('#footeraudio .soundicon').hide();
	$('#footeraudio .soundmute').show();
	$('#playerController .mute').show();
	$('#playerController .unmute').hide();
}

// Play Background Audio
function playAudio(obj, type){
	
	if(audioSupport){
		var isPlaying = !myAudio.paused;
		var canPlayMp3 = !!myAudio.canPlayType && "" != myAudio.canPlayType('audio/mpeg');
		var canPlayOgg = !!myAudio.canPlayType && "" != myAudio.canPlayType('audio/ogg; codecs="vorbis"');
		if(canPlayMp3)
			myAudio.src = $(obj).attr('data-mp3');
		else if(canPlayOgg)
			myAudio.src = $(obj).attr('data-ogg');
		
		$('#playerSongName').text($(obj).text());

		myAudio.removeEventListener('ended', arguments.callee, false);
		myAudio.addEventListener('ended', audioAddEndedListener , false);
		
		
		if(autoPlay || isPlaying || type=='direct')
		{
			$(obj).parent().find('li').removeClass('active');
			$(obj).addClass('active');
			myAudio.play();
			$('#playerController .pause').show();
			$('#playerController .play').hide();
		}else{
			$('#playerController .play').show();
			$('#playerController .pause').hide();
		}
	}
}
function audioAddEndedListener() 
{
	if(loop){
	this.currentTime = 0;
	this.play();
	}else{
		this.removeEventListener('ended', arguments.callee, false);
		if(!$('#audioList li.active').is(':last-child'))
			$('#audioList li.active').removeClass('active').next().addClass('active');
		else
			$('#audioList li.active').removeClass('active').parent().find('li:first-child').addClass('active');
		playAudio($('#audioList li.active'), 'auto');
		myAudio.addEventListener('ended', audioAddEndedListener, false);
	}
}

// Randoma string generator
function randomString(size) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = '';
	for (var i=0; i<size; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}
function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

