'use strict';

describe('ngStaticProvider', function() {

  //providers
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

  function setBaseUrl(utl) {
    return function(ngStaticProvider) {
      ngStaticProvider.setBaseUrl(url);
    }
  }

  //mocks

  beforeEach(module('ng.static.provider', function ($provide) {
    //mock dependency
    $provide.value('staticFileLoader', {
      get: function() {}
    });
  }));

});