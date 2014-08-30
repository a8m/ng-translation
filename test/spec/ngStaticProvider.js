'use strict';

describe('ngStaticProvider', function() {

  var httpResult;

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
          object[options.key] = httpResult[options.value];

          deferred.resolve(object);
        });
        return deferred.promise;
      }
    };
  }

  //Actions
  function setHttpResult(result) {
    return httpResult = result;
  }

  beforeEach(module('ng.static.provider', function ($provide) {
    //Dependency as a mock
    $provide.factory('staticFilesLoader', staticFilesLoaderMock);
  }));

  describe('setters test', function() {

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

  })

});