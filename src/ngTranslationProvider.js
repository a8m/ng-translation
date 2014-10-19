
/**
 * @ngdoc module
 * @name ng-translation.provider
 *
 * @description
 * ngTranslation description
 */

angular.module('ng-translation.provider', [ 'ng-translation.files-loader' ])
  .provider('ngTranslation', ngTranslationProvider);

/**
 * @ngdoc function
 * @name ngTranslationProvider
 *
 * @description
 */
function ngTranslationProvider() {

  //store all files
  var langsFiles;

  //store all values
  var langsValues;

  //files suffix
  var suffix;

  //base url / directory
  var baseUrl;

  //fallback language
  var fallbackLanguage;

  //used language, file to use
  var usedLanguage;

  /**
   * @ngdoc method
   * @description
   * Set languages files as a key value pairs
   * @param files
   * @return {ngTranslationProvider}
   * @example
   * ngTranslationProvider
   *  .langsFiles({
   *    en: 'file.json',
   *    he: 'folder/file.json',
   *    ru: 'file' <== by default prefix is json
   *  })
   */
  this.langsFiles = function(files) {
    langsFiles = files;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Add file to languages files object
   * @param file
   * @returns {ngTranslationProvider}
   * @example
   * ngTranslationProvider
   *  .addLangFile({
   *   en: filename.json
   *  })
   */
  this.addLangFile = function(file) {
    langsFiles = langsFiles
      ? extend(langsFiles, file)
      : file;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Set array of values as a files
   * @param values {Array}
   * @return {ngTranslationProvider}
   * @example
   * ngTranslationProvider
   *  .langsValue([
   *    'en',
   *    'ru'
   *  ])
   */
  this.langsValues = function(values) {
    langsValues = values;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Set global suffix to all files
   * @param sfx
   * @returns {ngTranslationProvider}
   * @example
   * ngTranslationProvider
   *  .setFilesSuffix('-static.json')
   *  .langsFiles({
   *    en: 'en' <== en-static.json
   *  })
   */
  this.setFilesSuffix = function(sfx) {
    suffix = sfx;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Set base url static files directory
   * @param url {String}
   * @returns {ngTranslationProvider}
   * @example
   *  __ __ __ __ __ __
   * | - dist          |
   * |   - assets      |
   * |     - static    |
   * |__ __ __ __ __ __|
   *
   * ngTranslationProvider
   *  .setBaseUrl('dist/assets/static')
   *  .langsFiles({
   *    en: 'english,json' <== dist/assets/static/english.json
   *  })
   */
  this.setBaseUrl = function(url) {
    baseUrl = new RegExp(/\/$/).test(url) ?
     url.substring(0, url.length-1) :
      url;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Set fallback language
   * @param lang
   * @returns {ngTranslationProvider}
   * @example
   * ngTranslationProvider
   *  .fallbackLanguage('en')
   *
   */
  this.fallbackLanguage = function(lang) {
    fallbackLanguage = lang;
    return this;
  };

  /**
   * Alias to setBaseUrl function
   */
  this.setDirectory = this.setBaseUrl;

  /**
   * @description
   * returned api
   */
  this.$get = ['$q', '$injector', 'staticFilesLoader', function($q, $injector, staticFilesLoader) {

    /**
     * @description
     * Store all static files content
     * @var object
     */
    var staticFilesContainer = {};

    /**
     * @description
     * Store all configuration service
     * @var object
     */
    var configuration = {
      baseUrl: baseUrl || '',
      suffix: suffix,
      langsFiles: langsFiles,
      langsValues: langsValues,
      fallbackLanguage: fallbackLanguage,
      usedLanguage: usedLanguage
    };

    /**
     * @ngdoc method
     * @param name
     * @returns usedLanguage || false
     * @private
     */
    function $$setUsedLanguage(name) {
      return isString(name)
        ? usedLanguage = name
        : false;
    }

    /**
     * @ngdoc method
     * @description
     * Return the current used file || fallback file
     * @returns {*}
     */
    function $$getUsed() {
      return staticFilesContainer[usedLanguage] ||
        staticFilesContainer[fallbackLanguage];
    }

    /**
     * @ngdoc method
     * @param name
     * @returns specific file || the first(default) file
     * @private
     */
    function $$getFile(name) {
      return staticFilesContainer[name] ||
        staticFilesContainer[Object.keys(staticFilesContainer)[0]];
    }

    /**
     * @ngdoc method
     * @description
     * returns all files / staticFiles object
     * @returns {{}}
     * @private
     */
    function $$getFiles() {
      return staticFilesContainer;
    }

    /**
     * @description
     * bind files array to staticFilesContainer object
     * @param filesArray
     */
    function $$bindFiles(filesArray) {
      forEach(filesArray, function(value, key) {
        extend(staticFilesContainer, value);
      });
    }

    /**
     * @ngdoc method
     * @description
     * load all files and then call bindFiles function
     */
    function $$loadAllFiles() {

      var promises = [];

      forEach(langsFiles, function(value, key) {
        promises.push(staticFilesLoader.get({
          baseUrl: configuration.baseUrl,
          suffix: suffix,
          value: (startWith(value, '/') || endsWith(configuration.baseUrl, '/')) ?
          value : '/' + value,
          key: key
        }));
      });

      return $q.all(promises);
    }

    /**
     * @description
     * bind all values to staticFilesContainer object as a files
     * @return {Array}
     */
    function $$bindValues() {
      return forEach(langsValues || [], function(value) {
        var file = {};
        file[value] = $injector.get(value);
        extend(staticFilesContainer, file);
      });
    }

    /**
     * @description
     * init function
     */
    function $$init() {
      return $$bindValues() && $$loadAllFiles()
        .then($$bindFiles);
    }

    return {
      configuration: configuration,
      get: $$getFile,
      getAll: $$getFiles,
      getUsed: $$getUsed,
      init: $$init,
      use: $$setUsedLanguage
    }

  }];

}
