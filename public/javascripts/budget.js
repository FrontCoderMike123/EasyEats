(function(){

    var input = document.querySelector('#budgetInput');
    var moneyDiv = document.querySelector('#moneyOnly');
    var moneyOnly = document.querySelector('#moneyOnly p');

    input.addEventListener("keyup", function(evt) {
        console.log('da fuck');
        var charCode = (evt.which) ? evt.which : evt.keyCode;
    evt = (evt) ? evt : window.event;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        moneyOnly.innerHTML = "<%= moneyOnly %>";
        moneyDiv.classList.add('opac');
        return false;
    }else{
      moneyOnly.innerHTML = "";
      moneyDiv.classList.remove('opac');
    }
    return true;
  }, false);

})();