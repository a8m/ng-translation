'use strict';

describe('ngStaticProvider', function() {

  var loaderResult;

  //Provider
  function staticFiles(files) {
    return function(ngStaticProvider) {
      ngStaticProvider.staticFiles(files);
    }
  }

  function addStaticFile(file) {
    return function(ngStaticProvider) {
      ngStaticProvider.addStaticFile(file);
    }
  }

  function staticValues(values) {
    return function(ngStaticProvider) {
      ngStaticProvider.staticValues(values);
    }
  }

  function setFilesSuffix(sfx) {
    return function(ngStaticProvider) {
      ngStaticProvider.setFilesSuffix(sfx)
    }
  }

  function setBaseUrl(url) {
    return function(ngStaticProvider) {
      ngStaticProvider.setBaseUrl(url);
    }
  }

  //Mocks
  function staticFilesLoaderMock($timeout, $q) {
    //mock the http request
    return {
      get: function(options) {
        var deferred = $q.defer();

        $timeout(function() {
          var object = {};

          object[options.key] = loaderResult[options.key];

          deferred.resolve(object);
        });
        return deferred.promise;
      }
    };
  }

  //Actions
  function setLoaderResult(result) {
    return loaderResult = result;
  }

  beforeEach(module('ng.static.provider', function ($provide) {
    //Dependency as a mock
    $provide.factory('staticFilesLoader', staticFilesLoaderMock);
  }));

  describe('test setters', function() {

    //staticFiles
    it('should be able to set staticFiles', function() {
      var files = { login: '/login_page',  logout: '/logout_page' };
      module(staticFiles(files));
      inject(function(ngStatic) {
        expect(ngStatic.configuration.staticFiles).toEqual(files);
      });
    });

    //addStaticFile
    it('should able to add static file', function() {
      var file = { foo: '/foo' };
      module(addStaticFile(file));
      inject(function(ngStatic) {
        expect(ngStatic.configuration.staticFiles).toEqual(file);
      });
    });

    //staticValues
    it('should be able to set staticValues', function() {
      var values = ['demo1', 'demo2', 'demo3'];
      module(staticValues(values));
      inject(function(ngStatic) {
        expect(ngStatic.configuration.staticValues).toEqual(values);
      });
    });

    //setBaseUrl
    it('should add able to set base url', function() {
      var url = 'app/static';
      module(setBaseUrl(url));
      inject(function(ngStatic) {
        expect(ngStatic.configuration.baseUrl).toEqual(url);
      });
    });

    //setDirectory
    it('should add able to use setDirectory to set baseUrl', function() {
      module(function(ngStaticProvider) {
        ngStaticProvider
          .setDirectory('/app/static');
      });
      inject(function(ngStatic) {
        expect(ngStatic.configuration.baseUrl).toEqual('/app/static');
      })
    });

    //setFilesSuffix
    it('should be able to set suffix for all files', function() {
      module(setFilesSuffix('.json'));
      inject(function(ngStatic) {
        expect(ngStatic.configuration.suffix).toEqual('.json');
      });
    });

  });

  //api object
  describe('api object', function() {

    var mockResult;

    beforeEach(function() {
      //module
      module(
        staticFiles({ login: '/login', logout: 'logout' }),
        setFilesSuffix('.json'),
        setBaseUrl('/app/static')
      );
      //inject
      inject(function(ngStatic, $timeout) {
        mockResult = { login: { foo: 'bar' }, logout: { foo: 'baz' } };
        setLoaderResult(mockResult);
        ngStatic.init();

        $timeout.flush();
      });
    });

    it('should call staticFilesLoader', inject(function(ngStatic, staticFilesLoader) {
      var spy = spyOn(staticFilesLoader, 'get');
      ngStatic.init();

      expect(spy)
        .toHaveBeenCalledWith({ baseUrl : '/app/static', suffix : '.json', value : '/login', key : 'login' });
      expect(spy)
        .toHaveBeenCalledWith({ baseUrl : '/app/static', suffix : '.json', value : '/logout', key : 'logout' });
    }));

    it('should return the file if exist', inject(function(ngStatic) {
      expect(ngStatic.get('login')).toEqual(mockResult.login);
      expect(ngStatic.get('login')).not.toEqual(mockResult.logout);
      expect(ngStatic.get('logout')).toEqual(mockResult.logout);
      expect(ngStatic.get('logout')).not.toEqual(mockResult.login);
    }));

    it('should return first file/default is the file not exist', inject(function(ngStatic) {
      expect(ngStatic.get('homepage')).toEqual(mockResult.login);
      expect(ngStatic.get('api')).toEqual(mockResult.login);
    }));

    it('should return allFiles', inject(function(ngStatic) {
      expect(ngStatic.getAll()).toEqual(mockResult);
    }));
  });

  //external behavior
  describe('external behavior', function() {

    it('should be friendly with files path', function() {
      module(staticFiles({ homepage: 'homepage.json' }));
      inject(function(ngStatic, staticFilesLoader) {
        var spy = spyOn(staticFilesLoader, 'get');
        ngStatic.init();
        expect(spy).toHaveBeenCalledWith({ baseUrl: '', value: '/homepage.json', key: 'homepage', suffix: undefined });
      });
    });

  });

  describe('load static values api', function() {
    var v1 = { foo: 'bar' }, v2 = { foo: 'baz' };

    //mock services and set static values in the providers phase
      beforeEach(module(function($provide) {
        $provide.value('value1', v1);
        $provide.value('value2', v2);
      }, staticValues([ 'value1', 'value2' ]))
    );

    it('should all values as a files', inject(function(ngStatic) {
      ngStatic.init();
      expect(ngStatic.get('value1')).toEqual(v1);
      expect(ngStatic.get('value2')).toEqual(v2);
      expect(ngStatic.getAll()).toEqual({ value1: v1, value2: v2 });
    }));

  });

});
