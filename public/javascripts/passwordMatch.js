(function(){
	var passOne = document.querySelector('#password1');
	var passTwo = document.querySelector('#password2');
	var passOneText = document.querySelector('#passwordText1');
	var passTwoText = document.querySelector('#passwordText2');

	passOne.addEventListener('keyup',function(){
		passOneText.innerHTML = this.value;
		passOneText.classList.add('resetMatch');
		if(passOneText.innerHTML === ""){
			passOneText.classList.remove('resetMatch');
		}
	},false);

	passTwo.addEventListener('keyup',function(){
		passTwoText.innerHTML = this.value;
		passTwoText.classList.add('resetMatch');
		if(passTwoText.innerHTML === ""){
			passTwoText.classList.remove('resetMatch');
		}
	},false);
})();