'use strict';

describe('ngTranslationDirective', function() {

  var element;

  //helpers
  function compile(template) {
    return function($compile, $rootScope) {
      element = $compile(template)($rootScope);
    }
  }

  function expectEqual(string) {
    return expect(element.text().replace(/\s+/g, ''))
        .toEqual(string.replace(/\s+/g, ''));
  }

  function expectNotEqual(string) {
    return expect(element.text().replace(/\s+/g, ''))
      .not.toEqual(string.replace(/\s+/g, ''));
  }

  beforeEach(module('ng-translation'));

  it('should compile to filter format: {{ key | translate: file }}', function() {
    inject(compile('<p ng-translate="file(key)"></p>'));
    expectEqual('{{ key | translate: \'file\' }}');
    expectNotEqual('{{ file | translate: key }}');
  });

  it('should compile to filter format: {{ key | translate }}', function() {
    inject(compile('<p ng-translate="key"></p>'));
    expectEqual('{{ key | translate }}');
    expectNotEqual('{{ key }}');
  });

  it('should compile to filter format: {{ \'key\' | translate }}', function() {
    inject(compile('<p ng-translate="\'key\'"></p>'));
    expectEqual('{{ \'key\' | translate }}');
    expectNotEqual('{{ key | translate }}');
  });

  it('should support nested keys', function() {
    inject(compile('<p ng-translate="demoFile(key.nested.key)"></p>'));
    expectEqual('{{ key.nested.key | translate: \'demoFile\' }}');
    expectNotEqual('{{ key.nested.key }}');
  });


});