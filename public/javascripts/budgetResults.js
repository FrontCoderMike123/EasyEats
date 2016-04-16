(function() {
	var budgetField = document.querySelector('#budgetBox');
	var budgetResults = document.querySelector('#budgetResults p');
	var results = document.querySelector('#budgetResults');

	budgetField.addEventListener('keyup',function(event){
		budgetResults.innerHTML = "$"+this.value;
		if(budgetField.value === ""){
			results.classList.add('hidden');
		}
	},false);
})();