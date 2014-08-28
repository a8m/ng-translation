'use strict';

describe('ngStaticFilter', function() {

  //mock files
  var mockFiles = {};
  //helper
  function bindKeys(object) {
   return extend(mockFiles, object);
  }

  beforeEach(module('ng.static.filter', function($provide) {
    $provide.value('ngStatic', {
      get: function(key) {
        return mockFiles[key] || mockFiles;
      }
    });
  }));

  it('should be defined', inject(function(staticFilter) {
    expect(staticFilter).toBeDefined();
  }));

  it('should get key and file name and return the value', inject(
    function(staticFilter) {
      //bind some keys to mock
      bindKeys({
        login: { manager: 'hello manager', employee: 'hello employee' },
        logout: { msg: { employee: 'c ya employee' } }
      });
      //expectation
      expect(staticFilter('manager', 'login')).toBe('hello manager');
      expect(staticFilter('employee', 'login')).toBe('hello employee');

      expect(staticFilter('msg.employee', 'logout')).toBe('c ya employee');
    }
  ));

  it('should return the given key if the value is undefined', inject(
    function(staticFilter) {
      expect(staticFilter('employer', 'file')).toBe('employer');
      expect(staticFilter('employer.btn', 'file')).toBe('employer.btn');
    }
  ));

});
