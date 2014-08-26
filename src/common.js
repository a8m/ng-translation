/*jshint globalstrict:true*/
'use strict';

var isDefined = angular.isDefined,
  isUndefined = angular.isUndefined,
  isFunction = angular.isFunction,
  isString = angular.isString,
  isNumber = angular.isNumber,
  isObject = angular.isObject,
  isArray = angular.isArray,
  forEach = angular.forEach,
  extend = angular.extend,
  copy = angular.copy,
  equals = angular.equals;

/**
 * @description
 * returns if a string ends with a particular suffix
 * @param str
 * @param suffix
 * @returns {boolean}
 */
function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * @description
 * returns if a string starts with a particular prefix
 * @param str
 * @param prefix
 * @returns {boolean}
 */
function startWith(str, prefix) {
  return !str.indexOf(prefix);
}