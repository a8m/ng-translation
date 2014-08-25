angular.module('app', ['ng.static'])
  .controller('MainController', function($scope) {

    $scope.foo = 'bar';

  })
  .config(['ngStaticProvider', function(ngStaticProvider) {
    ngStaticProvider
      .setBaseUrl('/ng-static/demo/static')
      .staticFiles({
        demo: '/demo.json',
        demo1: '/demo.json',
        demo2: '/demo.json'
      })
  }]);
