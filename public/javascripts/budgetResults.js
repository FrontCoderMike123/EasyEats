(function() {
	var budgetField = document.querySelector('#budgetBox');
	var budgetResults = document.querySelector('#budgetResults p');
	var results = document.querySelector('#budgetResults');
	var noSoupForYou = document.querySelector('#noFree');

	budgetField.addEventListener('keyup',function(event){
		budgetResults.innerHTML = "$"+this.value;
		if(budgetField.value === ""){
			results.classList.add('hidden');
		}
		if(budgetField.value === "0"){
			noSoupForYou.innerHTML = 'Unfortunately... Only Hugs Are Free.';
			results.classList.add('hidden');
			budgetField.value = "";
		}
	},false);
})();