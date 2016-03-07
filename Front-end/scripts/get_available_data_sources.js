cityApp.directive('uiColorPiker',function($http, lastValueService, sensorTypeService, colorService){
	return {
        restrict: 'E',
        require: 'ngModel',
        scope: false,
        replace: true,
        template: "<div><input class='input-small'/></div>",
        link: function(scope, element, attrs, ngModel) {			
            var input = element.find('input');
            var options = angular.extend({
                color: ngModel.$viewValue,
                change: function(color) {
					
					colorService.add(color);
					
					scope.$apply(function() {
                      ngModel.$setViewValue(color.toHexString());
                    });					
					var sensorTypeAndField = sensorTypeService.return();					
					//alert(sensorTypeAndField.name);					
					var getLastValue = {
						method: 'POST',
						url: 'http://localhost:8080/JDBCService/secondStep',
						headers:{
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: 'serviceCategory='+sensorTypeAndField.type+'&field='+sensorTypeAndField.name
					}

					var lastValueResponse = $http(getLastValue);

					lastValueResponse.success(function(data1){
						
						//alert(data.data);
						//test = data.data;
						lastValueService.add(data1.data);
						//alert(test.value);
						//lastValueService.testM();
						
						
					});
					lastValueResponse.error(function(data){
						alert("last value ERROR");
					});                    
                }
            }, scope.$eval(attrs.options));
            
            ngModel.$render = function() {
              input.spectrum('set', ngModel.$viewValue || '');
            };
            
            input.spectrum(options);
        }
    };
});


cityApp.controller('getAvailableDataSourcesCtrl',function($scope, $http, mapService, sensorTypeService){	
	
	//$scope.coordinates = mapService.return();
	
	$scope.targetColor = '#ebebeb';	
	$scope.getLastValueFunction = function(sensorCategory, name){
		
		sensorTypeService.add(sensorCategory,name);
		
	}
	
	
	$scope.getAvailableDataSources = function(bounds){

		var availableSensors = {
			method: 'POST',
			url: 'http://localhost:8080/JDBCService/firstStep',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data:'minLatitude='+mapService.west+'&minLongitude='+mapService.east+'&maxLatitude='+mapService.south+'&maxLongitude='+mapService.north
		}

		
		var response = $http(availableSensors);
		
		response.success(function(json){
			
			
			$scope.info = json.data;	
			//alert($scope.info);
			
			
		});
		
		response.error(function(data){
			alert("error");
		});
			
	};
});