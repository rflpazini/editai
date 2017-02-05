var myApp = angular.module('editai-upload', ['blueimp.fileupload'])
    .config([
        '$httpProvider', 'fileUploadProvider',
        function($httpProvider, fileUploadProvider) {
            angular.extend(fileUploadProvider.defaults, {
                disableImageResize: /Android(?!.*Chrome)|Opera/
                    .test(window.navigator.userAgent)
            });
        }
    ]);

(function(app) {
    var url = 'https://upload.wistia.com/',
        apiPasswordParam = '?api_password=',
        token = 'f3f4b2f8b313c1de29f00263c58940c32f2c4952072e38f8d53aa920be4b1023';

    app.controller('UploadController', ['$scope', '$http', '$filter', '$window',
        function($scope, $http, $window) {
            $scope.added = false;
            $scope.fileID = "";

            $scope.options = {
                url: url + apiPasswordParam + token
            };

            $scope.loadingFiles = true;
            $scope.$on('fileuploaddone', function(event, fileResult) {
                $("#form").addClass("load");
                $scope.fileID = fileResult.result.hashed_id;
                $("#pay").removeClass("load");
                localStorage.removeItem('proj-name');
                localStorage.removeItem('proj-comment');

            });

            $scope.$on('fileuploadadd', function(event, argument) {
                console.log("ADDED - " + argument);
                $("section").removeClass("load");
                $scope.added = true;
                localStorage.setItem('proj-name', $("#proj-name").val());
                localStorage.setItem('proj-comment', $("#proj-comment").val());
                
            });

            $scope.$on('fileuploadfail', function(eventm, argument) {
                $scope.added = false;
            });
        }
    ]);
})(myApp);
