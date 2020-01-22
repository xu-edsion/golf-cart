<template>
  <div class="app-container" style="padding: 0;">
    <div id="openlayers"></div>
    <el-row class="operation-cate">
      <el-button type="primary" size="small" @click="drawMap">添加电子围栏</el-button>
      <el-button type="primary" size="small" @click="startAnimation" id="start-animation">轨迹回放</el-button>
      <el-button type="primary" size="small" @click="monitorP">单点监控</el-button>
      <el-button type="primary" size="small" @click="all_m">实时监控</el-button>
    </el-row>
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
  import { defaults as defaultControls, FullScreen, ZoomSlider } from 'ol/control'
  import Overlay from 'ol/Overlay'
  import Feature from 'ol/Feature'
  import { Point, LineString } from 'ol/geom'
  // import Polyline from 'ol/format/Polyline'
  import { Icon, Style, Circle, Stroke, Text, Fill } from 'ol/style'
  import { fromLonLat, toLonLat, transform } from 'ol/proj'
  import { toStringHDMS } from 'ol/coordinate.js'
  import TileLayer from 'ol/layer/Tile'
  import LayerVector from 'ol/layer/Vector'
  import SourceVector from 'ol/source/Vector'
  import { XYZ, TileWMS } from 'ol/source'
  import { Draw } from 'ol/interaction'
  // import { click } from 'ol/events/condition'
  export default {
    name: 'openlayers',
    data() {
      return {
        map: '',
        popOverlay: '',
        draw: '',
        animating: false,
        speed: 5,
        now: null,
        routeCoords: [],
        routeLength: null,
        geoMarker: '',
        styles: '',
        monitor: {
          data_c: null,
          p_data: '',
          timer: '',
          key: null,
          layer: ''
        },
        allCar: [],
        all_monitor: {
          layer: '',
          data_c: '',
          p_data: '',
          key: null
        },
        rotation: '',
        old_p: []
      }
    },
    created() {
      for (var i = 0; i < 10; i++) {
        this.allCar.push({
          id: i + 1,
          name: i + '号',
          lnglat: [113.942059 + Math.random() * 0.005, 22.551394 + Math.random() * 0.005],
          state: (Math.random() > 0.5 ? 1 : 0)
        })
      }
    },
    mounted() {
      this.initMap()
      this.addOverlay()
      this.addMarker()
      this.orbit()
      // this.monitor_init()
    },
    methods: {
      initMap() {
        // const center = transform([-73.97352, 40.78640], 'EPSG:4326', 'EPSG:3857')
        const center = transform([113.951059, 22.551394], 'EPSG:4326', 'EPSG:3857')
        const gaodeMapLayer = new TileLayer({
          source: new XYZ({
            url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
          })
        })
        // var openStreetMapLayer = new TileLayer({
        //   source: new XYZ({
        //     url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        //     crossOrigin: ''
        //   })
        // })
        const newyork = new TileLayer({
          source: new TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {
              'LAYERS': 'tiger-ny',
              'TILED': true
            },
            serverType: 'geoserver'
          })
        })
        var layer = new LayerVector({
          source: new SourceVector()
        })
        var circle = new Feature({
          geometry: new Point(transform(
            [113.956059, 22.551684], 'EPSG:4326', 'EPSG:3857'))
        })
        circle.setStyle(new Style({
          image: new Circle({
            radius: 0,
            stroke: new Stroke({
              color: 'red',
              size: 1
            })
          })
        }))
        this.map = new Map({
          loadTilesWhileAnimating: true,
          layers: [newyork, gaodeMapLayer, this.vectors(), layer],
          controls: defaultControls().extend([
            new FullScreen()
          ]),
          target: 'openlayers',
          view: new View({
            // projection: 'EPSG:4326',
            // projection: 'EPSG:3857',
            center: center,
            zoom: 16
          })
        })
        layer.getSource().addFeature(circle)
        var radius = 0
        this.map.on('postcompose', function() {
          radius++
          radius = radius % 20
          circle.setStyle(new Style({
            image: new Circle({
              radius: radius,
              stroke: new Stroke({
                color: 'red',
                size: 1
              })
            })
          }))
        })
        var zoomslider = new ZoomSlider()
        this.map.addControl(zoomslider)
      },
      vectors() {
        var iconFeatures = []
        var iconFeature = new Feature({
          geometry: new Point(transform([113.956059, 22.551684], 'EPSG:4326',
            'EPSG:3857')),
          name: '球车1号'
        })
        var iconFeature1 = new Feature({
          geometry: new Point(transform([113.951059, 22.551394], 'EPSG:4326',
            'EPSG:3857')),
          name: '球车2号'
        })
        iconFeatures.push(iconFeature)
        iconFeatures.push(iconFeature1)
        var vectorSource = new SourceVector({
          features: iconFeatures
        })
        var iconStyle = new Style({
          image: new Icon(({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: '../static/marker-gold.png'
          }))
        })
        return new LayerVector({
          source: vectorSource,
          style: iconStyle
        })
      },
      addMarker() {
        var pos = fromLonLat([113.951059, 22.551394])
        // Vienna marker
        var marker = new Overlay({
          position: pos,
          positioning: 'center-center',
          element: document.getElementById('marker'),
          stopEvent: false
        })
        this.map.addOverlay(marker)
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
      },
      drawMap() {
        var _this = this
        this.map.on('click', function() {
          _this.popOverlay.setPosition(undefined)
        })
        // 添加一个绘制的线使用的layer
        var lineLayer = new LayerVector({
          source: new SourceVector(),
          style: new Style({
            stroke: new Stroke({
              color: 'red',
              size: 6
            })
          })
        })
        this.map.addLayer(lineLayer)
        var lineDraw = new Draw({
          type: 'Polygon',
          source: lineLayer.getSource() // 注意设置source，这样绘制好的线，就会添加到这个source里
        })
        // 监听线绘制结束事件，获取坐标
        lineDraw.on('drawend', function(event) {
          // event.feature 就是当前绘制完成的线的Feature
          console.log(event.feature.getGeometry())
          console.log(JSON.stringify(event.feature.getGeometry().getCoordinates()))
        })
        this.map.addInteraction(lineDraw)
        // 单击判断
        // var selectClick = new Select({
        //   condition: click,
        //   style: this.changeStyle
        // })
        // this.map.addInteraction(selectClick)
        // selectClick.on('select', this.clickEvent)
      },
      orbit() {
        var routeCoords = this.routeCoords
        for (var i = 0; i <= 100; i++) {
          routeCoords.push(transform([113.948000 + 0.00008 * i, 22.550094 + 0.000005 * i], 'EPSG:4326', 'EPSG:3857'))
        }
        var route = new LineString(routeCoords)
        var routeLength = routeCoords.length
        this.routeLength = routeLength
        var routeFeature = new Feature({
          type: 'route',
          geometry: route
        })
        this.geoMarker = new Feature({
          type: 'geoMarker',
          geometry: new Point(routeCoords[0])
        })
        var startMarker = new Feature({
          type: 'icon',
          geometry: new Point(routeCoords[0])
        })
        var endMarker = new Feature({
          type: 'icon',
          geometry: new Point(routeCoords[routeLength - 1])
        })
        this.styles = {
          'route': new Style({
            stroke: new Stroke({
              width: 6, color: [237, 212, 0, 0.8]
            })
          }),
          'icon': new Style({
            image: new Icon({
              anchor: [0.5, 1],
              scale: 0.8,
              src: '../static/marker.png'
            })
          }),
          'geoMarker': new Style({
            image: new Icon({
              anchor: [0.5, 1],
              scale: 0.5,
              src: '../static/marker-gold.png'
            })
          })
        }
        var _this = this
        var vectorLayer = new LayerVector({
          source: new SourceVector({
            features: [routeFeature, this.geoMarker, startMarker, endMarker]
          }),
          style: function(feature) {
            // hide geoMarker if animation is active
            if (_this.animating && feature.get('type') === 'geoMarker') {
              return null
            }
            return _this.styles[feature.get('type')]
          }
        })
        this.map.addLayer(vectorLayer)
      },
      moveFeature(e) {
        var vectorContext = e.vectorContext
        var frameState = e.frameState
        if (this.animating) {
          var elapsedTime = frameState.time - this.now
          // here the trick to increase speed is to jump some indexes
          // on lineString coordinates
          var index = Math.round(this.speed * elapsedTime / 1000)

          if (index >= this.routeLength) {
            this.stopAnimation(true)
            return
          }
          var dx, dy, rotation, carStyle
          if (this.routeCoords[index] && this.routeCoords[index + 1]) {
            dx = this.routeCoords[index][0] - this.routeCoords[index + 1][0]
            dy = this.routeCoords[index][1] - this.routeCoords[index + 1][1]
            rotation = Math.atan2(dy, dx)
            carStyle = new Style({
              image: new Icon({
                src: '../static/marker-gold.png',
                rotateWithView: false,
                rotation: -rotation,
                scale: 0.6,
                anchor: [0.5, 1]
              })
            })
            var currentPoint = new Point(this.routeCoords[index])
            var feature = new Feature(currentPoint)
            vectorContext.drawFeature(feature, carStyle)
          }
        }
        this.map.render()
      },
      stopAnimation(ended) {
        this.animating = false
        var coord = ended ? this.routeCoords[this.routeLength - 1] : this.routeCoords[0];
        (this.geoMarker.getGeometry()).setCoordinates(coord)
        this.map.un('postcompose', this.moveFeature)
      },
      startAnimation(e) {
        if (this.animating) {
          this.stopAnimation(false)
        } else {
          this.animating = true
          this.now = new Date().getTime()
          // e.target.innerText = '暂停'
          // hide geoMarker
          this.geoMarker.setStyle(null)
          this.map.on('postcompose', this.moveFeature)
          this.map.render()
        }
      },
      monitorP() {
        this.mode_clear()
        this.monitor_p()
        this.monitor.key = true
        // 开始移动
        this.monitor_init()
      },
      monitor_p() {
        var p_data = new Feature({
          geometry: new Point(transform([113.953059, 22.554394], 'EPSG:4326', 'EPSG:3857'))
        })
        p_data.setStyle(new Style({
          // 设置一个标识
          image: new Icon({
            src: '../static/marker.png',

            // 这个是相当于是进行切图了
            // size: [50, 50],

            // 注意这个，竟然是比例 左上[0,0]  左下[0,1]  右下[1，1]
            anchor: [0.5, 0.5],
            // 这个直接就可以控制大小了
            scale: 1,

            // 开启转向
            rotateWithView: true
          }),
          text: new Text({
            // 对其方式
            textAlign: 'center',
            // 基准线
            textBaseline: 'middle',
            offsetY: -30,
            // 文字样式
            font: 'light 14px 黑体',
            // 文本内容
            text: '球车1号',
            // 文本填充样式
            fill: new Fill({
              color: '#fff'
            }),
            padding: [5, 5, 5, 5],
            backgroundFill: new Fill({
              color: 'rgba(0,0,255,0.6)'
            })
          })
        }))
        // 层
        var layer = new LayerVector()
        // 数据层
        var vectorSource = new SourceVector()
        // 数据层收集marker
        vectorSource.addFeature(p_data)
        this.monitor.data_c = vectorSource
        // 注入层
        layer.setSource(this.monitor.data_c)
        this.monitor.layer = layer
        this.map.addLayer(layer)
        // 拿到全局
        this.monitor.p_data = p_data
      },
      monitor_init() {
        // 追踪
        var _this = this
        var old_p = null
        var new_p = [0, 0]
        this.monitor.timer = setTimeout(function() {
          old_p = _this.monitor.p_data.getGeometry().flatCoordinates
          if (Math.random() > 0.5) {
            new_p[0] = old_p[0] + Math.random() * 200
          } else {
            new_p[0] = old_p[0] - Math.random() * 200
          }
          if (Math.random() > 0.5) {
            new_p[1] = old_p[1] + Math.random() * 200
          } else {
            new_p[1] = old_p[1] - Math.random() * 200
          }
          _this.monitor.p_data.setGeometry(new Point(new_p))
          _this.monitor.p_data.getStyle().getImage().setRotation(_this.map_p_rotation(new_p, old_p))
          _this.monitor_init_line(new_p, old_p)
          _this.monitor_init()
        }, 5000)
      },
      // 初始化线
      monitor_init_line(new_p, old_p) {
        var line_data = new Feature({
          geometry: new LineString([old_p, new_p])
        })
        var line_style = new Style({
          stroke: new Stroke({
            width: 4,
            color: [255, 0, 0, 1],
            lineDash: [10, 5]
          })
        })
        line_data.setStyle(line_style)
        // 注入容器
        this.monitor.data_c.addFeature(line_data)
      },
      // 点的转向角度设置  new_p 上一点的坐标 old_p 下一点的坐标
      map_p_rotation(new_p, old_p) {
        // 90度的PI值
        var pi_90 = Math.atan2(1, 0)
        // 当前点的PI值
        var pi_ac = Math.atan2(new_p[1] - old_p[1], new_p[0] - old_p[0])
        return pi_90 - pi_ac
      },
      // 实时监控所有
      all_m() {
        this.mode_clear()
        this.all_monitor.key = true
        // 设置层
        this.all_m_layer()
        // 初始化
        this.all_m_init(this.allCar)
      },
      // 初始化参数
      all_m_layer() {
        // 层
        this.all_monitor.layer = new LayerVector()
        // 数据容器
        this.all_monitor.data_c = new SourceVector()
        // 注入层
        this.all_monitor.layer.setSource(this.all_monitor.data_c)
        // 打到地图上
        this.map.addLayer(this.all_monitor.layer)
      },
      // 所有点的初始化
      all_m_init(allCar) {
        var _this = this
        allCar.forEach(function(ele, index) {
          if (Math.random() > 0.5) {
            // ele.state = 1
            ele.lnglat = [ele.lnglat[0] + Math.random() * 0.0005, ele.lnglat[1] + Math.random() * 0.0005]
            _this.old_p = ele.lnglat
          } else {
            // ele.state = 0
            ele.lnglat = [ele.lnglat[0] - Math.random() * 0.0005, ele.lnglat[1] - Math.random() * 0.0005]
            _this.old_p = ele.lnglat
          }
        })
        allCar.forEach(function(ele, index) {
          // 添加点
          _this.all_m_init_marker(ele)
          // var new_p = ele.lnglat
          // _this.all_monitor.p_data.getStyle().getImage().setRotation(_this.map_p_rotation(new_p, _this.old_p))
        })
        this.all_monitor.timer = setTimeout(function() {
          if (_this.all_monitor.key) {
            _this.all_monitor.data_c.clear()
            _this.all_m_init(allCar)
          }
        }, 5000)
      },
      // 添加点
      all_m_init_marker(ele) {
        var p_data = new Feature({
          geometry: new Point(transform(ele.lnglat, 'EPSG:4326',
            'EPSG:3857'))
        })
        p_data.setStyle(new Style({
          image: new Icon({
            // src: `../static/cluster${ele.state}.png`,
            src: '../static/cluster0.png',
            anchor: [0.5, 1],
            scale: 0.8,
            // 开启转向
            rotateWithView: true
          }),
          text: new Text({
            // 对其方式
            textAlign: 'center',
            // 基准线
            textBaseline: 'middle',
            offsetY: -50,
            // 文字样式
            font: 'normal 14px 黑体',
            // 文本内容
            text: ele.name,
            // 文本填充样式
            fill: new Fill({
              color: 'rgba(255,255,255,1)'
            }),
            padding: [5, 5, 5, 5],
            backgroundFill: new Fill({
              color: 'rgba(0,0,0,0.6)'
            })
          })
        }))
        // 属性关注
        p_data.ele = ele
        // 数据层收集
        this.all_monitor.data_c.addFeature(p_data)
        // 拿到全局
        this.all_monitor.p_data = p_data
      },
      // 清除多点实时监控
      all_m_clear() {
        clearTimeout(this.all_monitor.timer)
        this.all_monitor.key = false
        this.all_monitor.data_c.clear()
        this.map.removeLayer(this.all_monitor.layer)
      },
      // 清除单点监控
      monitor_clear() {
        // 清除定时器
        clearTimeout(this.monitor.timer)
        this.monitor.key = false
        // 清除所有数据
        this.monitor.data_c.clear()
        // 清除这层
        this.map.removeLayer(this.monitor.layer)
      },
      mode_clear() {
        if (this.monitor.key) {
          this.monitor_clear()
        }
        if (this.all_monitor.key) {
          this.all_m_clear()
        }
      },
      changeStyle(feature) {
        var ftype = feature.get('featuretype')
        if (ftype === 'line') {
          return new Style({
            stroke: new Stroke({
              color: 'blue',
              size: 5
            })
          })
        }
      },
      clickEvent(e) {
        var arr = e.target // 获取事件对象，即产生这个事件的元素-->ol.interaction.Select
        var collection = arr.getFeatures() // 获取这个事件绑定的features-->返回值是一个ol.Collection对象
        var features = collection.getArray() // 获取这个集合的第一个元素-->真正的feature
        console.log(features[0])
      }
    }
  }
</script>


