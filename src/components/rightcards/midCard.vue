<template>
	<div class="card-wrapper">
		<div class="card">
			<div class="card-top">
				<h1 class="title">安防中心</h1>
				<span class="button-text" @click="showDialog('A')">维护分析</span>
			</div>
			<div class="card-content" ref='content'>
        <div v-for="(device, index) in security_device" :key="index" class='scroll'>{{ device.show }}</div>
			</div>
			<!-- <div class="card-bottom">
				<span class="button-text" @click="showAlert">异常预警</span>
				<span class="button-text" @click="showDialog('C')">数据导出</span>
			</div> -->
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
				<div>设备ID: {{ searchResult.Security_equipment_Id}}</div>
				<div>所属楼栋: {{ searchResult.Locate_floor}}</div>
				<div>更换时间: {{ searchResult.Replacement_time}}</div>
				<div>运行状态: {{ searchResult.Access_status }}</div>
        <div>保质期: {{ searchResult.Shelf_life }}</div>
        <div>下次检修时间: {{ searchResult.Turnaround_time }}</div>
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
						{{  alert.building + alert.detail}}
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
			</div>
			<div class="result-container" v-if='searchResult'>
				<div>设备类型: {{ searchResult.Security_equipment_Id + searchResult.type }}</div>
				<div>所属楼栋: {{ searchResult.Locate_floor}}</div>
				<div>更换时间: {{ searchResult.Replacement_time}}</div>
				<div>运行状态: {{ searchResult.Access_status }}</div>
        <div>保质期: {{ searchResult.Shelf_life }}</div>
        <div>下次检修时间: {{ searchResult.Turnaround_time }}</div>
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
    startAutoScroll() {
        // 每隔一定时间滚动一次
        this.intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 4) % this.security_device.length;
        }, 3000); // 3000毫秒（3秒）滚动一次
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
      //       {
      //     "Id": 1,
      //     "Security_equipment_Id": "Y010101",
      //     "Locate_floor": "1区1栋",
      //     "Shelf_life": "3",
      //     "Replacement_time": "2022-09-04 00:13:05",
      //     "Turnaround_time": "2022-10-31 12:06:16",
      //     "Access_status": "true"
      // }
      let search_security_device = this.security_device.filter(item => item.Locate_floor === searchCondition)
			
			this.searchResult = {
        type:search_security_device.Security_equipment_Id === 'Y' ? '烟雾报警器' : '灭火器',
        Security_equipment_Id: search_security_device[0].Security_equipment_Id,
				Locate_floor: search_security_device[0].Locate_floor,
				Replacement_time: search_security_device[0].Replacement_time,
				Access_status: search_security_device[0].Access_status === true ? '正常' : '异常',
				Shelf_life: search_security_device[0].Shelf_life,
        Turnaround_time: search_security_device[0].Turnaround_time
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
      // 				<div>设备ID: {{ searchResult.Security_equipment_Id}}</div>
				// <div>所属楼栋: {{ searchResult.Locate_floor}}</div>
				// <div>更换时间: {{ searchResult.Replacement_time}}</div>
				// <div>运行状态: {{ searchResult.Access_status }}</div>
        // <div>保质期: {{ searchResult.Shelf_life }}</div>
        // <div>下次检修时间: {{ searchResult.Turnaround_time }}</div>
			let data = {
        设备ID: this.searchResult.Security_equipment_Id,
        所属楼栋: this.searchResult.Locate_floor,
        更换时间: this.searchResult.Replacement_time,
        运行状态: this.searchResult.Access_status,
        保质期: this.searchResult.Shelf_life,
        下次检修时间: this.searchResult.Turnaround_time
			}
			var wb = XLSX.utils.book_new();
			var ws = XLSX.utils.json_to_sheet([data]);
			XLSX.utils.book_append_sheet(wb, ws, "sheet1");
			XLSX.writeFile(wb, this.selectedOption1 + '区' + this.selectedOption2 + '栋' + this.selectedOption3 + '安防设备数据'+'.xlsx');
			// 关闭对话框
			this.dialogVisible.C = false;
		},
		showDetail(index) {
			// 点击预警信息，展示详情
			// 从Sushe数组中找到对应的宿舍信息
			// 从Admin数组中找到对应的管理员信息
			this.dialogVisible.B = false;
      console.log('点击的预警信息',this.alertList[index].building)
			let admin = this.Admin.find(item => item.Manage_building === this.alertList[index].building);
			let sushe = this.Sushe.find(item => item.Locate_Building === this.alertList[index].building);
			// 打印出sushe和admin
			// console.log('sushehesdasda',this.Admin)
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
				axios.post('http://127.0.0.1:8000/smartschools/Get_Security_equipment/'),
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
          let type = item.Security_equipment_Id[0] === 'Y' ? '烟雾报警器' : '灭火器';
          let status = item.Access_status === 'true' ? '正常' : '异常';
          item.show = item.Locate_floor + type + status;
          return item;
        })
				// 数据查询模块
			}));
			
		},
		getAllAlert(){
      // 找出状态为异常
      let al1 = this.security_device.filter(item => {
				return item => item.Access_status !== 'true'
				}).map((item)=>{
					return {
						time : item.Time,
						building: item.Locate_floor,
            detail: item.Security_equipment_Id[0] === 'Y' ? '烟雾报警器' : '灭火器' + '异常'
					}
				})
      this.alertList = al1
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
  animation: scroll 10s linear infinite; 
}

@keyframes scroll {
  0% {
      transform: translateY(0); /* 初始状态：不偏移 */
  }
  100% {
      transform: translateY(-1000%); /* 终止状态：向上偏移100%的高度 */
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
