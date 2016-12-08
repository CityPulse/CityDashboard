cityApp.controller('MapCtrl', function($rootScope, $scope, mapCenter, mapService, lastValueService, colorService, graphicService,sensorTypeService, getHistoricDataServiceForChartA,getHistoricDataServiceForChartB,getHistoricDataServiceForChartC) {
	
    $scope.map = L.map("map").setView([56.15,10.21],16);
    
    
    $scope.$on('changeCityEvent',function(){
		
        var currentCity = mapCenter.return();
        if(currentCity == "Aarhus")
            $scope.map.setView(new L.LatLng(56.15, 10.21), 16);
        if(currentCity == "Wien")
            $scope.map.setView(new L.LatLng(48.206022, 16.373879), 14);
        if(currentCity == "Brasov")
            $scope.map.setView(new L.LatLng(45.653177, 25.604701), 14);
        if(currentCity == "Stockholm")
            $scope.map.setView(new L.LatLng(59.329311, 18.068407), 14);
        if(currentCity == "Kista")
            $scope.map.setView(new L.LatLng(59.399038, 17.950156), 14);
            
				
	});	
		
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a style = "display=none" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo($scope.map);			
	
	
	var i = 0;
	var value = {};
	var lat ={};
	var lng ={};
	var uuid ={};
    var observationTime = {};
	var color ={};
	var type = {};
    var circle = {};
    
    $scope.markers = new L.FeatureGroup();
    
    	
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
                observationTime = lastValueService[i+4];
				color = lastValueService[i+5];
               
				i = i+6;
				
				type = sensorTypeService.name;
				//alert(sensorTypeService.type+'  '+sensorTypeService.name);
				//alert("values: "+value+" lat: "+lat+" lng: "+lng+" uuid: "+uuid);
				
				circle = L.circle([lng, lat],radius=value,{color:colorSelect});		
                circle.bindPopup('Sensor Type: '+sensorTypeService.type+'<br/>Field: '+sensorTypeService.name+'<br/> UUID : '+uuid+' <br/>Coordinates:<br/>  - Latitude: '+lat+' <br/> - Longitude: '+lng+'<br/>Last value: '+valuePP+' at: '+observationTime+'<br/><button name="Show on chart A" id="'+uuid+'***'+color+'##'+type+'" class="trigger">Show on chart A</button><br/><button name="Show on chart B" id="'+uuid+'***'+color+'##'+type+'" class="trigger2">Show on chart B</button><br/><button name="Show on chart C" id="'+uuid+'***'+color+'##'+type+'" class= "trigger3">Show on chart C</button>').addTo($scope.map);
                $scope.markers.addLayer(circle);
        }	
        $scope.map.addLayer($scope.markers);
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
    
    $scope.$on('resetMap', function(){							
		$scope.map.removeLayer($scope.markers);
        $scope.markers = new L.FeatureGroup();
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
