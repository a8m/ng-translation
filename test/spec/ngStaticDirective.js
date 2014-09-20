'use strict';

describe('ngStaticDirective', function() {

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

  beforeEach(module('ng.static'));

  it('should compile to filter format: {{ key | static: file }}', function() {
    inject(compile('<p ng-static="file(key)"></p>'));
    expectEqual('{{ key | static: file }}');
    expectNotEqual('{{ file | static: key }}');
  });

  it('should compile to filter format: {{ key | static }}', function() {
    inject(compile('<p ng-static="key"></p>'));
    expectEqual('{{ key | static }}');
    expectNotEqual('{{ key }}');
  });

  it('should support nested keys', function() {
    inject(compile('<p ng-static="demoFile(key.nested.key)"></p>'));
    expectEqual('{{ key.nested.key | static: demoFile }}');
    expectNotEqual('{{ key.nested.key }}');
  });


});
