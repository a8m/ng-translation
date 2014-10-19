'use strict';

describe('ngTranslationFilter', function() {

  //mock files
  var mockFile = {};
  //helper
  function bindKeys(object) {
   return extend(mockFile, object);
  }

  beforeEach(module('ng-translation.filter', function($provide) {
    $provide.value('ngTranslation', {
      getUsed: function() {
        return mockFile;
      },
      get: function(lang) {
        return mockFile[lang];
      }
    });
  }));

  it('should be defined', inject(function(translateFilter) {
    expect(translateFilter).toBeDefined();
  }));

  it('should get key and file name and return the value', inject(
    function(translateFilter) {
      //bind some keys to mock
      bindKeys({
        manager: 'hello manager',
        employee: 'hello employee',
        msg: { employee: 'c ya employee' }
      });
      //expectation
      expect(translateFilter('manager')).toBe('hello manager');
      expect(translateFilter('employee')).toBe('hello employee');

      expect(translateFilter('msg.employee')).toBe('c ya employee');
  }));

  it('should return the given key if the value is undefined', inject(
    function(translateFilter) {
      expect(translateFilter('employer')).toBe('employer');
      expect(translateFilter('employer.btn')).toBe('employer.btn');
  }));

  it('should get a file as an argument and fetch from this file', inject(
    function(translateFilter) {
      bindKeys({
        de: { foo: 'barDe', baz: 'bugDe' },
        en: { foo: 'barEn', baz: 'bugEn' }
        });
      expect(translateFilter('foo')).toBe('foo');
      expect(translateFilter('foo', 'de')).toBe('barDe');
      expect(translateFilter('foo', 'de')).toBe('barDe');
      expect(translateFilter('foo', 'en')).toBe('barEn');
      expect(translateFilter('foo', 'en')).toBe('barEn');
  }));

  it('should get an object as an argument, and interpolate', inject(
    function($rootScope, translateFilter) {
      $rootScope.name = 'Ariel';
      $rootScope.age = 26;
      var notScope = { name: 'Null', age: 'Infinity' };
      bindKeys({ exp: 'Name: {{ name }}, Age: {{ age }}' });

      expect(translateFilter('exp', $rootScope)).toBe('Name: Ariel, Age: 26');
      expect(translateFilter('exp', notScope)).toBe('Name: Null, Age: Infinity');
  }));

  it('should get a file as the first arguments, and object for interpolation' +
    'as second argument', inject(function(translateFilter) {
    bindKeys({
      de: { exp: 'De-Name: {{ name }}, De-Age: {{ age }}' },
      en: { exp: 'En-Name: {{ name }}, En-Age: {{ age }}' }
    });
    var me = { name: 'Ariel', age: 26 };
    expect(translateFilter('exp', 'de', me)).toBe('De-Name: Ariel, De-Age: 26');
    expect(translateFilter('exp', 'en', me)).toBe('En-Name: Ariel, En-Age: 26');
  }));

});
