<template>
	<div class="card-wrapper">
		<div class="card">
			<div class="card-top">
				<h1 class="title">监控中心</h1>
				<span class="button-text" @click="showDialog('A')">检索回放</span>
			</div>
			<div class="card-content">
        <img src="@/assets/监控.png" alt="Placeholder Image" class='placeholder-image'>    
			</div>
			<div class="card-bottom">
				<span class="button-text" @click="showAlert">实时操作</span>
				<span class="button-text" @click="showDialog('C')">远程控制</span>
			</div>
		</div>
		<!-- 弹出框容器 -->
		<el-dialog
			v-if="dialogVisible.A"
			title="数据查询"
			:visible.sync="dialogVisible.A"
			width="50%">
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
				<el-select v-model="selectedOption3" placeholder="宿舍">
					<el-option
						v-for="(option, index) in options3"
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
				<el-button @click="locate">定位</el-button>
				<el-button type="primary" @click="search">查询</el-button>
			</span>
		</el-dialog>

		<el-dialog
			v-if="dialogVisible.B"
			title="异常预警信息"
			:visible.sync="dialogVisible.B"
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
			v-if="dialogVisible.C"
			title="数据导出"
			:visible.sync="dialogVisible.C"
			width="50%">
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
				<el-select v-model="selectedOption3" placeholder="宿舍">
					<el-option
						v-for="(option, index) in options3"
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
							//     "Ammeter": "D0101",
							//     "Time": "2022-02-20 10:13:23",
							//     "Locate_Building": "1区1栋",
							//     "Voltage": "220",
							//     "Current": "5",
							//     "Electrical_power": "8",
							//     "Cumulative_workload": "15000",
							//     "Today_electricity_consumption": "300"
							// }
							
			this.searchResult = {
				hot_consum: searchResult_hot[0].Today_water_consumption,
				cool_consum: searchResult_cool[0].Today_water_consumption,
				water_pressure: searchResult_hot[0].Hydraulic,
				water_speed: searchResult_hot[0].Water_flow_velocity
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
				axios.post('http://127.0.0.1:8000/smartschools/Get_Dormitory_ammeter/'),
				axios.post('http://127.0.0.1:8000/smartschools/Get_Building_ammeter/')
			]).then(axios.spread((bElec, dElec) => {
				console.log("dElec",bElec.data, dElec.data)
				this.buildingE = bElec.data;
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
				this.totalE = this.dormitoryE.reduce((acc, cur) => {
					return acc + parseInt(cur.Today_electricity_consumption)
				}, 0)
				this.w = this.dormitoryE.reduce((acc, cur) => {
					return acc + parseInt(cur.Electrical_power)
				}, 0)
				this.v = this.dormitoryE[0].Voltage
				this.i = this.dormitoryE[0].Current
				
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
	text-align: center; 
	padding-left: 10px;
	background-color: rgba(0, 0, 0, 0.1); /* 半透明背景突出内容区 */
	overflow :hidden;
}
.select-container {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.placeholder-image {
  max-width: 100%; /* 设置图片最大宽度为100% */
  max-height: 95%; /* 设置图片最大高度为100% */
  width: auto; /* 让图片宽度自动调整 */
  height: auto; /* 让图片高度自动调整 */
  object-fit: contain; /* 保持图片比例并完全包含在容器中 */
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
