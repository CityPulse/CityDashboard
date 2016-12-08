cityApp.controller('graphicCtrl', function($scope,$http, $rootScope,colorService,getHistoricDataServiceForChartA,getHistoricDataServiceForChartB,getHistoricDataServiceForChartC,sensorTypeService){
	
	$scope.test = [10,10,100];
    
    /*current date */
    var today = new Date();
    
	$scope.color ={};
	
	$scope.startDate = {
        value: new Date(today.getFullYear(), today.getMonth(), today.getDate()-1, today.getHours(), today.getMinutes())
      };
	$scope.endDate = {
        value: new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes())
      };
	
	
	//for chart A
	$scope.getHistoricDataA = function(){
        
        var dateStartVar = new Date($('#date-input-start').val()); 
        var dateEndVar = new Date($('#date-input-end').val());
        
		var fullDateStart = dateStartVar.getFullYear()+"/"+zeroPadded(dateStartVar.getMonth() + 1)+"/"+zeroPadded(dateStartVar.getDate())+"T"+zeroPadded(dateStartVar.getHours()-3)+":"+zeroPadded(dateStartVar.getMinutes())+":"+zeroPadded(dateStartVar.getSeconds());
        
        var fullDateEnd = dateEndVar.getFullYear()+"/"+zeroPadded(dateEndVar.getMonth() + 1)+"/"+zeroPadded(dateEndVar.getDate())+"T"+zeroPadded(dateEndVar.getHours()-3)+":"+zeroPadded(dateEndVar.getMinutes())+":"+zeroPadded(dateEndVar.getSeconds());
        
            
        /*alert(fullDateStart+"   |   "+fullDateEnd);*/
    
		
		var responseFromHistoricData = getHistoricDataServiceForChartA.return();
		//alert("responseFromHistoricData "+responseFromHistoricData);
		var uuidForRequest = responseFromHistoricData.substring(0,responseFromHistoricData.indexOf("***"));
		//alert("uuidForRequest "+uuidForRequest);
		var parsedColor = responseFromHistoricData.substring(responseFromHistoricData.indexOf("***")+3,responseFromHistoricData.indexOf("##"));
		
		var fieldFromRequest = responseFromHistoricData.substring(responseFromHistoricData.indexOf("##")+2, responseFromHistoricData.lenght);
		$scope.color = parsedColor;
		
		var historicData = {
		            
			method: 'POST',
			url: 'http://131.227.92.55:8008/JDBCService/thirdStep',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'uuid='+uuidForRequest+'&field='+fieldFromRequest+'&dateStart='+fullDateStart+'&dateEnd='+fullDateEnd
		}
		
		var response = $http(historicData);

		response.success(function(data){
			$scope.historicData = data.data;
			
			$scope.updateChart1();
		});
		response.error(function(data){
			alert("Error: Problems updating the chart with the received data");
		});
	
		
	}
	
    function zeroPadded(val) {
        if (val >= 10)
            return val;
        else
            return '0' + val;
    }
	
	
	//for chart B
	
	$scope.getHistoricDataB = function(){
        
        var dateStartVar = new Date($('#date-input-start').val()); 
        var dateEndVar = new Date($('#date-input-end').val());
        
		var fullDateStart = dateStartVar.getFullYear()+"/"+zeroPadded(dateStartVar.getMonth() + 1)+"/"+zeroPadded(dateStartVar.getDate())+"T"+zeroPadded(dateStartVar.getHours()-3)+":"+zeroPadded(dateStartVar.getMinutes())+":"+zeroPadded(dateStartVar.getSeconds());
        
        var fullDateEnd = dateEndVar.getFullYear()+"/"+zeroPadded(dateEndVar.getMonth() + 1)+"/"+zeroPadded(dateEndVar.getDate())+"T"+zeroPadded(dateEndVar.getHours()-3)+":"+zeroPadded(dateEndVar.getMinutes())+":"+zeroPadded(dateEndVar.getSeconds());
        
		
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
			url: 'http://131.227.92.55:8008/JDBCService/thirdStep',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'uuid='+uuidForRequest+'&field='+fieldFromRequest+'&dateStart='+fullDateStart+'&dateEnd='+fullDateEnd
		}

		var response = $http(historicData);

		response.success(function(data){
			$scope.historicData = data.data;
			
			$scope.updateChart2();
		});
		response.error(function(data){
			alert("Error: Problems updating the chart with the received data");
		});
	
		
	}
	
	
	//for chart C
	
	$scope.getHistoricDataC = function(){
        
        var dateStartVar = new Date($('#date-input-start').val()); 
        var dateEndVar = new Date($('#date-input-end').val());
        
		var fullDateStart = dateStartVar.getFullYear()+"/"+zeroPadded(dateStartVar.getMonth() + 1)+"/"+zeroPadded(dateStartVar.getDate())+"T"+zeroPadded(dateStartVar.getHours()-3)+":"+zeroPadded(dateStartVar.getMinutes())+":"+zeroPadded(dateStartVar.getSeconds());
        
        var fullDateEnd = dateEndVar.getFullYear()+"/"+zeroPadded(dateEndVar.getMonth() + 1)+"/"+zeroPadded(dateEndVar.getDate())+"T"+zeroPadded(dateEndVar.getHours()-3)+":"+zeroPadded(dateEndVar.getMinutes())+":"+zeroPadded(dateEndVar.getSeconds());
        
		
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
			url: 'http://131.227.92.55:8008/JDBCService/thirdStep', //http://131.227.92.55:8008
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'uuid='+uuidForRequest+'&field='+fieldFromRequest+'&dateStart='+fullDateStart+'&dateEnd='+fullDateEnd
		}

		var response = $http(historicData);

		response.success(function(data){
			$scope.historicData = data.data;
			
			$scope.updateChart3();
		});
		response.error(function(data){
			alert("Error: Problems updating the chart with the received data");
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
                        categories: ['00:00:00','00:00:00'],
                        
                        labels:{
                            enabled:true//default is true
                        }
                    },
                    series: [{
                        data: [0,0],
                        marker: {
                            symbol: 'square'
                        }
                        
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
				data: $scope.historicData.values.map(Number),
                marker: {
                     symbol: 'square'
                }
			}]
			
		};
		
		
	};
    
    $scope.resetCharts = function(){
        
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
                color: '#7cb5ec',
				data: [0,0],
                marker: {
                     symbol: 'square'
                }
			}]
			
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
                color: '#7cb5ec',
				data: [0,0],
                marker: {
                     symbol: 'square'
                }
			}]
			
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
                color: '#7cb5ec',
				data: [0,0],
                marker: {
                     symbol: 'square'
                }
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
                        categories: ['00:00:00','00:00:00'],
                        labels:{
                            enabled:true//default is true
                        }
                    },
                    series: [{
                        data: [0,0],
                        marker: {
                            symbol: 'square'
                        }
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
				data: $scope.historicData.values.map(Number),
                marker: {
                     symbol: 'square'
                }
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
                        categories: ['00:00:00','00:00:00'],
                        labels:{
                            enabled:true//default is true
                        }
                    },
                    series: [{
                        data: [0,0],
                        marker: {
                            symbol: 'square'
                        }
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
				data: $scope.historicData.values.map(Number),
                marker: {
                     symbol: 'square'
                }
			}]
			
		};
		
		
	};
    
    $scope.$on('resetCharts', function(){					
		$scope.resetCharts();
	});
	
	
});