angular.module('app', ['ng.static'])
  .controller('MainController', function($scope) {

    $scope.foo = 'bar';
    $scope.role = 'manager';

    $scope.changeRole = function(role) {
      return (role === 'manager') ?
        $scope.role = 'employee' :
        $scope.role = 'manager';
    };

  })
  .config(['ngStaticProvider', function(ngStaticProvider) {
    ngStaticProvider
      .setDirectory('/ng-static/demo/static')
      .staticFiles({
        demo:  'demo.json',
        demo1: 'demo.json',
        demo2: 'demo.json'
      })
  }]);
