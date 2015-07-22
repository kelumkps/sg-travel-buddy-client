'use strict';

angular.module('SGTravelBuddy.translator', [
    'app.i18n',
    'pascalprecht.translate'// angular-translate
]).config(['$translateProvider', function ($translateProvider) {
    $translateProvider
        .useMissingTranslationHandlerLog()
        .fallbackLanguage('en_US')
        .preferredLanguage('en_US')
        .useSanitizeValueStrategy('escape')
        .useStaticFilesLoader({
            prefix: 'i18n/language-',// path to translations files
            suffix: '.json'// suffix, currently- extension of the translations
        })
        .useLoaderCache('$translationCache');
    //  $translateProvider.useLocalStorage();// saves selected language to localStorage
}]);
