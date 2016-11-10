package com.siemens;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.siemens.streamDetails.Field;
import com.siemens.streamDetails.StreamDescription;

//http://131.227.92.55:8017/api/snapshot?uuid=31dd6e16-c272-564f-a744-1da1f0011ca6&start=01/01/2016&end=02/01/2016&format=json

@WebServlet("/")
public class InterfaceBackendServices extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private HashMap<String, ArrayList<String>> resultSetSensors;
	private HashMap<String, List<String>> sensorAndFields;
	private ArrayList<String> resultSetEvents;
	private ArrayList<String> listOfPollutionTypes = new ArrayList<>();

	public InterfaceBackendServices() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) {

		try {
			response.getWriter().append("Served at: ").append(request.getContextPath());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) {

		response.setHeader("Access-Control-Allow-Origin", "*");

		String servletPath = request.getServletPath();

		// this path will get the unique sensorCategories and their list of
		// fields
		if (servletPath.toUpperCase().equals("/firstStep".toUpperCase())) {
			resultSetSensors = new HashMap<>();
			listOfPollutionTypes = new ArrayList<>();

			String minLatitude, minLongitude, maxLatitude, maxLongitude;

			HashMap<String, List<String>> categoryAndFieldArray = new HashMap<String, List<String>>();
			HashMap<String, List<String>> categoryAndFieldArrayForDashboard = new HashMap<String, List<String>>();

			minLatitude = request.getParameter("minLatitude");
			minLongitude = request.getParameter("minLongitude");
			maxLatitude = request.getParameter("maxLatitude");
			maxLongitude = request.getParameter("maxLongitude");

			// the values will be saved in resultSetSensors and resultSetEvents
			getAllCategoriesOfSensors(minLatitude, minLongitude, maxLatitude, maxLongitude);

			//System.out.println(resultSetSensors);

			for (String category : resultSetSensors.keySet()) {

				// I take the first UUID or that category of sensor
				String firstUUIDforStreamDescription = resultSetSensors.get(category).get(0);

				// get it's list of fields
				//System.out.println(firstUUIDforStreamDescription + " : " + category);
				StreamDescription localStreamDescription = getStreamdescriptionFromJSON(firstUUIDforStreamDescription);
				
				if(localStreamDescription.getStatus().equals("Fail"))
					continue;

				if (localStreamDescription != null) {
					ArrayList<String> fieldsOnDashboard = new ArrayList<String>();

					// I only need the fields that have the ShowOnCityDashboard
					// equal to true
					for (Field field : localStreamDescription.getData().getField_array()) {
						if (field.getShowOnCityDashboard().equals("true")) {
							fieldsOnDashboard.add(field.getName());
						}
					}

					// add a new entry in a HashMap with the key = category and
					// value = list of fields
					categoryAndFieldArray.put(category, fieldsOnDashboard);
				}

			}

			// creating the proper json for the dashboard interface
			categoryAndFieldArrayForDashboard = categoryAndFieldArray;

			if (!listOfPollutionTypes.isEmpty()) {
				for (String pollutionType : listOfPollutionTypes) {
					categoryAndFieldArrayForDashboard.remove("Brasov_Air_Pollution_" + pollutionType);
				}

				categoryAndFieldArrayForDashboard.put("Brasov_Air_Pollution", listOfPollutionTypes);
			}

			//System.out.println("## " + categoryAndFieldArrayForDashboard);
			Gson gson = new Gson();

			try {
				if (sensorAndFields != null) {
					// response.getWriter().append(jsonAsResponse.toString()).append(sensorAndFields.toString());
				} else {
					ArrayList<HashMap<String, Object>> jsonStructureBase = new ArrayList<>();
					HashMap<String, Object> jsonComponent = new HashMap<>();
					HashMap<String, ArrayList<HashMap<String, Object>>> jsonComponentFinal = new HashMap<>();

					for (String sensorType : categoryAndFieldArrayForDashboard.keySet()) {
						jsonComponent = new HashMap<>();
						jsonComponent.put("sensorCategory", sensorType);
						jsonComponent.put("fields_array", categoryAndFieldArrayForDashboard.get(sensorType));
						jsonStructureBase.add(jsonComponent);
					}
					jsonComponentFinal.put("data", jsonStructureBase);
					String jsonAsResponse = gson.toJson(jsonComponentFinal);
					response.getWriter().append(jsonAsResponse.toString());
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		// this path will get all the sensors coordinates of that type and also
		// the last value that they had
		else if (servletPath.toUpperCase().equals("/secondStep".toUpperCase())) {
			HashMap<String, ArrayList<String>> coordinateAndValueLinker = new HashMap<String, ArrayList<String>>();

			String serviceCategory, field;
			StreamDescription streamDescription;

			serviceCategory = request.getParameter("serviceCategory");
			field = request.getParameter("field");

			//System.out.println(serviceCategory);
			//System.out.println(field);

			// getting the coordinates
			// hardcode
			ArrayList<String> listOfUUIDs;

			if (serviceCategory.equals("Brasov_Air_Pollution")) {
				listOfUUIDs = resultSetSensors.get(serviceCategory + "_O3");
			} else {
				listOfUUIDs = resultSetSensors.get(serviceCategory);
			}
			//System.out.println("listOfUUIDs: " + listOfUUIDs);
			//System.out.println("Size of list of uuid's : " + listOfUUIDs.size());

			for (String uuid : listOfUUIDs) {
				streamDescription = getStreamdescriptionFromJSON(uuid);
				ArrayList<String> coordinatesAndLastValue = new ArrayList<>();

				if(streamDescription.getStatus().equals("Fail"))
					continue;
				
				if (streamDescription != null) {
					String coordinates = streamDescription.getData().getLocation();
					String lastValue = getLastValueOfSensor(uuid, field, "value");
					String observationTime = getLastValueOfSensor(uuid, field, "observationResultTime");
					
					

					//System.out.println("LastValue = " + lastValue);

					if (lastValue == null) {
						lastValue = "20";
					}

					if (lastValue != null) {
						String lat = coordinates.substring(0, coordinates.indexOf(","));
						String lng = coordinates.substring(coordinates.indexOf(",") + 1, coordinates.length());

						coordinatesAndLastValue.add(lat);
						coordinatesAndLastValue.add(lng);
						coordinatesAndLastValue.add(lastValue);
						coordinatesAndLastValue.add(observationTime);
						
						//System.out.println(coordinatesAndLastValue);
						coordinateAndValueLinker.put(uuid, coordinatesAndLastValue);
					}
				}
			}

			//System.out.println("coordinateAndValueLinker: " + coordinateAndValueLinker);

			try {
				Gson gson = new Gson();
				ArrayList<HashMap<String, String>> jsonStructureBase = new ArrayList<>();
				HashMap<String, String> jsonComponent = new HashMap<>();
				HashMap<String, ArrayList<HashMap<String, String>>> jsonComponentFinal = new HashMap<>();

				for (String uuid : coordinateAndValueLinker.keySet()) {
					jsonComponent = new HashMap<>();
					jsonComponent.put("uuid", uuid);
					jsonComponent.put("lat", coordinateAndValueLinker.get(uuid).get(0));
					jsonComponent.put("lng", coordinateAndValueLinker.get(uuid).get(1));
					jsonComponent.put("value", coordinateAndValueLinker.get(uuid).get(2));
					jsonComponent.put("observationTime", coordinateAndValueLinker.get(uuid).get(3));
					
					jsonStructureBase.add(jsonComponent);
				}
				jsonComponentFinal.put("data", jsonStructureBase);
				//System.out.println("jsonComponentFinal: " + jsonComponentFinal);
				String jsonAsResponse = gson.toJson(jsonComponentFinal);
				response.getWriter().append(jsonAsResponse.toString());
			} catch (IOException e) {
				e.printStackTrace();
			}

		}
		// path used to get historic data of a particular sensor and field in a
		// specific time interval
		else if (servletPath.toUpperCase().equals("/thirdStep".toUpperCase())) {
			
			boolean next_url_offset = true;
			
			ArrayList<String> listOfValues = new ArrayList<String>();
			ArrayList<String> listOfDates = new ArrayList<String>();
			
			String url = "http://131.227.92.55:8017/api/snapshot_sql2?uuid=UUID_OF_SENSOR&start=START_DATE&end=END_DATE&format=json&offset=OFFSET_VALUE";
			String uuid, dateStart, dateEnd, field, offset = "0";

			uuid = request.getParameter("uuid");
			field = request.getParameter("field");
			dateStart = request.getParameter("dateStart");
			dateEnd = request.getParameter("dateEnd");

			while(next_url_offset==true)
			{
				
				// hardcodare pt poluare
				if ((field.equals("SO2")) || (field.equals("O3")) || (field.equals("PM10")) || (field.equals("NO2"))
						|| (field.equals("CO"))) {
					field = "qualityLevelType";
				}
	
				System.out.println("field: " + field);
				System.out.println("UUID requested : " + uuid);
	
				// getting the url ready
				url = url.replace("UUID_OF_SENSOR", uuid);
				url = url.replace("START_DATE", dateStart);
				url = url.replace("END_DATE", dateEnd);
				url = url.replace("OFFSET_VALUE", offset);
				url = url.replace(url.substring(url.indexOf("offset="), url.length()), "offset="+offset);
	
				System.out.println("url: " + url);
	
				String responseMessage = getResponseFromURL(url);
				//System.out.println("%% " + responseMessage);
				
				JSONObject mainMessage = new JSONObject(responseMessage);
				String next_url = mainMessage.optString("next_url", "ERROR GETTING VALUE");
				
				if(!next_url.equals("ERROR GETTING VALUE"))
				{
					if(!next_url.equals(""))
					{
						int offsetBegining = next_url.indexOf("offset=")+7;
						int offsetEnding = next_url.indexOf("&", offsetBegining);
						
						if(offsetEnding<0)
						{
							offsetEnding = next_url.length();
						}
						
						offset = next_url.substring(offsetBegining, offsetEnding);
						System.out.println("offset= "+offset);
						next_url_offset = true;
						
					}
					else next_url_offset = false;
				}
				else System.out.println("Problems parsing JSON for next_url parameter");
						
				JSONArray jsonarray = mainMessage.getJSONArray("data");
	
				for (int i = 0; i < jsonarray.length(); i++) {
					JSONObject obj = jsonarray.getJSONObject(i);
					//System.out.println("field: " + field);
					JSONObject nestedJson = obj.getJSONObject(field);
	
					//System.out.println("nestedJson: " + nestedJson);
	
					String value = nestedJson.optString("value", "ERROR GETTING VALUE");
					String date = nestedJson.optString("observationSamplingTime", "ERROR GETTING VALUE");
	
					//System.out.println("value: " + value);
					//System.out.println("date: " + date);
	
					if (field.equals("qualityLevelType")) {
						if (value.equals("ERROR GETTING VALUE")) {
							value = "EXCELENT";
						}
					}
	
					if (!value.equals("ERROR GETTING VALUE")) {
						//System.out.println("A");
						if (!date.equals("ERROR GETTING VALUE")) {
							//System.out.println("B");
							//System.out.println("value: " + value);
							//System.out.println("date: " + date);
	
							if (field.equals("qualityLevelType")) {
								Random rn = new Random();
								value = "" + 0 + rn.nextInt(6 - 0 + 1);
							}
	
							listOfValues.add(value);
							listOfDates.add(date);
						}
					}
				}
			}

			try {
				Gson gson = new Gson();
				HashMap<String, ArrayList<String>> jsonComponent = new HashMap<>();
				jsonComponent.put("values", listOfValues);
				jsonComponent.put("date", listOfDates);

				HashMap<String, HashMap<String, ArrayList<String>>> jsonComponentFinal = new HashMap<>();

				jsonComponentFinal.put("data", jsonComponent);

				String jsonAsResponse = gson.toJson(jsonComponentFinal);

				//System.out.println(jsonAsResponse);
				response.getWriter().append(jsonAsResponse.toString());

			} catch (IOException e) {
				e.printStackTrace();
			}

		} 
		
		else if (servletPath.toUpperCase().equals("/fourthStep".toUpperCase())) {

			/*System.out.println("Connecting");
			try {

				connectToMessageBusForSocialMedia();

			} catch (KeyManagementException | NoSuchAlgorithmException | URISyntaxException | IOException
					| TimeoutException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}*/

		}

		else {
			try {
				response.getWriter().append("Invalid servletPath. Check your URL typing.");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	private String getLastValueOfSensor(String uuid, String field, String requestField) {

		String value = null;

		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Calendar cal = Calendar.getInstance();
		String currentDate = dateFormat.format(cal.getTime());

		cal = Calendar.getInstance();
		cal.add(Calendar.DAY_OF_MONTH, -1);
		String pastDate = dateFormat.format(cal.getTime());

		String url = "http://131.227.92.55:8017/api/snapshot_sql2?uuid=UUID_OF_SENSOR&start=START_DATE&end=END_DATE&format=json&last=true&fields=FIELD_NAME";

		url = url.replace("UUID_OF_SENSOR", uuid);
		url = url.replace("START_DATE", pastDate);
		url = url.replace("END_DATE", currentDate);
		url = url.replace("FIELD_NAME", field);

		String responseMessage = getResponseFromURL(url);
		
		/*System.out.println("================== responseMessage ==================");
		System.out.println(responseMessage);
		System.out.println("=====================================================");*/

		System.out.println(url);
		System.out.println("responseMessage: "+responseMessage);
		
		JSONObject mainMessage = new JSONObject(responseMessage);

		JSONArray jsonarray = mainMessage.getJSONArray("data");

		JSONObject obj = jsonarray.getJSONObject(0);
		JSONObject nestedJson = obj.getJSONObject(field);
		value = nestedJson.optString(requestField, "ERROR GETTING VALUE");
		
		//System.out.println(value);

		if (!value.equals("ERROR GETTING VALUE")) {
			System.out.println("Parsed the JSON for field: " + field + " with value : " + value);
			return value;
		}
		
		return null;
	}

	private StreamDescription getStreamdescriptionFromJSON(String streamID) {

		String resourceManagerConnectorIP = "131.227.92.55";
		String resourceManagerConnectorPort = "8017";

		String URLString = "http://#//api/get_description?uuid=";
		URLString = URLString.replace("#", resourceManagerConnectorIP + ":" + resourceManagerConnectorPort);
		URLString = URLString + streamID;

		String message = getResponseFromURL(URLString);

		StreamDescription streamDescription = new StreamDescription();

		try {
			Gson gson = new Gson();
			System.out.println(message);
			streamDescription = gson.fromJson(message, StreamDescription.class);
		} catch (JsonSyntaxException e) {
			e.printStackTrace();
			return null;
		}

		return streamDescription;

	}

	private void getAllCategoriesOfSensors(String minLatitude, String minLongitude, String maxLatitude,
			String maxLongitude) {

		resultSetSensors = new HashMap<String, ArrayList<String>>();
		resultSetEvents = new ArrayList<>();
		ArrayList<String> listOfUUID = new ArrayList<String>();

		java.sql.Connection c = null;
		Statement stmt = null;

		try {
			Class.forName("org.postgresql.Driver");
			c = DriverManager.getConnection("jdbc:postgresql://localhost:5432/cp_traffic", "wp4", "wp4natss!");
			c.setAutoCommit(false);
			System.out.println("Opened database successfully");

			stmt = c.createStatement();

			// First JDBC statement
			ResultSet rs = stmt.executeQuery(
					"SELECT sensor_uuid::varchar, sercvice_category as sercvice_category FROM cp_sensors WHERE geom && ST_MakeEnvelope("
							+ minLatitude + ", " + minLongitude + ", " + maxLatitude + "," + maxLongitude + ", 4326);");

			while (rs.next()) {
				String sensorType = rs.getString("sercvice_category");
				String UUID = rs.getString("sensor_uuid");

				if (sensorType.contains("Brasov_Air_Pollution")) {

					String sensorTypeAbrev = sensorType.substring(sensorType.lastIndexOf("_") + 1, sensorType.length());
					if (!listOfPollutionTypes.contains(sensorTypeAbrev)) {
						listOfPollutionTypes.add(sensorTypeAbrev);
					}

				}

				/*
				 * if(sensorType.contains("Brasov_Air_Pollution")) { sensorType
				 * = "Brasov_Air_Pollution"; }
				 */

				if (!resultSetSensors.containsKey(sensorType)) {

					listOfUUID = new ArrayList<>();
					listOfUUID.add(UUID);

				} else {
					listOfUUID = new ArrayList<>();
					listOfUUID = resultSetSensors.get(sensorType);
					listOfUUID.add(UUID);

				}
				resultSetSensors.put(sensorType, listOfUUID);

			}

			// NEW STATEMENT
			rs = stmt.executeQuery("SELECT event_uuid::varchar FROM cp_event_stream WHERE geom && ST_MakeEnvelope("
					+ minLatitude + ", " + minLongitude + ", " + maxLatitude + "," + maxLongitude + ", 4326);");

			while (rs.next()) {
				String UUID = rs.getString("event_uuid");
				resultSetEvents.add(UUID);
			}

			rs.close();
			stmt.close();
			c.close();

		} catch (Exception e) {
			System.err.println(e.getClass().getName() + ": " + e.getMessage());
			System.exit(0);
		}

		resultSetSensors.remove("testCategory");
		resultSetSensors.remove("Twitter_Aarhus");
	}

	public static String getResponseFromURL(String url) {

		URL urlToConnect = null;
		try {
			urlToConnect = new URL(url);
		} catch (MalformedURLException e1) {
			// logger.error("Could not connect to URL: "+url+" because it was
			// malformed: " +e1);
		}
		HttpURLConnection httpCon = null;
		try {
			httpCon = (HttpURLConnection) urlToConnect.openConnection();
		} catch (IOException e1) {
			// logger.error("Could not open connection: "+e1);
		}
		// set http request headers
		httpCon.addRequestProperty("Host", "www.siemens.com.");
		httpCon.addRequestProperty("Connection", "keep-alive");
		httpCon.addRequestProperty("Cache-Control", "max-age=0");
		httpCon.addRequestProperty("Accept",
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
		httpCon.addRequestProperty("User-Agent",
				"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36");
		httpCon.addRequestProperty("Accept-Encoding", "gzip,deflate,sdch");
		httpCon.addRequestProperty("Accept-Language", "en-US,en;q=0.8");
		HttpURLConnection.setFollowRedirects(false);
		httpCon.setInstanceFollowRedirects(false);
		httpCon.setDoOutput(true);
		httpCon.setUseCaches(true);

		try {
			httpCon.setRequestMethod("GET");
		} catch (ProtocolException e1) {
			// logger.error("Could not set GET protocol: "+e1);
			e1.printStackTrace();
		}

		BufferedReader in;
		StringBuilder message = null;
		try {
			in = new BufferedReader(new InputStreamReader(httpCon.getInputStream(), "UTF-8"));
			String inputLine;
			message = new StringBuilder();

			while ((inputLine = in.readLine()) != null)
				message.append(inputLine);
			in.close();
		} catch (UnsupportedEncodingException e1) {
			// logger.error("The encoding was not supported: "+e1);
		} catch (IOException e1) {
			// logger.error("Could not read from BufferedReader: "+e1);
		}

		httpCon.disconnect();

		return message.toString();
	}

	/*public static void connectToMessageBusForSocialMedia()
			throws KeyManagementException, NoSuchAlgorithmException, URISyntaxException, IOException, TimeoutException {

		ConnectionFactory factory = new ConnectionFactory();

		factory.setHost("131.227.92.55");
		factory.setPort(8007);

		Connection connection = factory.newConnection();
		Channel channel = connection.createChannel();

		String queueName = channel.queueDeclare().getQueue();

		channel.queueBind(queueName, "events", "Aarhus.Twitter.CrimeEvent");
		channel.queueBind(queueName, "events", "Aarhus.Twitter.SocialEvent");
		channel.queueBind(queueName, "events", "Aarhus.Twitter.CulturalEvent");
		channel.queueBind(queueName, "events", "Aarhus.Twitter.TransportationEvent");
		channel.queueBind(queueName, "events", "Aarhus.Twitter.HealthEvent");
		channel.queueBind(queueName, "events", "Aarhus.Twitter.SportEvent");
		channel.queueBind(queueName, "events", "Aarhus.Twitter.EnvironmentalEvent");
		channel.queueBind(queueName, "events", "Aarhus.Twitter.FoodEvent");

		Consumer consumer = new DefaultConsumer(channel) {

			@Override
			public void handleDelivery(String consumer, Envelope envelope, AMQP.BasicProperties properties, byte[] body)
					throws IOException {
				String message = new String(body, "UTF-8");

				//System.out.println(message);
			}
		};
		channel.basicConsume(queueName, true, consumer);

	}*/

}
