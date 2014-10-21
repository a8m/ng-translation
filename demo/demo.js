angular.module('app', ['ng-translation'])
  .controller('MainController', function($scope, ngTranslation) {

    $scope.languages = ['en', 'de', 'es'];
    $scope.user = {
      name: 'Default UserName',
      password: '90_xsB@4{s'
    };

    $scope.update = function(language) {
      ngTranslation.use(language);
    };
  })
  .value({
    value1: { foo: 'bar' },
    value2: { foo: 'baz' }
  })
  .config(['ngTranslationProvider', function(ngTranslationProvider) {
    ngTranslationProvider
      .setDirectory('/ng-translation/demo/languages')
      .setFilesSuffix('.json')
      .langsFiles({
        en: 'en',
        de: 'de',
        es: 'es'
      })
      .fallbackLanguage('en')
  }])
  .run(function($location, ngTranslation) {
    ngTranslation.use(
      $location.search().lang
    );
  });