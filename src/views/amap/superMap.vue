<template>
  <div class="super-map">
    <div id='supermap'></div>
  </div>
</template>

<script>
  export default {
    name: 'superMap',
    data() {
      return {
        map: '',
        layer: '',
        vectorLayer: '',
        infowin: null,
        markers: [
          {
            id: 1,
            lon: '5208.36667',
            lat: '-3938.31201',
            info: '球车1号'
          },
          {
            id: 2,
            lon: '5406.36667',
            lat: '-3936.31201',
            info: '球车2号'
          },
          {
            id: 3,
            lon: '5300.36667',
            lat: '-3983.31201',
            info: '球车3号'
          },
          {
            id: 4,
            lon: '5258.36667',
            lat: '-3918.31201',
            info: '球车4号'
          },
          {
            id: 5,
            lon: '5458.36667',
            lat: '-3918.31201',
            info: '球车5号'
          }
        ]
      }
    },
    mounted() {
      this.initMap()
    },
    methods: {
      initMap() {
        const url = 'http://localhost:8090/iserver/services/map-changchun/rest/maps/长春市区图'
        /* global SuperMap:false */
        this.map = new SuperMap.Map('supermap', {
          controls: [
            new SuperMap.Control.Navigation(),
            new SuperMap.Control.PanZoomBar(),
            new SuperMap.Control.MousePosition(),
            new SuperMap.Control.ScaleLine()
          ]
        })
        this.layer = new SuperMap.Layer.TiledDynamicRESTLayer('长春市区图', url, null, { transparent: true, cacheEnabled: true, maxResolution: 'auto' })
        this.layer.events.on({ 'layerInitialized': this.addLayer })
        this.vectorLayer = new SuperMap.Layer.Vector()
      },
      addLayer() {
        this.map.addLayers([this.layer, this.vectorLayer])
        this.map.setCenter(new SuperMap.LonLat(5308.36667, -3936.31201), 4)
        this.addFeature()
        this.addMarkers()
        this.drawLine()
      },
      addFeature() {
        var point = new SuperMap.Geometry.Point(5308.36667, -3936.31201)
        var pointVector = new SuperMap.Feature.Vector(point)
        pointVector.style = { fillColor: 'red', strokeColor: 'yellow', pointRadius: 6 }
        // 添加矢量图形覆盖物
        this.vectorLayer.addFeatures(pointVector)
      },
      drawLine() {
        var points = []
        points.push(new SuperMap.Geometry.Point(5208.36667, -3938.31201))
        points.push(new SuperMap.Geometry.Point(5308.36667, -3936.31201))
        points.push(new SuperMap.Geometry.Point(5208.36667, -3836.31201))
        points.push(new SuperMap.Geometry.Point(5168.36667, -3800.31201))
        points.push(new SuperMap.Geometry.Point(5458.36667, -3918.31201))
        var lineLayer = new SuperMap.Layer.Vector('lineLayer')
        var geometry = new SuperMap.Geometry.LineString(points)
        var style = {
          strokeColor: 'red',
          strokeWidth: 3,
          pointerEvent: 'visiblePainted',
          fillColor: '#304BDE',
          fillOpacity: 0.8
        }
        var feature = new SuperMap.Feature.Vector(geometry, null, style)
        lineLayer.addFeatures(feature, style)
        this.map.addLayer(lineLayer)
      },
      addMarkers() {
        var _this = this
        var markerLayer = new SuperMap.Layer.Markers('Marker')
        var marker = ''
        var point = ''
        this.markers.forEach(function(value, index) {
          var size = new SuperMap.Size(36, 36)
          var offset = new SuperMap.Pixel(-(size.w / 2), -size.h)
          var icon = new SuperMap.Icon('./static/marker-gold.png', size, offset)
          point = new SuperMap.Geometry.Point(value.lon, value.lat)
          marker = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon)
          marker.detail = value
          marker.events.on({
            'click': _this.openInfoWin,
            'scope': marker
          })
          markerLayer.addMarker(marker)
          _this.map.addLayer(markerLayer)
        })
      },
      openInfoWin(e) {
        this.closeInfoWin()
        var lonlat = e.object.lonlat
        var contentHTML = `
          <div style='font-size:.8em; opacity: 0.8; overflow-y:hidden;'>
            <div>${e.object.detail.info}</div>
          </div>
        `
        var popup = new SuperMap.Popup.FramedCloud('popwin', new SuperMap.LonLat(lonlat.lon, lonlat.lat), null, contentHTML, null, true)
        this.map.addPopup(popup)
        this.infowin = popup
      },
      closeInfoWin() {
        if (this.infowin) {
          try {
            this.infowin.hide() // 隐藏窗体对象
            this.infowin.destroy() // 消毁窗体对象
          } catch (e) {
            console.log(e)
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  #supermap{
    position: absolute;
    left: 0;
    top: 100px;
    width: 100%;
    height: 800px;
    .smLayerDiv{
      canvas{
        /*height: 1000px;*/
      }
    }
  }
</style>
