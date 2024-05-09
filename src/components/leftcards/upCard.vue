<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="card-top">
        <h1 class="title">水力系统</h1>
        <span class="button-text" @click="showDialog('A')">数据查询</span>
      </div>
      <div class="card-content">
        <div>热水用量: {{ hot_consum}}</div>
        <div>冷水用量: {{ cool_consum}}</div>
        <div>水压: {{ water_pressure}}</div>
        <div>水流速度: {{ water_speed }}</div>
      </div>
      <div class="card-bottom">
        <span class="button-text" @click="showAlert">空间展示</span>
        <span class="button-text" @click="showDialog('C')">流量分析</span>
      </div>
    </div>
    <!-- 弹出框容器 -->
    <el-dialog
      v-if="dialogVisible.A"
      title="数据查询"
      :visible.sync="dialogVisible.A"
      width="50%">
      <div class="select-container">
        <div>
          
          <span>选择区域：</span>
          <el-select v-model="selectedOption1">
            <el-option
              v-for="(option, index) in options1"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <span>选择楼栋：</span>               
          <el-select v-model="selectedOption2">
            <el-option
              v-for="(option, index) in options2"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <span>选择宿舍：</span>
          <el-select v-model="selectedOption3">
            <el-option
              v-for="(option, index) in options3"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="result-container" v-if='searchResult'>
        <div>热水用量: {{ searchResult.hot_consum}}</div>
        <div>冷水用量: {{ searchResult.cool_consum}}</div>
        <div>水压: {{ searchResult.water_pressure}}</div>
        <div>水流速度: {{ searchResult.water_speed }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="locate">定位</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="dialogVisible.C"
      title="流量分析"
      :visible.sync="dialogVisible.C"
      width="50%" 
      style="max-height:500px;overflowY:auto">
      <div class="alert-list">
        <ul>
          <!-- 遍历预警信息列表 -->
          <li v-for="(alert, index) in alertList" :key="index" @click="showDetail(index)" class="alert-item">
            {{ alert.time + ':' + alert.building + alert.name + alert.detail}}
          </li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog
      v-if="dialogVisible.B"
      title="空间展示"
      :visible.sync="dialogVisible.B"
      width="50%">
      <div class="select-container">
        <div>
          <div class='select-title'>
            <span >选择用水类型：</span>
          </div>
          <el-select v-model="spaceOption1">
            <el-option
              v-for="(option, index) in spaceOptions1"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <div class='select-title'>
            <span >日期选择：</span>
          </div>
          <el-select v-model="spaceOption2">
            <el-option
              v-for="(option, index) in spaceOptions2"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        <!-- 根据选择的日期范围显示日期选择器 -->
        <div v-if="spaceOption2 === '自定义时间段'">
          <div>
            <div class='select-title'>
              <span >起始日期：</span>
            </div>
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div>
            <div class='select-title'>
              <span >结束日期：</span>
            </div>
            <el-date-picker
              v-model="endDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="renderGeojson">确定</el-button>
      </span>
  </el-dialog>
  
  
  </div>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx';
export default {
  name: 'CardComponent',
  data() {
    return {
      dialogVisible: {
        A: false,
        B: false,
        C: false
      },
      alertList: [ // 预警信息列表
        // 其他预警信息...
      ],
      endDate: '',
      startDate: '',
      hot_consum:'',
      cool_consum:'',
      water_pressure:'',
      water_speed:'',
      selectedOption1: '',
      selectedOption2: '',
      selectedOption3: '',
      selectedOption4: '',
      selectedOption5: '',
      selectedOption6: '',
      searchResult: '',
      hot_water: '',
      cool_water: '',
      Sushe:[],
      Admin:[],
      // options1八个选项
      options1: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' }
      ],
      options2: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' }
      ],
      options3: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' }
      ],
      spaceOption1: '',
      spaceOption2: '',
      spaceOption3: '',
      spaceOptions1: [
        { label: '热水用量', value: '热水用量' },
        { label: '冷水用量', value: '冷水用量' }
      ],
      //当天，近7天，近1个月，自定义时间段
      spaceOptions2: [
        { label: '当天', value: '当天' },
        { label: '近7天', value: '近7天' },
        { label: '近1个月', value: '近1个月' },
        { label: '自定义时间段', value: '自定义时间段' }
      ],
      spaceOptions3: [
        { label: '2020-01-01', value: '2020-01-01' },
        { label: '2020-01-02', value: '2020-01-02' },
        { label: '2020-01-03', value: '2020-01-03' }
      ],
    };
  },
  mounted() {
    // 获取数据
    this.getAllWater();
    this.fetchSushe()
    this.fetchAdmin()

  },
  methods: {
    showDialog(button) {
      // 关闭其他对话框
      this.searchResult = '';
      Object.keys(this.dialogVisible).forEach(key => {
        this.dialogVisible[key] = false;
      });
      // 打开对应的对话框
      this.dialogVisible[button] = true;
    },
    locate() {
      // 定位逻辑
      // 关闭对话框
      this.dialogVisible.A = false;
      this.$emit('locate',this.selectedOption1 + '区' + this.selectedOption2 + '栋')
    },
    search() {
      // 查询逻辑，更新查询结果
      this.searchResult = {};
      // 从三个options中拼接出查询条件
      // 例如：1区1栋1宿舍
      let searchCondition = this.selectedOption1 + '区' + this.selectedOption2 + '栋'
      let sushe =  this.selectedOption3;
              // 数据示例 {
        //     "Id": 1,
        //     "Water_meter_Id": "L0101",
        //     "Water_meter_type": "leng",
        //     "Time": "2022-01-04 05:44:57",
        //     "Locate_Building": "1区1栋",
        //     "Cumulative_water_consumption": "1000",
        //     "Today_water_consumption": "11",
        //     "Water_temperature": "10",
        //     "Hydraulic": "0.3",
        //     "Water_flow_velocity": "1.5"
        // }
      let searchResult_hot = this.hot_water.filter(item => {
        return item.Locate_Building === searchCondition && parseInt(item.Id) === parseInt(sushe)
      })
      let searchResult_cool = this.cool_water.filter(item => {
        return item.Locate_Building === searchCondition && parseInt(item.Id) === parseInt(sushe)
      })
      this.searchResult = {
        hot_consum: searchResult_hot[0].Today_water_consumption,
        cool_consum: searchResult_cool[0].Today_water_consumption,
        water_pressure: searchResult_hot[0].Hydraulic,
        water_speed: searchResult_hot[0].Water_flow_velocity
      }
      
    },
    renderGeojson(){
      this.dialogVisible.B = false;
      this.$emit('renderGeojson', this.spaceOption2 + this.spaceOption1)
    },
    exportToExcel() {
      if(this.searchResult === '') {
        this.$message({
          message: '请先查询数据',
          type: 'warning'
        });
        return;
      }
      // 制作中文字段
      let data = {
        '热水用量': this.searchResult.hot_consum,
        '冷水用量': this.searchResult.cool_consum,
        '水压': this.searchResult.water_pressure,
        '水流速度': this.searchResult.water_speed
      }
      var wb = XLSX.utils.book_new();
      var ws = XLSX.utils.json_to_sheet([data]);
      XLSX.utils.book_append_sheet(wb, ws, "sheet1");
      XLSX.writeFile(wb, this.selectedOption1 + '区' + this.selectedOption2 + '栋' + this.selectedOption3 + '宿舍用水数据'+'.xlsx');
      // 关闭对话框
      this.dialogVisible.C = false;
    },
    showDetail(index) {
      // 点击预警信息，展示详情
      // 从Sushe数组中找到对应的宿舍信息
      // 从Admin数组中找到对应的管理员信息
      this.dialogVisible.B = false;
      let admin = this.Admin.find(item => item.Manage_building === this.alertList[index].building);
      let sushe = this.Sushe.find(item => item.Locate_Building === this.alertList[index].building);
      // 打印出sushe和admin
      console.log(sushe, admin)
      let peoplePhone = {
        sushe: sushe.Header_Phone,
        admin: admin.Phone
      }
      console.log('this.alertList[index].Locate_Building',sushe.Locate_Building)
      this.$emit('locate', sushe.Locate_Building, peoplePhone)
      
    },
    showAlert(){
      this.getAllAlert();
      this.showDialog('B');
    },
    getAllWater(){
      // 同时请求冷水热水两个接口的数据
      axios.all([
        axios.post('http://127.0.0.1:8000/smartschools/Get_Dormitory_Hot_water/'),
        axios.post('http://127.0.0.1:8000/smartschools/Get_Dormitory_Cool_water/')
      ]).then(axios.spread((hotWater, coldWater) => {
        console.log(hotWater.data, coldWater.data)
        this.hot_water = hotWater.data;
        this.cool_water = coldWater.data;
        // 数据示例 {
        //     "Id": 1,
        //     "Water_meter_Id": "L0101",
        //     "Water_meter_type": "leng",
        //     "Time": "2022-01-04 05:44:57",
        //     "Locate_Building": "1区1栋",
        //     "Cumulative_water_consumption": "1000",
        //     "Today_water_consumption": "11",
        //     "Water_temperature": "10",
        //     "Hydraulic": "0.3",
        //     "Water_flow_velocity": "1.5"
        // }
        // 先从所有数据中算出要展示在卡片中的信息，冷热水消耗求和，其余取第一个宿舍的
        this.hot_consum = hotWater.data.reduce((acc, cur) => acc + Number(cur.Today_water_consumption), 0);
        this.cool_consum = coldWater.data.reduce((acc, cur) => acc + Number(cur.Today_water_consumption), 0);
        this.water_pressure = hotWater.data[0].Hydraulic;
        this.water_speed = hotWater.data[0].Water_flow_velocity;    
        // 数据查询模块
      }));
      
    },
    getAllAlert(){
      // 将当日热水用量大于5的宿舍加入预警列表
      // 将当日冷水用量大于5的宿舍加入预警列表
      // 然后拼接数据，如果热水量大于五预警详细信息为，热水用量过大
      // 如果冷水量大于五预警详细信息为，冷水用量过大
      console.log('yu  this.hot_water',this.hot_water[0].Today_water_consumption)
      this.alertList.concat(this.hot_water.filter(item => {
        return parseInt(item.Today_water_consumption) > parseInt(5)
        })
      )
      let al1 = this.hot_water.filter(item => {
        return parseInt(item.Today_water_consumption) > parseInt(80)
        }).map((item)=>{
          return {
            time : item.Time,
            name: item.Id + '宿舍',
            building: item.Locate_Building,
            detail: '热水用量过大'
          }
        })
      let al2 = this.cool_water.filter(item => {
        return parseInt(item.Today_water_consumption) > parseInt(80)
        }).map((item)=>{
          return {
            time : item.Time,
            name: item.Id + '宿舍',
            building: item.Locate_Building,
            detail: '冷水用量过大'
          }
        }) 
      this.alertList = al1.concat(al2)
    },
    fetchSushe() {
        axios.post('http://127.0.0.1:8000/smartschools/Get_Dormitory_table/').then(response => {
          this.Sushe = response.data;
          this.loading = false;
        }).catch(error => console.error('Error fetching data:', error));
    },
    fetchAdmin() {
        axios.post('http://127.0.0.1:8000/smartschools/Get_Administrator_information/').then(response => {
          this.Admin = response.data;
          this.loading = false;
        }).catch(error => console.error('Error fetching data:', error));
      },
  }
};
</script>

<style scoped>
.card {
  position: relative;
  width: 280px;
  height: 200px;
  background-size: cover;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0);
  display: flex;
  background-image: url('@/assets/矩形.png');
  flex-direction: column;
  margin-bottom: 5px;
}
.card-top,
.card-bottom {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.2); /* 半透明背景以区分内容 */
}
.title {
  margin: 0;
  text-align: left; /* 将标题靠左对齐 */
  color: #FFFFFF;
  font-size: 16px;
  line-height: 30px; /* 调整行高使标题垂直居中 */
}
.button-text {
  color: #FFFFFF;
  cursor: pointer;
  font-size: 16px;
  line-height: 30px;
}
.select-title{
  width:100px
}
.card-content {
  flex-grow: 1;
  padding: 2px;
  color: #FFFFFF;
  text-align: left;
  padding-left: 10px;
  background-color: rgba(0, 0, 0, 0.1); /* 半透明背景突出内容区 */
  overflow :hidden;
}
.select-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.alert-item {
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  background-color: #f0ad4e; /* 设置背景色为黄色 */
  color: #fff; /* 设置文字颜色为白色 */
}
.alert-list {
  max-height: 300px; /* 设置最大高度 */
  overflow-y: auto; /* 当内容超过最大高度时，显示垂直滚动条 */
}
/* 自定义滚动条样式 */
.alert-list::-webkit-scrollbar {
  width: 10px;
}

.alert-list::-webkit-scrollbar-track {
  background-color: #f2f2f2;
  border-radius: 5px;
}

.alert-list::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 5px;
}

.alert-list::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.alert-item:hover {
  background-color: #eea236; /* 鼠标悬停时更换颜色 */
}
.result-container {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f5f5f5;
  min-height: 100px;
}
</style>
