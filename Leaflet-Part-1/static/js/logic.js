
// Use this link to get the GeoJSON data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Initiate the map object
var myMap = L.map("map", {
  center: [28.75, 0],
  zoom: 3
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create function that will determine the color of a earthquake location based on the depth of the earthquake
function chooseColor(depth) {
  if (depth >= 90) return 'green';
  else if (depth >= 70) return 'blue';
  else if (depth >= 50) return 'purple';
  else if (depth >= 30) return 'yellow';
  else if (depth >=10) return 'orange';
  else return 'red';    
  
}

// Getting GeoJson data
d3.json(link, function(data) {
  // Create a GeoJSON layer with the retrieved data 
  L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
          return new L.CircleMarker(latlng, {
            // Set radius to the magnitude of earthquake and multiply by 3 to make it visible
            radius: feature.properties.mag*5, 
            color: 'black',
            // Set the fill color to the depth of the earthquake (depth of the earth is the third coordinate for each earthquake)
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.5,
            weight: 0.2    
          });
      },

      // Bind a popup (provides location, magnitude and depth of the earthquake when its associated marker is clicked) to each layer
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<h3> Location:" + feature.properties.place+ "</h3><hr> Magnitude: " +
          feature.properties.mag + "<br /><br />Depth:" + feature.geometry.coordinates[2]);
    }

  }).addTo(myMap);

      // Create legend for the map
      var legend = L.control({position: 'bottomright'});

      legend.onAdd = function(map) {
  
          var div = L.DomUtil.create('div', 'info legend');
              div.innerHTML += "<h4>Earthquake Depth (km)</h4>";
              div.innerHTML += '<i class="circle" style="background-color:green"></i><span>More Than 90</span><br>';
              div.innerHTML += '<i style="background: blue"></i><span>70-90</span><br>';
              div.innerHTML += '<i style="background: purple"></i><span>50-70</span><br>';
              div.innerHTML += '<i style="background: yellow"></i><span>30-50</span><br>';
              div.innerHTML += '<i style="background: orange"></i><span>10-30</span><br>';
              div.innerHTML += '<i style="background: red"></i><span>Less Than 10</span><br>';
              return div;
  
      };
    // Add legend to map
      legend.addTo(myMap);
  
    });