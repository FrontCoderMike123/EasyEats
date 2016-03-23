(function() {

	function destroy() {
		var text = document.querySelector('#deleteText');
		var daBomb = document.querySelector('#nukeButton');
		var abort = document.querySelector('#abort');
		
		TweenMax.to(text, 1, {
                css: {
                    scaleX: 1.3,
                    scaleY: 1.3,
                    opacity: 1,
                    transformOrigin: "center center"
                },
                        onComplete: reverse,
                    onCompleteParams: [text],
                delay: 0.5,
                ease: Power3.easeInOut
            });

            function reverse(el) {
                TweenMax.to(el, 0.5, {
                    css: {
                        scaleX: 1,
                        scaleY: 1,
                        opacity:1,
                        transformOrigin: "center center",
                        autoAlpha: 1,
                    },
                    ease: Power2.easeOut
                });
            }

        TweenMax.to(daBomb, 0.5, {
                css: {
                    scaleX: 1.35,
                    scaleY: 1.35,
                    opacity: 1,
                 	width: 300,
                 	height: 300,
                    transformOrigin: "center center"
                },
                        onComplete: rolling,
                    onCompleteParams: [daBomb],
                delay: 3,
                ease: Power3.easeInOut
            });

        TweenMax.to(abort, 0.5, {
                css: {
                    scaleX: 1.35,
                    scaleY: 1.35,
                    opacity: 1,
                 	width: 300,
                 	height: 300,
                    transformOrigin: "center center"
                },
                        onComplete: rolling,
                    onCompleteParams: [abort],
                delay: 3,
                ease: Power3.easeInOut
            });

         function rolling(el) {
                TweenMax.to(el, 0.2, {
                    css: {
                        scaleX: 1,
                        scaleY: 1,
                        opacity:1,
                        transformOrigin: "center center",
                        autoAlpha: 1,
                    },
                    ease: Power2.easeOut
                });
            }
	}

	window.addEventListener("load", destroy, true);

})();