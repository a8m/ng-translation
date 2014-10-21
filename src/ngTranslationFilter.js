
/**
 * @ngdoc module
 * @name ng-translation.filter
 *
 * @description
 * ngTranslationFilter get key as a string, and staticFileName as an arguments
 * and return the value.
 * @example
 * <p>{{ 'someKey' | translate: 'homepage' }}</p>
 */

angular.module('ng-translation.filter', [ 'ng-translation.provider' ])
  .filter('translate', ['$parse', '$interpolate', 'ngTranslation', function($parse, $interpolate, ngTranslation) {

    var translateFilter = function(string) {

      var args = Array.prototype.slice.call(arguments, 1);
      var funcName = isString(args[0]) ? 'get' : 'getUsed';
      var res = $parse(string)(ngTranslation[funcName](args[0]));

      //if there is no arguments
      if(!args.length || isUndefined(res)) {
        return res || string;
        //if the first argument is an object
      } else if(isObject(args[0])) {
        return $interpolate(res)(args[0] || {})
      }
      //the first arguments is a string
      //check if it should be interpolate
      return isObject(args[1])
        ? $interpolate(res)(args[1] || {})
        : res
    };

    translateFilter.$stateful = true;

    return translateFilter;

  }]);
