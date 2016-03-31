(function() {

	function banner() {
		TweenMax.staggerFrom(".buttons",2,{scale:0.5,opacity:0,delay:0.5,ease:Elastic.easeOut}, 0.5);
	}

	window.addEventListener("load", banner, true);

})();