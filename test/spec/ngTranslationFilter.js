'use strict';

describe('ngTranslationFilter', function() {

  //mock files
  var mockFiles = {};
  //helper
  function bindKeys(object) {
   return extend(mockFiles, object);
  }

  beforeEach(module('ng-translation.filter', function($provide) {
    $provide.value('ngTranslation', {
      get: function(key) {
        return mockFiles[key] || mockFiles;
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
        login: { manager: 'hello manager', employee: 'hello employee' },
        logout: { msg: { employee: 'c ya employee' } }
      });
      //expectation
      expect(translateFilter('manager', 'login')).toBe('hello manager');
      expect(translateFilter('employee', 'login')).toBe('hello employee');

      expect(translateFilter('msg.employee', 'logout')).toBe('c ya employee');
    }
  ));

  it('should return the given key if the value is undefined', inject(
    function(translateFilter) {
      expect(translateFilter('employer', 'file')).toBe('employer');
      expect(translateFilter('employer.btn', 'file')).toBe('employer.btn');
    }
  ));

});
