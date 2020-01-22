<template>
  <div class="amap-page-container">
    <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" :plugin="plugin" :events="events" class="amap-demo">
      <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :key="index" :events="marker.events" :icon="marker.icon"></el-amap-marker>
      <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
    </el-amap>
    <div class="toolbar">
      position: [{{ lng }}, {{ lat }}] address: {{ address }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'amap',
    data() {
      var self = this
      return {
        searchOption: {
          city: '全国',
          citylimit: false
        },
        markers: [],
        zoom: 16,
        radius: 50,
        lng: 0,
        lat: 0,
        windows: [],
        window: '',
        address: '',
        center: [113.951059, 22.551394],
        plugin: [
          {
            pName: 'MapType',
            defaultType: 0,
            showTraffic: true
          },
          {
            pName: 'Geolocation',
            showMarker: false,
            events: {
              init(o) {
                o.getCurrentPosition((status, result) => {
                  self.center = [result.position.lng, result.position.lat]
                  self.$nextTick()
                  self.loaded
                })
              }
            }
          }
        ],
        events: {
          init(map) {
            /* global AMapUI:false */
            AMapUI.loadUI(['misc/PathSimplifier'], function(PathSimplifier) {
              if (!PathSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！')
                return
              }
              // 启动页面
              initPage(PathSimplifier)
            })
            function initPage(PathSimplifier) {
              var pathSimplifierIns = new PathSimplifier({
                zIndex: 100,
                map: map,
                getPath: function(pathData, pathIndex) {
                  // 返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                  return pathData.path
                },
                getHoverTitle: function(pathData, pathIndex, pointIndex) {
                  // 返回鼠标悬停时显示的信息
                  if (pointIndex >= 0) {
                    // 鼠标悬停在某个轨迹节点上
                    return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length
                  }
                  // 鼠标悬停在节点之间的连线上
                  return pathData.name + '，点数量' + pathData.path.length
                },
                renderOptions: {
                  // 轨迹线的样式
                  pathLineStyle: {
                    strokeStyle: 'red',
                    lineWidth: 6,
                    dirArrowStyle: true
                    // lineWidth: 0,
                    // fillStyle: null,
                    // strokeStyle: null,
                    // borderStyle: null
                  }
                }
              })
              // 这里构建两条简单的轨迹，仅作示例
              pathSimplifierIns.setData([{
                name: '轨迹0',
                path: [
                  [113.949923, 22.552244],
                  [113.950567, 22.552323],
                  [113.952209, 22.552655],
                  [113.95337, 22.552854],
                  [113.955473, 22.553205]
                  // [106.834493, 26.620695]
                ]
              }])
              // 创建一个巡航器
              var navg0 = pathSimplifierIns.createPathNavigator(0, // 关联第1条轨迹
                {
                  loop: false, // 循环播放
                  speed: 100,
                  pathNavigatorStyle: {
                    width: 48,
                    height: 48,
                    // 使用图片
                    content: PathSimplifier.Render.Canvas.getImageContent('http://v.kinghillsoar.com/def_material/1508643545670sti.png', onload, onerror),
                    strokeStyle: null,
                    fillStyle: null,
                    // 经过路径的样式
                    pathLinePassedStyle: {
                      lineWidth: 6,
                      strokeStyle: 'black',
                      dirArrowStyle: {
                        stepSpace: 15,
                        strokeStyle: 'red'
                      }
                    }
                  }
                })
              navg0.start()
            }
          },
          click(e) {
            const { lng, lat } = e.lnglat
            self.lng = lng
            self.lat = lat
            /* global AMap:false */
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: 'all'
            })
            geocoder.getAddress([lng, lat], function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  self.address = result.regeocode.formattedAddress
                  self.$nextTick()
                }
              }
            })
          }
        }
      }
    },
    methods: {
      onSearchResult(pois) {
        let latSum = 0
        let lngSum = 0
        if (pois.length > 0) {
          pois.forEach(poi => {
            const { lng, lat } = poi
            lngSum += lng
            latSum += lat
            this.markers.push([poi.lng, poi.lat])
          })
          const center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          }
          this.center = [center.lng, center.lat]
        }
      }
    },
    mounted() {
      const markers = []
      const windows = []
      const num = 10
      const self = this
      for (let i = 0; i < num; i++) {
        markers.push({
          position: [113.951059 + i * 0.001, 22.551394 + i * 0.001],
          icon: new AMap.Icon({
            image: 'http://v.kinghillsoar.com/def_material/1508643545670sti.png',
            size: new AMap.Size(128, 128), //  图标大小
            imageSize: new AMap.Size(64, 64)
          }),
          events: {
            click() {
              self.windows.forEach(window => {
                window.visible = false
              })
              self.window = self.windows[i]
              self.$nextTick(() => {
                self.window.visible = true
              })
            }
          }
        })
        windows.push({
          position: [113.951059 + i * 0.001, 22.551394 + i * 0.001],
          content: `<div class="prompt"> ${i}</div>`,
          visible: false
        })
      }
      this.markers = markers
      this.windows = windows
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .amap-page-container{
    margin-top: 100px;
    position: relative;
  }
  .search-box {
    position: absolute;
    top: 25px;
    left: 20px;
  }
  .amap-demo{
    height:850px;
  }
</style>
<style>
  .prompt {
    background: #fff;
    text-align: center;
    width: 100px;
    height: 30px;
  }
</style>
