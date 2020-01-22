<template>
  <div class="app-container" style="padding: 0;">
    <div id="openlayers"></div>
    <div style="display: none;">
      <div id="marker" title="Marker"></div>
      <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Map from 'ol/Map'
  import View from 'ol/View'
  import { defaults as defaultControls, FullScreen } from 'ol/control'
  import Overlay from 'ol/Overlay'
  import { toLonLat } from 'ol/proj'
  import { toStringHDMS } from 'ol/coordinate.js'
  import TileLayer from 'ol/layer/Tile'
  // import LayerVector from 'ol/layer/Vector'
  // import SourceVector from 'ol/source/Vector'
  import { TileWMS } from 'ol/source'
  export default {
    name: 'openlayers',
    data() {
      return {
        map: ''
      }
    },
    created() {
    },
    mounted() {
      this.initMap()
      this.addOverlay()
    },
    methods: {
      initMap() {
        const center = [-95.21680, 40.42969]
        const newyork = new TileLayer({
          source: new TileWMS({
            url: 'http://47.106.217.195:8888/geoserver/wms',
            params: {
              'LAYERS': 'tianyuhuojian:states',
              'TILED': true
            },
            serverType: 'geoserver'
          })
        })
        this.map = new Map({
          loadTilesWhileAnimating: true,
          layers: [newyork],
          controls: defaultControls().extend([
            new FullScreen()
          ]),
          target: 'openlayers',
          view: new View({
            projection: 'EPSG:4326',
            // projection: 'EPSG:3857',
            center: center,
            zoom: 5
          })
        })
      },
      addOverlay() {
        var _this = this
        var container = document.getElementById('popup')
        var content = document.getElementById('popup-content')
        var closer = document.getElementById('popup-closer')
        this.popOverlay = new Overlay({
          element: container,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          },
          offset: [0, -46]
        })
        closer.onclick = function() {
          _this.popOverlay.setPosition(undefined)
          closer.blur()
          return false
        }
        this.map.on('click', function(evt) {
          var feature = _this.map.forEachFeatureAtPixel(evt.pixel,
            function(feature) {
              return feature
            })
          if (feature) {
            var coordinates = feature.getGeometry().getCoordinates()
            var coordinate = evt.coordinate
            var hdms = toStringHDMS(toLonLat(coordinate))
            // var context = feature.get('name')
            content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
              '</code><p>test' + '</p>'
            _this.popOverlay.setPosition(coordinates)
          } else {
            _this.popOverlay.setPosition(undefined)
            closer.blur()
            return false
          }
        })
        this.map.on('pointermove', function(e) {
          var pixel = _this.map.getEventPixel(e.originalEvent)
          var hit = _this.map.hasFeatureAtPixel(pixel)
          _this.map.getTargetElement().style.cursor = hit ? 'pointer' : ''
        })
        this.map.addOverlay(this.popOverlay)
      }
    }
  }
</script>


