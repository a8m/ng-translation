'use strict';

describe('ngTranslationProvider', function() {

  var loaderResult;

  //Provider
  function langsFiles(files) {
    return function(ngTranslationProvider) {
      ngTranslationProvider.langsFiles(files);
    }
  }

  function addLangFile(file) {
    return function(ngTranslationProvider) {
      ngTranslationProvider.addLangFile(file);
    }
  }

  function langsValues(values) {
    return function(ngTranslationProvider) {
      ngTranslationProvider.langsValues(values);
    }
  }

  function setFilesSuffix(sfx) {
    return function(ngTranslationProvider) {
      ngTranslationProvider.setFilesSuffix(sfx)
    }
  }

  function setBaseUrl(url) {
    return function(ngTranslationProvider) {
      ngTranslationProvider.setBaseUrl(url);
    }
  }

  function setFallbackLanguage(name) {
    return function(ngTranslationProvider) {
      ngTranslationProvider.fallbackLanguage(name);
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

  beforeEach(module('ng-translation.provider', function ($provide) {
    //Dependency as a mock
    $provide.factory('staticFilesLoader', staticFilesLoaderMock);
  }));

  describe('test setters', function() {

    //langsFiles
    it('should be able to set staticFiles', function() {
      var files = { login: '/login_page',  logout: '/logout_page' };
      module(langsFiles(files));
      inject(function(ngTranslation) {
        expect(ngTranslation.configuration.langsFiles).toEqual(files);
      });
    });

    //addLangFile
    it('should able to add lang file', function() {
      var file = { foo: '/foo' };
      module(addLangFile(file));
      inject(function(ngTranslation) {
        expect(ngTranslation.configuration.langsFiles).toEqual(file);
      });
    });

    //langsValues
    it('should be able to set langsValues', function() {
      var values = ['demo1', 'demo2', 'demo3'];
      module(langsValues(values));
      inject(function(ngTranslation) {
        expect(ngTranslation.configuration.langsValues).toEqual(values);
      });
    });

    //setBaseUrl
    it('should add able to set base url', function() {
      var url = 'app/static';
      module(setBaseUrl(url));
      inject(function(ngTranslation) {
        expect(ngTranslation.configuration.baseUrl).toEqual(url);
      });
    });

    //setDirectory
    it('should add able to use setDirectory to set baseUrl', function() {
      module(function(ngTranslationProvider) {
        ngTranslationProvider
          .setDirectory('/app/static');
      });
      inject(function(ngTranslation) {
        expect(ngTranslation.configuration.baseUrl).toEqual('/app/static');
      })
    });

    //setFilesSuffix
    it('should be able to set suffix for all files', function() {
      module(setFilesSuffix('.json'));
      inject(function(ngTranslation) {
        expect(ngTranslation.configuration.suffix).toEqual('.json');
      });
    });

    //fallbackLanguage
    it('should be able to set fallback language', function() {
      module(setFallbackLanguage('en'));
      inject(function(ngTranslation) {
        expect(ngTranslation.configuration.fallbackLanguage).toEqual('en');
      });
    });

  });

  //api object
  describe('api object', function() {

    var mockResult;

    beforeEach(function() {
      //module
      module(
        langsFiles({ login: '/login', logout: 'logout', en: 'en', de: 'de' }),
        setFilesSuffix('.json'),
        setBaseUrl('/app/static'),
        setFallbackLanguage('de')
      );
      //inject
      inject(function(ngTranslation, $timeout) {
        mockResult = { login: { foo: 'bar' }, logout: { foo: 'baz' }, en: {}, de: {} };
        setLoaderResult(mockResult);
        ngTranslation.init();

        $timeout.flush();
      });
    });

    it('should call staticFilesLoader', inject(function(ngTranslation, staticFilesLoader) {
      var spy = spyOn(staticFilesLoader, 'get');
      ngTranslation.init();

      expect(spy)
        .toHaveBeenCalledWith({ baseUrl : '/app/static', suffix : '.json', value : '/login', key : 'login' });
      expect(spy)
        .toHaveBeenCalledWith({ baseUrl : '/app/static', suffix : '.json', value : '/logout', key : 'logout' });
    }));

    it('should return the file if exist', inject(function(ngTranslation) {
      expect(ngTranslation.get('login')).toEqual(mockResult.login);
      expect(ngTranslation.get('login')).not.toEqual(mockResult.logout);
      expect(ngTranslation.get('logout')).toEqual(mockResult.logout);
      expect(ngTranslation.get('logout')).not.toEqual(mockResult.login);
    }));

    it('should return first file/default is the file not exist', inject(function(ngTranslation) {
      expect(ngTranslation.get('homepage')).toEqual(mockResult.login);
      expect(ngTranslation.get('api')).toEqual(mockResult.login);
    }));

    it('should return allFiles', inject(function(ngTranslation) {
      expect(ngTranslation.getAll()).toEqual(mockResult);
    }));

    it('should return the used language if exist', inject(function(ngTranslation) {
      expect(ngTranslation.getUsed()).toEqual(mockResult.de);
      ngTranslation.use('en');
      expect(ngTranslation.getUsed()).toEqual(mockResult.en)
    }));

    it('should return the fallback language if used not defined', inject(function(ngTranslation) {
        expect(ngTranslation.getUsed()).toEqual(mockResult.de)
    }));

  });

  //external behavior
  describe('external behavior', function() {

    it('should be friendly with files path', function() {
      module(langsFiles({ homepage: 'homepage.json' }));
      inject(function(ngTranslation, staticFilesLoader) {
        var spy = spyOn(staticFilesLoader, 'get');
        ngTranslation.init();
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
      }, langsValues([ 'value1', 'value2' ]))
    );

    it('should all values as a files', inject(function(ngTranslation) {
      ngTranslation.init();
      expect(ngTranslation.get('value1')).toEqual(v1);
      expect(ngTranslation.get('value2')).toEqual(v2);
      expect(ngTranslation.getAll()).toEqual({ value1: v1, value2: v2 });
    }));

  });

});
