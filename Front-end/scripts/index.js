var cityApp = angular.module('cityDashboard', ['ngRoute','leaflet-directive','highcharts-ng']);

cityApp.factory('mapService',function(){
	
	var mapBounds = {};
	//var lastValue = {};
	
 	mapBounds.north = 56.15493802365562;
	mapBounds.east = 56.15015739469195;
	mapBounds.south = 10.217703580856323;
	mapBounds.west = 10.207672119140625;
	
	mapBounds.add = function(north,east,south,west){
		
		mapBounds.north = north;
		mapBounds.east = east;
		mapBounds.south = south;
		mapBounds.west = west;			
	}
	return mapBounds;
	
});

cityApp.factory('lastValueService',function($rootScope,colorService){
	
	var lastValue =[];
	var value = {};
	var lat ={};
	var lng ={};
	var uuids ={};
    var observationTime ={};
	var color = {};

	
	lastValue.add = function(data){		
		
		color = colorService.return();
		data.forEach(function(item){		
			lastValue.push(item.value,item.lat,item.lng,item.uuid,item.observationTime,color);			
		});
		
		$rootScope.$broadcast('mapEvent',{
		});	
	}	
	return lastValue;
});

cityApp.factory('sensorTypeService',function(){
	
	var getLastValue = {};
	
	
    getLastValue.add = function(type, name){	
			getLastValue.name = name;
			getLastValue.type = type;
    }
    
	getLastValue.return = function(){
		
		return getLastValue;		
	}	
	return getLastValue;
});

cityApp.factory('mapCenter',function($rootScope){
	
	var currentCity = {};
	
	
    currentCity.add = function(city){	
			currentCity = city;
    }
    
    currentCity.changeCurrentCity = function (currentCity) {
        $rootScope.$broadcast('changeCityEvent');	
    }
    
	currentCity.return = function(){
		
		return currentCity;		
	}	
	return currentCity;
});

cityApp.factory('colorService',function(){
	
	var sensorColor = {};
    
	
	sensorColor.add = function(color){
		sensorColor = color;
	}
	sensorColor.return=function(){
        
		return sensorColor;
	}
	return sensorColor;
});


cityApp.factory('graphicService',function(){
	
	var graphicData = [];
	
	graphicData.add = function(data){
		
		data.forEach(function(item){
			graphicData.push(item);
		});
	}
	
	return graphicData;
});


cityApp.factory('getHistoricDataServiceForChartA',function($rootScope){
	
	var historicData1 ={};
	historicData1.add = function(uuid){
		//alert("historic data service AAAAAA +uuid: "+uuid);
		
		historicData1 = uuid;		
		$rootScope.$broadcast('popupClickEvent1',{		
		});		
	}	
	historicData1.return= function(){
		return historicData1;
	}
	return historicData1;
});

cityApp.factory('getHistoricDataServiceForChartB',function($rootScope){
	
	var historicData2 ={};
	historicData2.add = function(uuid){
		historicData2 = uuid;
		
		$rootScope.$broadcast('popupClickEvent2',{		
		});		
	}
	
	historicData2.return= function(){
		return historicData2;
	}	
	return historicData2;
});

cityApp.factory('getHistoricDataServiceForChartC',function($rootScope){
	
	var historicData3 ={};
	historicData3.add = function(uuid){
		historicData3 = uuid;		
		$rootScope.$broadcast('popupClickEvent3',{		
		});		
	}	
	historicData3.return= function(){
		return historicData3;
	}	
	return historicData3;
});

cityApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
      when('/cityDashboard', {templateUrl: 'templates/cityDashboard.html',   controller: CityDashboardCtrl }).  
      otherwise({redirectTo: '/cityDashboard'});    
}]);

cityApp.controller('TabsCtrl',function($scope, $location) {
  $scope.tabs = [
      { link : '#/cityDashboard', label : 'City Dashboard' },      
    ]; 
    
  $scope.selectedTab = $scope.tabs[0];    
  $scope.setSelectedTab = function(tab) {
    $scope.selectedTab = tab;
  }
  
  $scope.tabClass = function(tab) {
    if ($scope.selectedTab == tab) {
      return "active";
    } else {
      return "";
    }
  }
});



function CityDashboardCtrl($scope) {
  
}

