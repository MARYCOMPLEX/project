<template>
  <div id="main">
    <Header></Header>
    <div id="container">
    </div>
    <leftCards class='leftCards' @locate="flyToPoi" @renderGeojson='renderGeojson' style='position:absolute;left:20px;top:80px'></leftCards>
    <rightCards class='rightCards' @locate="flyToPoi" style='position:absolute;right:20px;top:80px'></rightCards>
    <el-tooltip content="复位" placement="top">
      <el-button style='position:absolute;bottom:10px;left:20px;background-color: #3E92E9;' 
                 type="mini" 
                 icon="el-icon-refresh-right" 
                 @click='resetMap'></el-button>
    </el-tooltip>
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
import {geojson,winInfo} from '../constant.js';
import * as XLSX from 'xlsx';

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
      mouseMoveHandler:null,
      spot:null,
      carts:[],
      method:null,
      loca:null,
      prismLayer:null,
      user:null,
      geojson:null,
      layersCon:false,
      marker:'https://a.amap.com/Loca/static/loca-v2/demos/images/track_marker.png',
      locaDict: {
          "当天冷水用量": "4_7LS",
          "近7天冷水用量": "41_47LS",
          "自定义时间段冷水用量": "ZDYLS",
          "当天热水用量": "4_7RS",
          "近7天热水用量": "41_47RS",
          "自定义时间段热水用量": "ZDYRS",
          "当天用电量": "4_7YD",
          "自定义时间段用电量": "ZDYYD",
          "当前电功率": "DGL22",
          "自定义时间段电功率": "ZDYDGL",
          "当天已在宿舍人数": "4_7YZSS",
          "自定义时间段已在宿舍人数": "ZDYYZSS",
          "当天未归宿舍人数": "4_7WZSS",
          "自定义时间段未归宿舍人数": "ZDYWZSS",
          "当天晚归人数": "4_7WG",
          "自定义时间段晚归人数": "ZDYWG",
          "当天未归人数": "4_7WG1",
          "自定义时间段未归人数": "ZDYWG1",
          "当天有课未出人数": "4_7YKWC",
          "自定义时间段有课未出人数": "ZDYYKWC"
      },

    }
  },
  components:{
    SlickList, SlickItem,comment,Header,leftCards,rightCards
  },
  mounted(){
    this.initMap(this.mapFuns)
    // 十秒后执行
  },
  methods: {
    resetMap(){
      if (this.prismLayer) {
        this.loca.remove(this.prismLayer.destroy());
        this.map.off('mousemove',this.mouseMoveHandler);
        this.mouseMoveHandler = null;
        this.addAllPoi(this.AMap,this.map,this.geojson)
        this.prismLayer = null;
      }
    },
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
            center: [112.91150, 27.90742],
            WebGLParams: {
              preserveDrawingBuffer: true
            }
          });

          this.Loca = Loca
          
          
          // Animate and other interaction codes here
          callback(AMap, this.map);
        })
        .catch(e => {
          console.log(e, "高德地图加载失败");
        });
    },
    
    mapFuns(AMap,map){
      this.geojson = geojson
      this.addAllPoi(AMap,map,this.geojson)
      // 等待十秒执行删除全部marker。

    },
    renderGeojson(params) {
      this.loca = null;
      console.log('参数', params);
      this.clearAllPoi();

      // 根据params的值，去locaDict中找到对应的值，然后去geojson中找到对应的值，然后渲染
      let locaDict = this.locaDict;
      let prop = locaDict[params];

      // 计算geojson中prop字段的最大值和最小值和平均值
      let max = -Infinity;
      let min = Infinity;
      let sum = 0;
      this.geojson.features.forEach(item => {
        let n = item.properties[prop];
        if (n > max) {
          max = n;
        }
        if (n < min) {
          min = n;
        }
        sum += n;
      });
      let avg = sum / this.geojson.features.length;

      console.log('locaDict', locaDict[params]);
      this.loca = new this.Loca.Container({
        map: this.map
      });

      if (this.prismLayer) {
        this.loca.remove(this.prismLayer.destroy());
        this.prismLayer = null;
      }

      this.prismLayer = new this.Loca.PrismLayer({
        zIndex: 10,
        opacity: 1,
        visible: true,
        hasSide: true
      });

      let geo = new this.Loca.GeoJSONSource({
        data: this.geojson,
      });

      this.prismLayer.setSource(geo);

      this.prismLayer.setStyle({
        unit: 'meter',
        sideNumber: 4,
        topColor: (index, f) => {
          var n = f.properties[prop];
          return n > avg ? '#ff0026' : '#01a700';
        },
        sideTopColor: (index, f) => {
          var n = f.properties[prop];
          return n > avg ? '#ff0026' : '#01a700';
        },
        sideBottomColor: '#ffffff',
        radius: 10,
        height: (index, f) => {
          var props = f.properties;
          var height = ((props[prop] - min) / (max - min)) * 100;
          return height;
        },
        rotation: 360,
        altitude: 0,
      });

      this.loca.add(this.prismLayer);

      // 初始化标记
      var clickInfo = new AMap.Marker({
        anchor: 'bottom-center',
        position: [116.396923, 39.918203, 0],
      });
      clickInfo.setMap(this.map);
      clickInfo.hide();

      // 鼠标移动事件
      const handleMouseMove = (e) => {
        var feat = this.prismLayer.queryFeature(e.pixel.toArray());
        if (feat) {
          clickInfo.show();
          var props = feat.properties;
          var height = Math.max(100, ((props[prop] - min) / (max - min)) * 100);
          clickInfo.setPosition([feat.coordinates[0], feat.coordinates[1], height]);
          clickInfo.setContent(
            `<div style="text-align: center; height: 20px; width: 150px; 
            color:${props[prop] > avg ? '#ff0026' : '#01a700'}; 
            font-size: 14px;
            font-weight:bold;
            ">` +
            props['ssname'] + ': ' + props[prop] + ' </div>'
          );
        } else {
          clickInfo.hide();
        }
      };

      // 绑定事件
      this.map.on('mousemove', handleMouseMove);

      // 保存事件处理器以便取消监听
      this.mouseMoveHandler = handleMouseMove;

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
      let otherInfo = winInfo.find(item => item.楼栋名称 === detail.name)
      // 根据OtherInfo数据信息创建信息窗体，格式如下
      // 	1区1栋
      // 宿舍容纳人数：260
      // 当前宿舍人数：185
      // 未到宿舍人数：75
      // 今日冷水用量：58吨
      // 今日热水用量：21吨
      // 今日用电量：434度
      // 管理员姓名：张一
      // 管理员电话：17533385890
      let content = `<div id="infoContent" style="color: red;">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${detail.name}</div>
          <div>宿舍容纳人数：${otherInfo.宿舍容纳人数}人</div>
          <div>当前宿舍人数：${otherInfo.当前宿舍人数}人</div>
          <div>未到宿舍人数：${otherInfo.未到宿舍人数}人</div>
          <div>今日冷水用量：${otherInfo.今日冷水用量}</div>
          <div>今日热水用量：${otherInfo.今日热水用量}</div>
          <div>今日用电量：${otherInfo.今日用电量}</div>
          <div>管理员姓名：${otherInfo.管理员姓名}</div>
          <div>管理员电话：${otherInfo.管理员电话}</div>
      </div>`
      let InfoWindow = new AMap.InfoWindow({
        content: content,
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
    clearAllPoi(){
      this.markers.forEach((m)=>{
        this.map.remove(m.marker)
      }
    )
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
  
  