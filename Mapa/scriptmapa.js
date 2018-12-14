require([
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/views/MapView",
  "esri/widgets/Feature"
], function(Map, FeatureLayer, MapView, Feature) {

  const fLayer = new FeatureLayer({
    portalItem: {
      id: "b02fa0cad0054684a3ed90416798e990"
    }
  });

  const map = new Map({
    basemap: "dark-gray",
    layers: [fLayer]
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-74.1, 4.65],
    scale: 210000
  });

    view.when().then(function() {
    // Create a default graphic for when the application starts
    const graphic = {
      popupTemplate: {
        content: "Mueve el Cursor sobre los lugares"
      }
    };

    // Provide graphic to a new instance of a Feature widget
    const feature = new Feature({
      graphic: graphic,
      view: view
    });

    view.ui.add(feature, "bottom-left");

    view.whenLayerView(fLayer).then(function(layerView) {
      let highlight;
      // listen for the pointer-move event on the View
      view.on("pointer-move", function(event) {
        // Perform a hitTest on the View
        view.hitTest(event).then(function(event) {
          // Make sure graphic has a popupTemplate
          let results = event.results.filter(function(
            result) {
            return result.graphic.layer.popupTemplate;
          });
          let result = results[0];
          highlight && highlight.remove();
          // Update the graphic of the Feature widget
          // on pointer-move with the result
          if (result) {
            feature.graphic = result.graphic;
            highlight = layerView.highlight(result.graphic);
          } else {
            feature.graphic = graphic;
          }
        });
      });
    });

  });

});
