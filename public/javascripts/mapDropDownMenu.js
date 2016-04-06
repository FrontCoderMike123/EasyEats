(function(){

	var drop = document.querySelector('#mapDrop');
	var dropCover = document.querySelector('#mobileMapDrop');

	function dropMenu(){
		//console.log('clicked');
		dropCover.classList.toggle('showDrop');
		drop.classList.toggle('dropSize');
	}

	drop.addEventListener('click',dropMenu,false);

})();