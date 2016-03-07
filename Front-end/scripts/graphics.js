cityApp.controller('graphicCtrl', function($scope,$http,colorService,getHistoricDataServiceForChartA,getHistoricDataServiceForChartB,getHistoricDataServiceForChartC,sensorTypeService){
	
	$scope.test = [10,10,100];
	
	$scope.color ={};
	
	$scope.startDate = '19/02/2016T12:00:00';
	$scope.endDate = '19/02/2016T20:00:00';
	
	
	//for chart A
	$scope.getHistoricDataA = function(){
		
		
		var responseFromHistoricData = getHistoricDataServiceForChartA.return();
		//alert("responseFromHistoricData "+responseFromHistoricData);
		var uuidForRequest = responseFromHistoricData.substring(0,responseFromHistoricData.indexOf("***"));
		//alert("uuidForRequest "+uuidForRequest);
		var parsedColor = responseFromHistoricData.substring(responseFromHistoricData.indexOf("***")+3,responseFromHistoricData.indexOf("##"));
		
		var fieldFromRequest = responseFromHistoricData.substring(responseFromHistoricData.indexOf("##")+2, responseFromHistoricData.lenght);
		$scope.color = parsedColor;
		
		var historicData = {
		
			method: 'POST',
			url: 'http://localhost:8080/JDBCService/thirdStep',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'uuid='+uuidForRequest+'&field='+fieldFromRequest+'&dateStart='+$scope.startDate+'&dateEnd='+$scope.endDate
		}
		
		var response = $http(historicData);

		response.success(function(data){
			$scope.historicData = data.data;
			
			$scope.updateChart1();
		});
		response.error(function(data){
			alert("error");
		});
	
		
	}
	
	
	
	//for chart B
	
	$scope.getHistoricDataB = function(){
		
		var responseFromHistoricData = getHistoricDataServiceForChartB.return();
		//alert("responseFromHistoricData "+responseFromHistoricData);
		var uuidForRequest = responseFromHistoricData.substring(0,responseFromHistoricData.indexOf("***"));
		//alert("uuidForRequest "+uuidForRequest);
		var parsedColor = responseFromHistoricData.substring(responseFromHistoricData.indexOf("***")+3,responseFromHistoricData.indexOf("##"));
		
		var fieldFromRequest = responseFromHistoricData.substring(responseFromHistoricData.indexOf("##")+2, responseFromHistoricData.lenght);
		$scope.color = parsedColor;
		//alert("fieldFromRequest "+fieldFromRequest);
		//alert("parsedColor "+parsedColor);
		
		var historicData = {
		
			method: 'POST',
			url: 'http://localhost:8080/JDBCService/thirdStep',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'uuid='+uuidForRequest+'&field='+fieldFromRequest+'&dateStart='+$scope.startDate+'&dateEnd='+$scope.endDate
		}

		var response = $http(historicData);

		response.success(function(data){
			$scope.historicData = data.data;
			
			$scope.updateChart2();
		});
		response.error(function(data){
			alert("error");
		});
	
		
	}
	
	
	//for chart C
	
	$scope.getHistoricDataC = function(){
		
		var responseFromHistoricData = getHistoricDataServiceForChartC.return();
		//alert("responseFromHistoricData "+responseFromHistoricData);
		var uuidForRequest = responseFromHistoricData.substring(0,responseFromHistoricData.indexOf("***"));
		//alert("uuidForRequest "+uuidForRequest);
		var parsedColor = responseFromHistoricData.substring(responseFromHistoricData.indexOf("***")+3,responseFromHistoricData.indexOf("##"));
		
		var fieldFromRequest = responseFromHistoricData.substring(responseFromHistoricData.indexOf("##")+2, responseFromHistoricData.lenght);
		$scope.color = parsedColor;
		//alert("fieldFromRequest "+fieldFromRequest);
		//alert("parsedColor "+parsedColor);
		
		var historicData = {
		
			method: 'POST',
			url: 'http://localhost:8080/JDBCService/thirdStep',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'uuid='+uuidForRequest+'&field='+fieldFromRequest+'&dateStart='+$scope.startDate+'&dateEnd='+$scope.endDate
		}

		var response = $http(historicData);

		response.success(function(data){
			$scope.historicData = data.data;
			
			$scope.updateChart3();
		});
		response.error(function(data){
			alert("error");
		});
	
		
	}		
	$scope.$on('popupClickEvent1',function(event,data){
		
	//	alert("popup event 1!!!!!!");
		$scope.getHistoricDataA();

		
	});	
	$scope.$on('popupClickEvent2',function(event,data){	
		
		$scope.getHistoricDataB();

		
	});
	
	$scope.$on('popupClickEvent3',function(event,data){
		
		
		$scope.getHistoricDataC();

		
	});
	//char A
	
	 $scope.chartOptions1 = {
		 			chart: {
						renderTo: 'chart1'            			
					},
                    title: {
                        text: 'Chart A'
                    },
                    xAxis: {
                        categories: ['00:00:00','00:00:00']
                    },
                    series: [{
                        data: [0,0]
                    }]
                }	
	
	$scope.updateChart1 = function(){
		
		//alert($scope.color);
		
		$scope.chartOptions1 = {
			chart: {
						renderTo: 'chart1'
					},
			title: {
				text: 'Chart A'
			},
			xAxis: {
				categories: $scope.historicData.date
			},

			series: [{
				color: $scope.color.toString(), 
				data: $scope.historicData.values.map(Number)
			}]
			
		};
		
		
	};
	
	$scope.chartOptions2 = {
		 			chart: {
						renderTo: 'chart2'       
					},
                    title: {
                        text: 'Chart B'
                    },
                    xAxis: {
                        categories: ['00:00:00','00:00:00']
                    },
                    series: [{
                        data: [0,0]
                    }]
                }
	
	$scope.updateChart2 = function(){
		
		//alert($scope.color);
		
		$scope.chartOptions2 = {
			chart: {
						renderTo: 'chart1'
					},
			title: {
				text: 'Chart B'
			},
			xAxis: {
				categories: $scope.historicData.date
			},

			series: [{
				color: $scope.color.toString(), 
				data: $scope.historicData.values.map(Number)
			}]
			
		};
		
		
	};
	
	$scope.chartOptions3 = {
		 			chart: {
						renderTo: 'chart3'
					},
                    title: {
                        text: 'Chart C'
                    },
                    xAxis: {
                        categories: ['00:00:00','00:00:00']
                    },
                    series: [{
                        data: [0,0]
                    }]
                }
	$scope.updateChart3 = function(){
		
		//alert($scope.color);
		
		$scope.chartOptions3 = {
			chart: {
						renderTo: 'chart3'
					},
			title: {
				text: 'Chart C'
			},
			xAxis: {
				categories: $scope.historicData.date
			},

			series: [{
				color: $scope.color.toString(), 
				data: $scope.historicData.values.map(Number)
			}]
			
		};
		
		
	};
	
	
});