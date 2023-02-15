// Level 1: Basic Visualization
// 1. **Get your data set**
// The USGS provides earthquake data in a number of different formats, updated every 5 minutes. 
// Visit the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page and pick a data set to visualize. 
// When you click on a data set, for example 'All Earthquakes from the Past 7 Days', 
// you will be given a JSON representation of that data. You will be using the URL of this JSON to pull in the data for our visualization.

// 2. **Import & Visualize the Data**
// Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
// Your data markers should reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes should appear larger and darker in color.
// Include popups that provide additional information about the earthquake when a marker is clicked.
// Create a legend that will provide context for your map data.
// Your visualization should look something like the map above.

// Creat map Object
var myMap = L.map("map", {
  center: [42.1888, -120.3458],
  zoom: 3,
});

// Adding tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  // id: "mapbox/streets-v11",
}).addTo(myMap);

// Storing API query variable
// Storing the geojson data url for all earthquakes from the past 7 days
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grabbing the geoData with d3
d3.json(geoData).then(function (data) {
  // console.log(geoData);


  // Your data markers should reflect the magnitude of the earthquake in their size and color. 
  // Earthquakes with higher magnitudes should appear larger and darker in color.

  // Creating a function that will determine color of the marker as the "magnitude" is high or lower
  function choosemagColor(magnitude) {
      switch (true) {
          case magnitude > 5:
              return "rgb(193, 81, 88)";
          case magnitude > 4:
              return "rgb(193, 81, 161)";
          case magnitude > 3:
              return "rgb(158, 81, 193)";
          case magnitude > 2:
              return "rgb(81, 90, 193)";
          case magnitude > 1:
              return "rgb(81, 171, 193)";
          default:
              return "rgb(81, 193, 128)";
      }
  };
  // Creating a function to determine the size of the marker as the "magnitude" is higher or lower
  function choosemagSize(magnitude) {
      switch (true) {
          case magnitude > 5:
              return 30;
          case magnitude > 4:
              return 24;
          case magnitude > 3:
              return 18;
          case magnitude > 2:
              return 12;
          case magnitude > 1:
              return 6;
          default:
              return 3;
      }
  };

  // Creating a function to determine the the style of the marker as the "magnitude" is higher or lower

  function stylemag(feature) {
      return {
          opacity: 100,
          fillColor: choosemagColor(feature.properties.mag),
          color: "Black",
          radius: choosemagSize(feature.properties.mag),
          stroke: true,
          weight: 0.25

      };
  };

  // Creating a layer of GeoJSON data to contain the array of the created features
  L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
      },
      // Adding marker style created
      style: stylemag,

      // Binding a Popup for the location, date, time, and the magnitude of the earthquake
      onEachFeature: function (feature, layer) {
          layer.bindPopup(
              "<h4>Location: " + feature.properties.place + "</h4><hr><p>Date/Time: " +
              new Date(feature.properties.time) + "</p><hr><p>Magnitude: " +
              feature.properties.mag + "</p>"
          );
      }
  }).addTo(myMap);

  // Setting up the legend for the map
  var legend = L.control({
      position: "upright"
  });
  legend.onAdd = function () {

      var div = L.DomUtil.create("div", "info legend");
      var magLevels = [0, 1, 2, 3, 4, 5];

      // Looping through the magnitude to generate a label 
      for (var i = 0; i < magLevels.length; i++) {
          div.innerHTML +=
              '<i style="background: ' + choosemagColor(magLevels[i] + 1) + '"></i> ' +
              magLevels[i] + (magLevels[i + 1] ? '&ndash;' + magLevels[i + 1] + '<br>' : '+');
      }
      console.log(div);
      return div;

  };

  // Adding legend to the map
  legend.addTo(myMap);
});