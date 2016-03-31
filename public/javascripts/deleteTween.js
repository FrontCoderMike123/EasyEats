(function() {
    var text = document.querySelector('#deleteText');

	function destroy() {
		TweenMax.to(text,1,{opacity:1});
        TweenMax.to(".deletes",0.2,{css:{opacity:1},delay:2});
	}

	window.addEventListener("load", destroy, true);

})();