(function() {
	var budgetField = document.querySelector('#budgetBox');
	var budgetResults = document.querySelector('#budgetResults p');
	var results = document.querySelector('#budgetResults');

	budgetField.addEventListener('keyup',function(){
		budgetResults.innerHTML = "$"+this.value;
		if(budgetResults.innerHTML === "$"){
			results.classList.add('hidden');
		}
	},false);
})();