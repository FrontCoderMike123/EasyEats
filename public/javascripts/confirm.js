(function(){

var confirm = angular.module('confirmEmail', ['confirmEmail.directives']);

angular.module('confirmEmail.directives', [])
    .directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    // console.info(elem.val() === $(firstPassword).val());
                    ctrl.$setValidity('emailMatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);

})();