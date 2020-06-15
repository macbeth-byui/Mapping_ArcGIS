require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
  ], function(Map, MapView, Graphic, GraphicsLayer) {

        // Select the topographic map
        var map = new Map({
            basemap: "topo-vector"
        });

        // Center over Rexburg, ID with zoom level 5
        var view = new MapView({
            container: "viewDiv",
            map: map,
            center: [-111.7896876, 43.8260227], // longitude, latitude
            zoom: 3
        });

        // Create a Graphics Layer which can be used to draw graphics
        var graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        // Read USGS JSON data and put markers on the map
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                data.features.forEach(function(feature, index) {

                    // Define location to draw
                    var point = {
                        type: "point",
                        longitude: feature.geometry.coordinates[0],
                        latitude: feature.geometry.coordinates[1]
                    };
            
                    // Define symbol to draw
                    var mag_color;
                    if (feature.properties.mag > 6) {
                        mag_color = [168,78,50];
                    }
                    else if (feature.properties.mag > 4) {
                        mag_color = [247,241,54];
                    }
                    else if (feature.properties.mag > 2) {
                        mag_color = [52,168,50];
                    }
                    else {
                        mag_color = [50, 54, 168];
                    }
                    var simpleMarkerSymbol = {
                        type: "simple-marker",
                        color: mag_color,  
                        outline: {
                        color: [255, 255, 255], // white
                        width: 1
                        }
                    };
            
                    // Combine location and symbol and add to graphics layer 
                    // Also include the earthquake properties data so it
                    // can be used in the popup template.
                    var pointGraphic = new Graphic({
                        geometry: point,
                        symbol: simpleMarkerSymbol,
                        attributes: feature.properties 
                    });

                    // Add popup.  The items in curly braces within the 
                    // template are the key names from the graphic attributes.
                    pointGraphic.popupTemplate = {
                        "title" : "Earthquake",
                        "content" : "<b>Mag</b>: {mag}<br><b>Location</b>: {place}<br><b>"
                    }
            
                    graphicsLayer.add(pointGraphic);
                });
            }
        };
        xmlhttp.open("GET", "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", true);
        xmlhttp.send();


        

});