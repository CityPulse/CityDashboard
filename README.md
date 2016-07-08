# City Dashboard


The CityPulse framework provides immediate and intuitive visual access to the results of its intelligent processing and manipulation of data and events. The ability to record and store historical (cleaned and summarized) data for post-processing makes it possible to analyse the status of the city not only on the go but also at any point in time, enabling diagnosing and “post mortem” analysis of any incidents or relevant situation that might have occurred. To facilitate that, a dashboard for visualising the dynamic data of the smart cities is provided on top of the CityPulse framework. Based on this dashboard, the user has the possibility to visualise a holistic and summarised view of data across multiple contexts or a detailed view of data of interest, as well as to monitor the city life as it evolves and as things happens. The investigation of past city events or incidents can be conducted from different perspectives, e.g. by observing the correlations between various streams, since the streaming data is stored in the framework for a period of time which can be configured, and it can be retrieved for visualisation and analysis at any moment. Figure 16 depicts a screenshot of the CityPulse dashboard application. Here we can see that the user has decided to display with red the average speed and with green and blue the number of cars, respective the total number of parking slots, from a garage. On the map the diameters of circles is changing in real time and it is proportional with the measured value. The graphs presents the evolution of these data sources.


![alt text](https://github.com/CityPulse/CityDashboard/blob/master/PrintScreen.png "City Dashboard")


In order to display the status of the city, the dashboard application connects directly to the resource management or to the data bus for fetching the description of the available streams or the real-time/historic observations. The dashboard application can be used out of the box and there are no configuration or development steps that have to be done by the application developer.

Figure 2 depicts the workflow executed by the CityPulse components when the user wants to visualize the real-time or historic data.
 
![alt text](https://github.com/CityPulse/CityDashboard/blob/master/Dashboard_work_flow.png "CityPulse dashboard workflow")
 
The CityPulse dashboard workflow steps are briefly described below:
*	First, the user has to select an area of interest on the map;
*	When the user clicks the Get available data sources button, a request is made to the geospatial database, which contains the GPS coordinates of the area selected by the user (a list containing all the available sensors and their UUIDs is received);
*	The user selects the data sources which he wants to display on the map (and also pick a colour for their representation). Now a new request is generated to the data federation component in order to receive in real-time the selected data sources observations;
*	After the data federation sends back the responses, the map will be populated with markers for each sensor. The size of the marker is proportional to the observation value and the colour is the one selected by the user previously;
*	If a sensor on the map is selected, a popup will appear that will contain the description of the sensor (its type, field name, coordinates and last value);
*	The user then has three options of displaying the historical data: Show on chart A, B or C from the left side of the dashboard;
*	If one of these 3 options is selected, a request to the resource management will be made for obtaining the historical data for the time period specified in the upper region of the left section of the dashboard;
*	At the end, a graph is going to be created and displayed on the right part of the GUI.

## Other CityPulse framework dependencies

The CityPulse dashboard relies on the following framework components:

*	Resource management for acquiring the stream description.
*	Geospatial data infrastructure for determining the id of the streams located within a certain area.
*	Data federation retrieving real time observations from the streams.

## Component deployment steps and Configuration file

In order to be able to run the application the user will need to have installed an application server like Tomcat or JBoss. The user has only to copy the war file of the backend application and the content of the frontend one in the deployment folder of the server. The backend and the front end application can be found here: https://github.com/CityPulse/CityDashboard .

## Contributers

The City Dashboard was developed as part of the EU project CityPulse. The consortium member Siemens provided the main contributions for this component.


## Authors

* **Cosmin Marin** - (https://github.com/cosminmarin)
