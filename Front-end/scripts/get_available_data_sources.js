cityApp.directive('uiColorPiker',function($http, $rootScope, $route, lastValueService, sensorTypeService, colorService){
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
						url: 'http://131.227.92.55:8008/JDBCService/secondStep',
						headers:{
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: 'serviceCategory='+sensorTypeAndField.type+'&field='+sensorTypeAndField.name
					}
                    
					var lastValueResponse = $http(getLastValue);
                    
					lastValueResponse.success(function(data1){
						lastValueService.add(data1.data);	
					});
					lastValueResponse.error(function(data){
						alert("Error: Problems parsing the request answer");
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


cityApp.controller('getAvailableDataSourcesCtrl',function($scope, $http, $rootScope, $route, mapService, sensorTypeService, mapCenter){	
	
     $scope.cityes = [
        {city : "Aarhus"},
        {city : "Wien"},
        {city : "Brasov"},
        {city : "Stockholm"},
        {city : "Kista"}
    ];
    
    $scope.resetButtonShow;
    
    
	//$scope.coordinates = mapService.return();
    $scope.resetAll = function () {
        //$route.reload();
            
        $rootScope.$broadcast('resetCharts');	
        $rootScope.$broadcast('resetMap');
        
        $scope.info = null;
        $scope.resetButtonShow = false;
  
    }
    
    
	$scope.targetColor = '#ebebeb';	
	$scope.getLastValueFunction = function(sensorCategory, name, trueValue){
		
        if(true)
        {
            if(!trueValue)
                {
                    //$rootScope.$broadcast('resetMap');	
                }

            if(sensorCategory == "Aarhus Road Traffic")
                {
                    sensorCategory = sensorCategory.replace("Aarhus Road Traffic", "Aarhus_Road_Traffic");
                }
            if(sensorCategory == "Aarhus Road Parking")
                {
                    sensorCategory = sensorCategory.replace("Aarhus Road Parking", "Aarhus_Road_Parking");
                }
            if(name == "  Average speed") 
                {
                    name = name.replace("  Average speed", "avgSpeed");
                }
                if(name == "  Vehicle count") 
                {
                    name = name.replace("  Vehicle count", "vehicleCount");
                }    
            if(name == "  Vehicle count") 
                {
                    name = name.replace("  Vehicle count", "vehicleCount");
                }
            if(name == "  Total spaces") 
                {
                    name = name.replace("  Total spaces", "totalSpaces");
                }                        
            //alert(sensorCategory+", "+name);
            sensorTypeService.add(sensorCategory,name);
        }
    }
	 
    $scope.changeCity = function(selectedCity) {
        mapCenter.add(selectedCity);
        mapCenter.changeCurrentCity();
    }
	
    	
    
	$scope.getAvailableDataSources = function(bounds){

		var availableSensors = {
			method: 'POST',
			url: 'http://131.227.92.55:8008/JDBCService/firstStep',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data:'minLatitude='+mapService.west+'&minLongitude='+mapService.east+'&maxLatitude='+mapService.south+'&maxLongitude='+mapService.north
		}

		
		var response = $http(availableSensors);
		
		response.success(function(json){
			
			$scope.resetButtonShow = true;
			$scope.info = json.data;
            
            
            for(inf in $scope.info)
            {   
                //alert($scope.info[inf].sensorCategory);
                if($scope.info[inf].sensorCategory == "Aarhus_Road_Traffic")
                   {
                      $scope.info[inf].sensorCategory = $scope.info[inf].sensorCategory.replace("Aarhus_Road_Traffic", "Aarhus Road Traffic");
                       
                       for(field in $scope.info[inf].fields_array)
                           {
                              if($scope.info[inf].fields_array[field] == "avgSpeed") 
                                  {
                                      $scope.info[inf].fields_array[field] = $scope.info[inf].fields_array[field].replace("avgSpeed", "  Average speed");
                                  }
                                if($scope.info[inf].fields_array[field] == "vehicleCount") 
                                  {
                                      $scope.info[inf].fields_array[field] = $scope.info[inf].fields_array[field].replace("vehicleCount", "  Vehicle count");
                                  }
                           }
                   }
                if($scope.info[inf].sensorCategory == "Aarhus_Road_Parking")
                   {
                      $scope.info[inf].sensorCategory = $scope.info[inf].sensorCategory.replace("Aarhus_Road_Parking", "Aarhus Road Parking");
                       
                       for(field in $scope.info[inf].fields_array)
                           {
                              if($scope.info[inf].fields_array[field] == "vehicleCount") 
                                  {
                                      $scope.info[inf].fields_array[field] = $scope.info[inf].fields_array[field].replace("vehicleCount", "  Vehicle count");
                                  }
                                if($scope.info[inf].fields_array[field] == "totalSpaces") 
                                  {
                                      $scope.info[inf].fields_array[field] = $scope.info[inf].fields_array[field].replace("totalSpaces", "  Total spaces");
                                  }
                           }
                   }
                
            }
			
			
		});
		
		response.error(function(data){
			alert("Error: Resource Management not woking, no data sources found");
		});
			
	};
});