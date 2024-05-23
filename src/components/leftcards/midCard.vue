<template>
	<div class="card-wrapper">
		<div class="card">
			<div class="card-top">
				<h1 class="title">电力服务</h1>
				<span class="button-text" @click="showDialog('A')">数据查询</span>
			</div>
			<div class="card-content">
				<div>电压: {{ v}}</div>
				<div>电流: {{ a}}</div>
				<div>功率: {{ w}}</div>
				<div>用电量: {{ totalE }}</div>
			</div>
			<div class="card-bottom">
				<span class="button-text" @click="showAlert">空间展示</span>
				<span class="button-text" @click="showDialog('C')">载荷分析</span>
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
        <div>电压: {{ searchResult.v}}</div>
        <div>电流: {{ searchResult.a}}</div>
        <div>功率: {{ searchResult.w}}</div>
        <div>用电量: {{ searchResult.totalE }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="locate">定位</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </span>
	</el-dialog>
    <el-dialog
      v-if="dialogVisible.B"
      title="空间展示"
      :visible.sync="dialogVisible.B"
      width="50%">
      <div class="select-container">
        <div>
          <div class="select-title">
            <span>选择类型：</span>
          </div>
          <el-select v-model="spaceOption1" @change="onTypeChange">
            <el-option
              v-for="(option, index) in typeOptions"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <div class="select-title">
            <span>日期选择：</span>
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
            <div class="select-title">
              <span>起始日期：</span>
            </div>
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div>
            <div class="select-title">
              <span>结束日期：</span>
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
    <el-dialog
      v-if="dialogVisible.C"
      title="载荷分析"
      :visible.sync="dialogVisible.C"
      width="50%" 
      style="max-height:600px;overflowY:hidden">
      <div class="select-container">
      
      <div>
        <div class='select-title'>
          <span >选择类型：</span>
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
      <el-row>
        <el-col :span="12">
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
      </el-col>
      <el-col :span="12">
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
      </el-col>
      </el-row>
        <div>
          <div class='select-title'>
            <span >日期选择：</span>
          </div>
          <el-select v-model="analysisOption2">
            <el-option
              v-for="(option, index) in analysisOptions2"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        <!-- 根据选择的日期范围显示日期选择器 -->
        <div v-if="analysisOption2 === '自定义时间段'">
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
        <el-button type="primary" @click="renderChart">确定</el-button>
      </span>
  </el-dialog>
    <el-dialog :visible="showChart" title="用电统计" width="700px" @close="closeChart" style="height: 700px; overflowY:hidden">
      <div ref="chart" style="width: 100%;height:500px"></div>
    </el-dialog>
	</div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
	name: 'CardComponent',
	data() {
		return {
			dialogVisible: {
				A: false,
				B: false,
				C: false
			},
      //当天，近7天，近1个月，自定义时间段
      spaceOptions2: [
        { label: '当天', value: '当天' },
        { label: '自定义时间段', value: '自定义时间段' }
      ],
      showChart: false,
      analysisOptions1: [
        { label: '热水用量', value: '热水用量' },
        { label: '冷水用量', value: '冷水用量' }
      ],
      analysisOption2: '',
      analysisOptions2: [
        { label: '当天', value: '当天' },
        { label: '自定义时间段', value: '自定义时间段' }
      ],
      analysisData:{
        '1区1栋当天电功率':
        {
            x: [
                "0-2", "2-4", "4-6", "6-8", "8-10", "10-12",
                "12-14", "14-16", "16-18", "18-20", "20-22", "22-24"
            ],
            y: [
                256, 124, 115, 815, 748, 804,
                785, 818, 854, 814, 1512, 856
            ]
        },
        '1区1栋当天用电量':
        {
            x: [
                "0-2", "2-4", "4-6", "6-8", "8-10", "10-12",
                "12-14", "14-16", "16-18", "18-20", "20-22", "22-24"
            ],
            y: [
                15, 8, 7, 39, 28, 33,
                49, 34, 41, 46, 52, 57
            ]
        },
      },
      spaceOption1: '',
      spaceOption2: '',
      startDate: '',
      endDate: '',
      typeOptions: [
        { label: '电功率', value: '电功率' },
        { label: '用电量', value: '用电量' }
      ],
      spaceOptions1: [
        { label: '电功率', value: '电功率' },
        { label: '用电量', value: '用电量' }
      ],
      analysisOptions1: [
        { label: '电功率', value: '电功率' },
        { label: '用电量', value: '用电量' }
      ],
      analysisOptions2:[
        { label: '当天', value: '当天' },
        { label: '自定义时间段', value: '自定义时间段' }
      ],
			v: 0,
			a: 0,
			w: 0,
			totalE: 0,
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
			buildingE: '',
			dormitoryE: '',
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
			]
		};
	},
	mounted() {
		// 获取数据
		this.getAllEle()
		this.fetchSushe()
		this.fetchAdmin()

	},
	methods: {
    renderChart(){
      this.dialogVisible.C = false;
      // 获取当前日期
      let date = ''
      if(this.analysisOption2==='当天'){
        date = new Date().toLocaleDateString()
      }
      let c =  this.selectedOption1 + '区' + this.selectedOption2 + '栋' + this.analysisOption2 + this.spaceOption1
      let title = this.selectedOption1 + '区' + this.selectedOption2 + '栋' + date === '' ? this.analysisOption2:date + this.spaceOption1
      this.showChart = true;
      if (this.analysisData[c]) {
      this.$nextTick(() => {
        this.chart = echarts.init(this.$refs.chart);
        // 指定图表的配置项和数据
        const option = {
          title: {
            text: `${c}统计`
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
              type: 'cross', // 显示交叉指示器
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            right: 20,
            feature: {
              saveAsImage: {},
              restore: {},
              dataView: {},
              dataZoom: {},
              magicType: {
                type: ['line', 'bar'] // 支持切换为折线图和柱状图
              },
            }
          },
          xAxis: {
            type: 'category',
            data: this.analysisData[c].x,
            name: '时间', // 设置横坐标名称
            axisPointer: {
              type: 'shadow' // 鼠标悬停时显示阴影
            }
          },
          yAxis: [
            {
              type: 'value',
              name: '用量', // 设置纵坐标名称
              min: 0,
              position: 'left',
              axisLine: {
                lineStyle: {
                  color: '#5470C6'
                }
              }
            },
            {
              type: 'value',
              name: '数值', // 设置第二纵坐标名称
              min: 0,
              position: 'right',
              axisLine: {
                lineStyle: {
                  color: '#91CC75'
                }
              }
            }
          ],
          series: [
            {
              name: '用量',
              type: 'bar',
              data: this.analysisData[c].y,
              itemStyle: {
                color: '#5470C6'
              },
              yAxisIndex: 0 // 关联到第一个 y 轴
            },
            {
              name: '趋势',
              type: 'line',
              data: this.analysisData[c].y,
              itemStyle: {
                color: '#91CC75'
              },
              yAxisIndex: 1 // 关联到第二个 y 轴
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        this.chart.setOption(option);
      });
      } else {
        this.$message.error('暂无数据');
        this.showChart = false;
      }
    },
    closeChart(){
      this.showChart = false;
    },
    renderGeojson(){
      this.dialogVisible.B = false;
      this.$emit('renderGeojson', this.spaceOption2 + this.spaceOption1)
    },
    onTypeChange(value) {
      if (value === '电功率') {
        this.spaceOptions2 = [
          { label: '当前', value: '当前' },
          { label: '自定义时间段', value: '自定义时间段' }
        ];
      } else if (value === '用电量') {
        this.spaceOptions2 = [
          { label: '当天', value: '当天' },
          { label: '自定义时间段', value: '自定义时间段' }
        ];
      }
      // 清空当前选择的日期选项
      this.spaceOption2 = '';
    },
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
      //       {
      //     "Id": 6,
      //     "Ammeter": "D01060101",
      //     "Time": "2022-06-28 00:23:23",
      //     "Locate_Building": "1区6栋",
      //     "Voltage": "220",
      //     "Current": "6",
      //     "Electrical_power": "5",
      //     "Cumulative_workload": "500",
      //     "Today_electricity_consumption": "20"
      // }
      // 判断Ammeter最后两位的数字与sushe
      this.dormitoryE = this.dormitoryE.filter(item => item.Locate_Building === searchCondition)
      let dormitoryE = this.dormitoryE
			console.log('找到宿舍', this.dormitoryE[0])				
			this.searchResult = {
				v: dormitoryE[0].Voltage,
				a: dormitoryE[0].Current,
				w: dormitoryE[0].Cumulative_workload,
				totalE: dormitoryE[0].Today_electricity_consumption
			}
      console.log(this.searchResult)
			
		},
		showDetail(index) {
			// 点击预警信息，展示详情
			// 从Sushe数组中找到对应的宿舍信息
			// 从Admin数组中找到对应的管理员信息
      		console.log('this.alertList[index]',this.alertList[index])
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
			this.showDialog('B');
		},
		getAllEle(){
      let that = this
			axios.all([
				axios.post('http://127.0.0.1:8000/smartschools/Get_Dormitory_ammeter/'),
				axios.post('http://127.0.0.1:8000/smartschools/Get_Building_ammeter/')
			]).then(axios.spread((dElec, bElec) => {
				console.log("dElec",bElec.data, dElec.data)
				that.buildingE = bElec.data;
				that.dormitoryE = dElec.data;	
				// 数据示例 {
				//     "Id": 1,
				//     "Ammeter": "D0101",
				//     "Time": "2022-02-20 10:13:23",
				//     "Locate_Building": "1区1栋",
				//     "Voltage": "220",
				//     "Current": "5",
				//     "Electrical_power": "8",
				//     "Cumulative_workload": "15000",
				//     "Today_electricity_consumption": "300"
				// }
				// 先从所有数据中算出要展示在卡片中的信息，Today_electricity_consumption求和，其余取第一个宿舍的
				that.totalE = that.buildingE.reduce((acc, cur) => {
					return acc + parseInt(cur.Today_electricity_consumption)
				}, 0)
				that.w = that.buildingE.reduce((acc, cur) => {
					return acc + parseInt(cur.Electrical_power)
				}, 0)
				that.v = that.buildingE[0].Voltage
				that.a = that.buildingE[0].Current
				
				// 数据查询模块
			}));
			
		},
		getAllAlert(){
			// 将当日功率大于100的宿舍加入预警列表
			// 将当日用电量大于1的宿舍加入预警列表
			// 然后拼接数据，如果功率大于100预警详细信息为，功率用量过大
			// 如果用电量大于1预警详细信息为，用电量过大
			console.log('电力浴巾',this.dormitoryE)

			let al1 = this.dormitoryE.filter(item => {
				return parseInt(item.Electrical_power) > parseInt(5)
				}).map((item)=>{
					return {
						time : item.Time,
						name: item.Id + '宿舍',
						building: item.Locate_Building,
            detail: '功率用量过大'
					}
				})
			let al2 = this.dormitoryE.filter(item => {
				return parseInt(item.Today_electricity_consumption) > parseInt(5)
				}).map((item)=>{
					return {
						time : item.Time,
						name: item.Id + '宿舍',
						building: item.Locate_Building,
						detail: '用电量过大'
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
