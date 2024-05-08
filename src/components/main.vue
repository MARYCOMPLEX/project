<template>
    <div id="main">
      <Header></Header>
      <div id="container">
      </div>
      <leftCards class='leftCards' @locate="flyToPoi" style='position:absolute;left:20px;top:80px'></leftCards>
      <rightCards class='rightCards' @locate="flyToPoi" style='position:absolute;right:20px;top:80px'></rightCards>
    </div> 
    </template>
    
    <script>
    
    import AMapLoader from '@amap/amap-jsapi-loader';
    import axios from 'axios';
    import comment from '@/components/comment.vue';
    import Header from "@/components/Header";
    import leftCards from '@/components/leftcards/leftContainer'
    import rightCards from '@/components/rightcards/rightContainer'
    import { gpsConvert } from "@/network/common.js";
    import  { SlickList, SlickItem } from "vue-slicksort";
    import geojson from '../constant.js';
    window._AMapSecurityConfig = {
    securityJsCode: "247e4c3777cda788358efc91cc7c0922",
  };
    export default {
      name:'main',
      data() {
        return {
          comments: [
            // Add more comments here
          ],
          map: '',
          instance: '',
          mouseTool: null,
          AMap:null,
          gpsData:[],
          AMapUI:null,
          peopleInfo:[],
          state:[],
          dialogCartVisible:false,
          dialogMethodVisible:false,
          oldStyle:null,
          curItem:null,
          simpelInfoWindow:null,
          markers:[],
          spots:null,
          spot:null,
          carts:[],
          method:null,
          user:null,
          layersCon:false,
          marker:'https://a.amap.com/Loca/static/loca-v2/demos/images/track_marker.png'
        }
      },
      components:{
        SlickList, SlickItem,comment,Header,leftCards,rightCards
      },
      mounted(){
        this.initMap(this.mapFuns)
        // 设置一个定时器，没5秒执行一次this.addMapControl()
        // let that = this
        // this.timer = setInterval(() => {
        //   if(this.AMapUI)
        //     this.addMapControl()
        //     this.layersCon = true
        //     console.log('添加一次')
        //   if(this.layersCon = true){
        //     this.addMapControl()
        //     console.log('添加一次')
        //     clearInterval(this.timer)
        //   }
        // }, 1000)
        
        // window.searchMajor = function () {
        //   that.searchMajor(that.spot)
        // }
      },
      methods: {
        detail(item){
          this.spot = item
        },
        flyToPoi(pos,phone =''){
          console.log('定位到',pos)
          let InfoWindow
          if(phone !== ''){
            InfoWindow = new AMap.InfoWindow({
              content: `<div id="infoContent" style="color: red;">
                  <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${pos}</div>
                  <div style="font-size: 8px; font-weight: bold; margin-bottom: 5px;">该楼栋管理员电话：${phone.admin}</div>
                  <div style="font-size: 8px; font-weight: bold; margin-bottom: 5px;">该楼栋寝室长电话${phone.sushe}</div>
              </div>`,
              offset: new this.AMap.Pixel(0, -31)
            });
          } else {
            InfoWindow = new AMap.InfoWindow({
              content: `<div id="infoContent" style="color: red;">
                  <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${pos}</div>
              </div>`,
              offset: new this.AMap.Pixel(0, -31)
            });
          }

          console.log(this.markers)
          let marker = this.markers.find(item => item.name === pos).marker
          InfoWindow.open(this.map, marker.getPosition());
            // 设置地图的中心点为标记点的位置
          this.map.setCenter(marker.getPosition());
          // 设置地图缩放级别更近以便详细观察
          this.map.setZoom(18);
        },
        checkPoi(item){
          if(this.dialogCartVisible){
            this.dialogCartVisible = false
          }
          this.spot = item
          if(this.marker){
            this.map.remove(this.marker)
          }
          this.marker = this.addMarker(item, item, true)
          // this.$message.error(`暂无${this.spot.poiName}视频数据`)
        },
        initMap(callback) {
  window._AMapSecurityConfig = {
    securityJsCode: "c6f43b059bdd89b63d740dc3c4b3a00f",
  };
  AMapLoader.load({
    key: "9dea29df54b111a53edd90845b25180f", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本
    plugins: ["AMap.ToolBar", "AMap.MouseTool", "AMap.Scale", "AMap.HawkEye", "AMap.Geocoder", 'AMap.Driving', 'AMap.Walking', 'AMap.Riding', 'AMap.Transfer'], // 需要使用的的插件列表
    AMapUI: {
      version: "1.1", // AMapUI 版本
      plugins: ['overlay/SimpleMarker', 'overlay/SimpleInfoWindow', 'control/BasicControl']
    },
    "Loca": {
      "version": '2.0.0' // Loca 版本
    },
  })
    .then(AMap => {
      this.AMap = AMap;
      this.map = new AMap.Map("container", {
        rotateEnable: true,
        pitchEnable: true,
        zoom: 16,
        pitch: 50,
        rotation: '15',
        viewMode: '3D',
        mapStyle: 'amap://styles/84ba10a821298afbfc69cac6d854d241',
        zooms: [2, 20],
        center: [112.91950, 27.89742],
        WebGLParams: {
          preserveDrawingBuffer: true
        }
      });

      let loca = new Loca.Container({
        map: this.map
      });

      let prismLayer = new Loca.PrismLayer({
        zIndex: 10,
        opacity: 1,
        visible: true,
        hasSide: true
      });

      let geo = new Loca.GeoJSONSource({
        data: geojson,
      });
      console.log('GeoJSONSource',geo)
      
      prismLayer.setSource(geo);

      prismLayer.setStyle({
        unit: 'meter',
        sideNumber: 14,
        topColor: (index, f) => {
          var n = f.properties['41_47LS'];
          return n > 510 ? '#E97091' : '#2852F1';
        },
        sideTopColor: (index, f) => {
          var n = f.properties['41_47LS'];
          return n > 510 ? '#E97091' : '#2852F1';
        },
        sideBottomColor: '#002bb9',
        radius: 15,
        height: (index, f) => {
          var props = f.properties;
          var height = f.properties['41_47LS'] + Math.floor(Math.random() * 10000) + 1;
          return height;
        },
        rotation: 360,
        altitude: 0,
      });

      loca.add(prismLayer);
      
      // Animate and other interaction codes here

      callback(AMap, this.map);
    })
    .catch(e => {
      console.log(e, "高德地图加载失败");
    });
}
,

        mapFuns(AMap,map){
          console.log('amp',AMap)
          this.addAllPoi(AMap,map,geojson)
        },
        addMarker(AMap,map,pos,detail){
          let marker = new AMap.Marker({
              position: pos, // 标记的坐标
              icon: new AMap.Icon({
                  size: new AMap.Size(36, 36),  // 图标尺寸
                  image: 'https://a.amap.com/Loca/static/loca-v2/demos/images/track_marker.png',  // 图标的URL
                  imageSize: new AMap.Size(36, 36)  // 图标的尺寸
              }),
              title: detail.name,
              map: map
          });
          
              // eslint-disable-next-line no-undef
          let InfoWindow = new AMap.InfoWindow({
            content: `<div id="infoContent" style="color: red;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${detail.name}</div>
                <div>暂无内容</div>
            </div>`,
            offset: new this.AMap.Pixel(0, -31)
          });
          marker.on('click', function() {
            // 打开信息窗体
            InfoWindow.open(map, marker.getPosition());
            // 设置地图的中心点为标记点的位置
            map.setCenter(marker.getPosition());
            // 设置地图缩放级别更近以便详细观察
            map.setZoom(18);
          });
          this.markers.push({
            name: detail.name,
            marker: marker
          })

          // 设置地图中心和缩放级别
        return marker
        },
        addMapControl(){
          let layerCtrl = new AMapUI.BasicControl.LayerSwitcher({
              position: 'bl',
              baseLayers: [{
                    enable: true,
                    id: 'tile',
                    name: '图层A',
                    layer: new this.AMap.TileLayer()
                }, {
                    id: 'satellite',
                    name: '图层B',
                    layer: new this.AMap.TileLayer.Satellite()
                }],
                //自定义覆盖图层
                overlayLayers: [{
                    enable: false,
                    id: 'traffic',
                    name: '图层C',
                    layer: new this.AMap.TileLayer.Traffic()
                }, {
                    id: 'roadNet',
                    name: '图层D',
                    layer: new this.AMap.TileLayer.RoadNet()
                }]
            });
            // layers: layerCtrl.getEnabledLayers()
            try {
              this.map.addControl(layerCtrl);
            } catch (error) {
              console.log('图层添加',error)
            }
        },
        draw(type){
          let AMap = this.AMap
          if(!this.mouseTool){
            this.mouseTool = new AMap.MouseTool(this.map); 
          }
          let mouseTool = this.mouseTool
          switch(type){
            case 'rule':{
                mouseTool.rule({
                    startMarkerOptions : {//可缺省
                        icon: new AMap.Icon({
                            size: new AMap.Size(19, 31),//图标大小
                            imageSize:new AMap.Size(19, 31),
                            image: "//webapi.amap.com/theme/v1.3/markers/b/start.png"
                        }),
                        offset: new AMap.Pixel(-9, -31)
                    },
                    endMarkerOptions : {//可缺省
                        icon: new AMap.Icon({
                            size: new AMap.Size(19, 31),//图标大小
                            imageSize:new AMap.Size(19, 31),
                            image: "//webapi.amap.com/theme/v1.3/markers/b/end.png"
                        }),
                        offset: new AMap.Pixel(-9, -31)
                    },
                    midMarkerOptions : {//可缺省
                        icon: new AMap.Icon({
                            size: new AMap.Size(19, 31),//图标大小
                            imageSize:new AMap.Size(19, 31),
                            image: "//webapi.amap.com/theme/v1.3/markers/b/mid.png"
                        }),
                        offset: new AMap.Pixel(-9, -31)
                    },
                    lineOptions : {//可缺省
                        strokeStyle: "solid",
                        strokeColor: "#FF33FF",
                        strokeOpacity: 1,
                        strokeWeight: 2
                    }
                    //同 RangingTool 的 自定义 设置，缺省为默认样式
                });
                break;
            }
            case 'measureArea':{
                mouseTool.measureArea({
                    strokeColor:'#80d8ff',
                    fillColor:'#80d8ff',
                    fillOpacity:0.3
                  //同 Polygon 的 Option 设置
                });
                break;
            }
            case 'clear': {
                mouseTool.close(true)
                break;
            }
          }
        },
        addAllPoi(AMap,map,geojson){
          console.log('geojson',geojson.features[0].geometry.coordinates)
          // 遍历geojson的坐标，在地图上添加所有的点
          geojson.features.forEach((item,index)=>{
            let pos = item.geometry.coordinates
            let detail = {name:item.properties.ssname}
            // 将坐标控制到六位小数，再进行转换
            pos = [pos[0].toFixed(6),pos[1].toFixed(6)]
            // 高德节流
            // gpsConvert({'locations':pos.join(',')}).then(res=>{
            //   let gdPos =  res.data.locations.split(',')
            //   let marker = this.addMarker(AMap,map,gdPos,detail)
            // })
            let marker = this.addMarker(AMap,map,pos,detail)

          })      
        },
        
      },
    }
    </script>
    
<style scope>
html, body, #app {
  height: 100%; /* 设置根元素的高度 */
  margin: 0;
}

#main {
  display: flex;
  flex-direction: column; /* 列方向堆叠 */
  height: 100%; /* 使主容器高度填满视口 */
}
#container{
  position: relative;
  flex-grow: 1; /* 地图容器占据剩余空间 */
  width: 100%; /* 地图容器宽度为100% */
}
.amap-logo {
  display: none!important;
}
 
.amap-copyright {
  display: none!important;
}
.header-container {
  height: 60px; /* 固定头部高度 */
}

</style>
    
    