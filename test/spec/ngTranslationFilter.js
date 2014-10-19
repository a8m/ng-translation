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
    }
  ));

  it('should return the given key if the value is undefined', inject(
    function(translateFilter) {
      expect(translateFilter('employer')).toBe('employer');
      expect(translateFilter('employer.btn')).toBe('employer.btn');
    }
  ));

});
