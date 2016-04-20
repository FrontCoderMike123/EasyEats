(function(){
	var passOne = document.querySelector('#password1');
	var passTwo = document.querySelector('#password2');
	var passOneText = document.querySelector('#passwordText1');
	var passTwoText = document.querySelector('#passwordText2');
	var button = document.querySelector('#resetButton');
	var noMatch = document.querySelector('#noMatch');
	var formInputs = document.querySelectorAll('.resetForm input');
	var form = document.querySelector('.resetForm');

	form.addEventListener('keyup', function(){
		for(var i = 0; i<formInputs.length; i++){
			//console.log(formInputs[i].value);
			if(formInputs[0].value != formInputs[1].value){
				//console.log('wrong');
				noMatch.innerHTML = 'Your Passwords Do Not Match. Please Try Again.';
			}else{
				//console.log('right');
				noMatch.innerHTML = "I See A Match! Let's Do This!";
			}
		}
	});

	passOne.addEventListener('keyup',function(){
		//console.log('password 1');
		passOneText.innerHTML = this.value;
		passOneText.classList.add('resetMatch');
		if(passOneText.innerHTML === ""){
			passOneText.classList.remove('resetMatch');
		}
	},false);

	passTwo.addEventListener('keyup',function(){
		//console.log('password 2');
		passTwoText.innerHTML = this.value;
		passTwoText.classList.add('resetMatch');
		if(passTwoText.innerHTML === ""){
			passTwoText.classList.remove('resetMatch');
		}
	},false);

	button.addEventListener('click',function(e){
		if(formInputs[0].value != formInputs[1].value){
			noMatch.innerHTML = "Make Sure Your Passwords Match Before Submitting.";
			e.preventDefault();
			return false;
		}else{
			return true;
		}
	},false);
})();