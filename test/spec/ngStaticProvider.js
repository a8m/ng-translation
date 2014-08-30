'use strict';

describe('ngStaticProvider', function() {

  beforeEach(module('ng.static.provider', function ($provide) {
    //mock dependency
    $provide.value('staticFileLoader', {
      get: function() {}
    });
  }));

});