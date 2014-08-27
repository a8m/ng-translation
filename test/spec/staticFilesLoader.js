'use strict';

describe('staticFileLoader', function() {

  //whenGET
  function whenGET(path, res) {
    return function($httpBackend) {
      $httpBackend.when('GET', path).respond(res);
    }
  }
  //GET
  function get(options) {
    return function(staticFilesLoader, $httpBackend) {
      staticFilesLoader.get(options);
      $httpBackend.flush();
    }
  }
  //expectGET
  function expectGET(expectation) {
    return function($httpBackend) {
      $httpBackend.expectGET(expectation);
    }
  }

  beforeEach(module('ng.static.files-loader'));

  it('should be defined', inject(function(staticFilesLoader) {
    expect(staticFilesLoader).toBeDefined();
  }));

  it('should be an object', inject(function(staticFilesLoader) {
    expect(typeof staticFilesLoader).toBe('object');
  }));

  it('should fetch static files when calling get', inject(
    whenGET('demo.json', { demo: 'demo' }),
    expectGET('demo.json'),
    get({ value: 'demo', suffix: '.json' })
  ));

  it('should return a promise', inject(function(staticFilesLoader) {

    var promise = staticFilesLoader.get({
      baseUrl: '/static',
      value: '/demo',
      suffix: '.json'
    });
    expect(promise.then).toBeDefined();
    expect(typeof promise.then).toBe('function');
  }));


});
