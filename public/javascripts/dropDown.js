(function(){
	//my own little drop down menu. with the help of css.
	var drop = document.querySelector('#dropDown');
	var dropCover = document.querySelector('#mobileDropDown');

	function dropMenu(){
		console.log('clicked');
		dropCover.classList.toggle('showDrop');
		drop.classList.toggle('dropSize');
	}

	drop.addEventListener('click',dropMenu,false);

})();