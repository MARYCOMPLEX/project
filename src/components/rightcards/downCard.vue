<template>
	<div class="card-wrapper">
		<div class="card">
			<div class="card-top">
				<h1 class="title">异常预警</h1>
				<span class="button-text" @click="showDialog('A')">警情处理</span>
			</div>
			<div class="card-content" ref='content'>
        <div v-for="(alert, index) in alerts" :key="index" class="scroll" :class="getAlertLevelClass(alert)">
          {{ alert['预警信息'] }}
        </div>
			</div>
		</div>
		<!-- 弹出框容器 -->
    <el-dialog
      :visible.sync="dialogVisible.A"
      title="预警信息"
      width="50%"
      :append-to-body="true"
      :style="{ 'max-height': '80vh', 'overflow-y': 'auto' }"
    >
      <el-scrollbar wrap-class="scroll-wrapper" view-class="scroll-view">
        <el-table :data="alerts" style="width: 100%">
          <el-table-column prop="时间" label="时间"></el-table-column>
          <el-table-column prop="所在楼栋" label="所在楼栋"></el-table-column>
          <el-table-column prop="预警级别" label="预警级别">
            <template slot-scope="scope">
              <el-button
                :type="getAlertLevelButtonType(scope.row['预警级别'])"
                size="mini"
              >
                {{ scope.row['预警级别'] }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="预警信息" label="预警信息"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" @click="handleAlert(scope.$index)">处理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-dialog>


		<el-dialog
			v-if="dialogVisible.C"
			title="数据导出"
			:visible.sync="dialogVisible.C"
			width="50%"
      style='height:800;overflowY:hidden'>
			<div class="select-container">
				<el-select v-model="selectedOption1" placeholder="区域">
					<el-option
						v-for="(option, index) in options1"
						:key="index"
						:label="option.label"
						:value="option.value">
					</el-option>
				</el-select>
				<el-select v-model="selectedOption2" placeholder="楼栋">
					<el-option
						v-for="(option, index) in options2"
						:key="index"
						:label="option.label"
						:value="option.value">
					</el-option>
				</el-select>
			</div>
			<div class="result-container" v-if='searchResult'>
				<div>热水用量: {{ searchResult.hot_consum}}</div>
				<div>冷水用量: {{ searchResult.cool_consum}}</div>
				<div>水压: {{ searchResult.water_pressure}}</div>
				<div>水流速度: {{ searchResult.water_speed }}</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="exportToExcel">导出</el-button>
				<el-button type="primary" @click="search">查询</el-button>
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
			v: 0,
			a: 0,
			w: 0,
      alerts:[
        {
            "时间": "2024/4/7 23:59",
            "所在楼栋": "1区1栋",
            "预警级别": "一级",
            "预警信息": "赵六3天未回宿舍",
            "学生/管理员姓名": "赵六",
            "学生/管理员电话": "15759179592"
        },
        {
            "时间": "2024/4/10 22:26",
            "所在楼栋": "2区5栋",
            "预警级别": "一级",
            "预警信息": "4楼烟雾报警器报警",
            "学生/管理员姓名": "张十一",
            "学生/管理员电话": "15675614261"
        },
        {
            "时间": "2024/4/10 22:28",
            "所在楼栋": "2区5栋",
            "预警级别": "一级",
            "预警信息": "4楼消防栓被使用",
            "学生/管理员姓名": "张十一",
            "学生/管理员电话": "15675614261"
        },
        {
            "时间": "2024/4/12 18:30",
            "所在楼栋": "5区3栋",
            "预警级别": "一级",
            "预警信息": "3楼灭火器被使用",
            "学生/管理员姓名": "张三十四",
            "学生/管理员电话": "15591363854"
        },
        {
            "时间": "2024/4/5 21:12",
            "所在楼栋": "1区3栋",
            "预警级别": "二级",
            "预警信息": "1区1栋108宿舍冷水用量超标",
            "学生/管理员姓名": "张三",
            "学生/管理员电话": "18869088750"
        },
        {
            "时间": "2024/4/6 22:12",
            "所在楼栋": "1区6栋",
            "预警级别": "二级",
            "预警信息": "1区6栋408宿舍用电功率过高",
            "学生/管理员姓名": "张六",
            "学生/管理员电话": "17647577204"
        },
        {
            "时间": "2024/4/7 22:45",
            "所在楼栋": "3区1栋",
            "预警级别": "二级",
            "预警信息": "3区1栋101宿舍热水用量超标",
            "学生/管理员姓名": "张十八",
            "学生/管理员电话": "15055213577"
        },
        {
            "时间": "2024/4/7 23:59",
            "所在楼栋": "4区2栋",
            "预警级别": "二级",
            "预警信息": "4区2栋311宿舍24小时连续用水",
            "学生/管理员姓名": "张二十五",
            "学生/管理员电话": "17051336024"
        },
        {
            "时间": "2024/4/8 22:06",
            "所在楼栋": "5区4栋",
            "预警级别": "二级",
            "预警信息": "5区4栋115宿舍用电功率过高",
            "学生/管理员姓名": "张三十五",
            "学生/管理员电话": "15554318367"
        },
        {
            "时间": "2024/4/9 10:39",
            "所在楼栋": "6区3栋",
            "预警级别": "二级",
            "预警信息": "6区3栋S06003号摄像头不在线",
            "学生/管理员姓名": "张四十二",
            "学生/管理员电话": "15788509278"
        },
        {
            "时间": "2024/4/9 21:39",
            "所在楼栋": "3区5栋",
            "预警级别": "二级",
            "预警信息": "3区5栋203宿舍热水用量超标",
            "学生/管理员姓名": "张二十二",
            "学生/管理员电话": "14562884869"
        },
        {
            "时间": "2024/4/10 23:59",
            "所在楼栋": "7区5栋",
            "预警级别": "二级",
            "预警信息": "7区5栋30个灭火器还有3天过期",
            "学生/管理员姓名": "张五十一",
            "学生/管理员电话": "15060080303"
        },
        {
            "时间": "2024/4/11 12:45",
            "所在楼栋": "8区16栋",
            "预警级别": "二级",
            "预警信息": "8区16栋M08003号灭火器不在线",
            "学生/管理员姓名": "张七十二",
            "学生/管理员电话": "17262308159"
        }
    ],
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
			hot_water: '',
			cool_water: '',
			Sushe:[],
			Admin:[],
      security_device:'',
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
      currentIndex: 0, // 当前显示的索引
		};
	},
	mounted() {
		// 获取数据
		this.getAllEle()
		this.fetchSushe()
		this.fetchAdmin()
    this.startAutoScroll();

	},
  destroyed() {
      // 在组件销毁前清除定时器
      this.stopAutoScroll();
  },
	methods: {
    handleAlert(index) {
      // 处理预警信息，这里可以根据 index 删除对应的预警信息
      this.alerts.splice(index, 1);
    },
    getAlertLevelStyle(level) {
      return level === '一级' ? { color: 'red' } : { color: 'yellow' };
    },
    getAlertLevelClass(alert) {
      return alert['预警级别'] === '一级' ? 'red' : 'yellow';
    },
    startAutoScroll() {
        // 每隔一定时间滚动一次
        this.intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 4) % this.security_device.length;
        }, 3000); // 3000毫秒（3秒）滚动一次
    },
    getAlertLevelButtonType(level) {
      return level === '一级' ? 'danger' : 'warning';
    },
    stopAutoScroll() {
        // 清除定时器
        clearInterval(this.intervalId);
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
            //             {
            //     "Id": 1,
            //     "Name": "1区1栋管理员",
            //     "Age": "50",
            //     "Gender": "男",
            //     "Phone": "17533385890",
            //     "Manage_building": "1区1栋"
            // }
      let search_security_device = this.security_device.filter(item => item.Manage_building === searchCondition)	
			this.searchResult = {
				Name: search_security_device[0].Name,
				Age: search_security_device[0].Age,
				Gender: search_security_device[0].Gender,
				Phone: search_security_device[0].Phone,
			}
			
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
			let admin = this.Admin.find(item => item.Locate_Building === this.alertList[index].Locate_Building);
			let sushe = this.Sushe.find(item => item.Manage_building === this.alertList[index].Locate_Building);
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
		getAllEle(){
			// 同时请求冷水热水两个接口的数据
			axios.all([
				axios.post('http://127.0.0.1:8000/smartschools/Get_Administrator_information/'),
				axios.post('http://127.0.0.1:8000/smartschools/Get_Building_ammeter/')
			]).then(axios.spread((bElec, dElec) => {
				console.log("dElec",bElec.data, dElec.data)
				this.security_device = bElec.data;
				this.dormitoryE = dElec.data;	
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
        console.log(this.security_device)
        // 通过Security_equipment_Id字段的首字母确认设备类型。Y为烟雾报警器，M为灭火器
        // 拼接一个字符串，展示在卡片中
        // 例如：1区1栋1楼烟雾报警器异常 就是Locate_Building + type + access_STATUS 的false为异常，true为正常
        this.security_device = this.security_device.map(item => {
          item.show = item.Manage_building + ':' + item.Name;
          return item;
        })
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
.card-content {
	flex-grow: 1;
	padding: 2px;
	color: #FFFFFF;
	text-align: left;
	padding-left: 10px;
	background-color: rgba(0, 0, 0, 0.1); /* 半透明背景突出内容区 */
	overflow :hidden;

}
.scroll{
  animation: scroll 9s linear infinite; 
}

@keyframes scroll {
  0% {
      transform: translateY(0); /* 初始状态：不偏移 */
  }
  100% {
      transform: translateY(-460%); /* 终止状态：向上偏移100%的高度 */
  }
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
.scroll-wrapper {
  height: 500px;
  overflow-y: auto;
}
.alert-list::-webkit-scrollbar-track {
	background-color: #f2f2f2;
	border-radius: 5px;
}
.scroll-wrapper {
  max-height: 600px;
  overflow-y: hidden;
}

.scroll-view {
  max-height: 600px;
}
.red {
  color: red;
  font-weight: bold;
}
.yellow {
  color: yellow;
  font-weight: bold;
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
