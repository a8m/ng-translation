/*jshint globalstrict:true*/
'use strict';

var isUndefined = angular.isUndefined,
  isString = angular.isString,
  isObject = angular.isObject,
  forEach = angular.forEach,
  extend = angular.extend;

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