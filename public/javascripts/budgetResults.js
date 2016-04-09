(function() {
	var budgetField = document.querySelector('#budgetBox');
	var budgetResults = document.querySelector('#budgetResults p');

	budgetField.addEventListener('keyup',function(){
		budgetResults.innerHTML = "$"+this.value;
	},false);
})();