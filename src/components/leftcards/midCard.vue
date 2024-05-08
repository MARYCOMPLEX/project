<template>
	<div class="card-wrapper">
		<div class="card">
			<div class="card-top">
				<h1 class="title">电力中心</h1>
				<span class="button-text" @click="showDialog('A')">数据查询</span>
			</div>
			<div class="card-content">
				<div>电压: {{ v}}</div>
				<div>电流: {{ a}}</div>
				<div>功率: {{ w}}</div>
				<div>用电量: {{ totalE }}</div>
			</div>
			<div class="card-bottom">
				<span class="button-text" @click="showAlert">异常预警</span>
				<span class="button-text" @click="showDialog('C')">数据导出</span>
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
				<div>电压: {{ searchResult.v}}</div>
				<div>电流: {{ searchResult.a}}</div>
				<div>功率: {{ searchResult.w}}</div>
				<div>用电量: {{ searchResult.totalE }}</div>
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
        '电压': this.searchResult.v,
        '电流': this.searchResult.a,
        '功率': this.searchResult.w,
        '用电量': this.searchResult.totalE
			}
			var wb = XLSX.utils.book_new();
			var ws = XLSX.utils.json_to_sheet([data]);
			XLSX.utils.book_append_sheet(wb, ws, "sheet1");
			XLSX.writeFile(wb, this.selectedOption1 + '区' + this.selectedOption2 + '栋' + this.selectedOption3 + '宿舍用电数据'+'.xlsx');
			// 关闭对话框
			this.dialogVisible.C = false;
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
			this.getAllAlert();
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
				that.i = that.buildingE[0].Current
				
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
