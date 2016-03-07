cityApp.controller('MapCtrl', function($rootScope, $scope, mapService, lastValueService, colorService, graphicService,sensorTypeService, getHistoricDataServiceForChartA,getHistoricDataServiceForChartB,getHistoricDataServiceForChartC) {
	
	$scope.map = L.map("map").setView([56.15,10.21],16);
		
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a style = "display=none" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo($scope.map);			
	
	
	var i = 0;
	var value = {};
	var lat ={};
	var lng ={};
	var uuid ={};
	var color ={};
	var type = {};
	
	$scope.addCirclesOnMap = function(){		
		
		var colorSelect = colorService.return();
	
		while(i < lastValueService.length)
			{
				value = lastValueService[i];
				valuePP = value;
				if(value > 100){
					value = 100;
				}
				
				lat = lastValueService[i+1];
				lng = lastValueService[i+2];
				uuid = lastValueService[i+3];
				color = lastValueService[i+4];
				i = i+5;
				
				type = sensorTypeService.name;
				//alert(sensorTypeService.type+'  '+sensorTypeService.name);
				//alert("values: "+value+" lat: "+lat+" lng: "+lng+" uuid: "+uuid);
				
				L.circle([lng, lat],radius=value,{color:colorSelect}).bindPopup('Sensor Type: '+sensorTypeService.type+'<br/>Field: '+sensorTypeService.name+'<br/>Coordinates:<br/> UUID : '+uuid+' <br/>Coordinates:<br/>  - Latitude: '+lat+' <br/> - Longitude: '+lng+'<br/>Last value: '+valuePP+'<br/><button name="Show on chart A" id="'+uuid+'***'+color+'##'+type+'" class="trigger">Show on chart A</button><br/><button name="Show on chart B" id="'+uuid+'***'+color+'##'+type+'" class="trigger2">Show on chart B</button><br/><button name="Show on chart C" id="'+uuid+'***'+color+'##'+type+'" class= "trigger3">Show on chart C</button>').addTo($scope.map);				
			}		
	};
//=======================================================================	
	$('#map').on('click', '.trigger', function() {
	   $rootScope.$broadcast('button1Pressed');		
	});	
	$scope.$on('button1Pressed', function(){					
		var uuid2={};		
		$(document).ready(function(){
			uuid2 = $("*[name='Show on chart A']").attr('id');
		});
		var historicData1 = getHistoricDataServiceForChartA.add(uuid2);		
	});
	
//=======================================================================		
	$('#map').on('click', '.trigger2', function() {
	   $rootScope.$broadcast('button2Pressed');		
	});
	$scope.$on('button2Pressed', function(){					
		var uuid3={};		
		$(document).ready(function(){
			uuid3 = $("*[name='Show on chart B']").attr('id');
		});
		
		var historicData2 = getHistoricDataServiceForChartB.add(uuid3);		
		
	});
	
//=======================================================================	
	
	$('#map').on('click', '.trigger3', function() {
	   $rootScope.$broadcast('button3Pressed');		
	});	
	$scope.$on('button3Pressed', function(){					
		var uuid4={};		
		$(document).ready(function(){
			uuid4 = $("*[name='Show on chart C']").attr('id');
		});
		var historicData3 = getHistoricDataServiceForChartC.add(uuid4);		
	});	

	$scope.$on('mapEvent',function(event,data){
		$scope.addCirclesOnMap();
	});
	
	
	var north = {};
	var south = {};
	var east = {};
	var west = {};
	
	$scope.map.on('moveend',function(){
		
		north = $scope.map.getBounds().getNorth();
		south = $scope.map.getBounds().getSouth();
		east = $scope.map.getBounds().getEast();
		west = $scope.map.getBounds().getWest();
		
		console.log(north +' '+ south +' '+ east +' '+ west);
		
		mapService.add(north,south,east,west);

	});
});
