(function() {

	function banner() {

		var left = document.querySelector('.moneySVG');
		var center = document.querySelector('.refreshSVG');
		var right = document.querySelector('.happySVG');

		var mobileLeft = document.querySelector('.mobileMoney');
		var mobileCenter = document.querySelector('.mobileRefresh');
		var mobileRight = document.querySelector('.mobileHappy');

		TweenMax.to(left, 1, {x:10050, y:0, delay:1});
		TweenMax.to(center, 1.5, {opacity:1, delay:4});
		TweenMax.to(right, 1, {x:-10050, y:0, delay:7});

		TweenMax.to(mobileLeft, 1, {opacity:1, delay:1});
		TweenMax.to(mobileCenter, 1, {opacity:1, delay:4});
		TweenMax.to(mobileRight, 1, {opacity:1, delay:7});

		var leftText = document.querySelector('.moneyContent');
		var centerText = document.querySelector('.refreshContent');
		var rightText = document.querySelector('.happyContent');

		var leftMobileText = document.querySelector('.mobileMoneyC');
		var centerMobileText = document.querySelector('.mobileRefreshC');
		var rightMobileText = document.querySelector('.mobileHappyC');

		TweenMax.to(leftText, 1, {opacity:1,delay:2.5});
		TweenMax.to(centerText, 1, {opacity:1,delay:5.5});
		TweenMax.to(rightText, 1, {opacity:1,delay:8.5});

		TweenMax.to(leftMobileText, 1, {opacity:1,delay:2.5});
		TweenMax.to(centerMobileText, 1, {opacity:1,delay:5.5});
		TweenMax.to(rightMobileText, 1, {opacity:1,delay:8.5});

	}

	window.addEventListener("load", banner, true);

})();