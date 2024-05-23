<template>
	<div class="card-wrapper">
	  <div class="card">
		<div class="card-top">
		  <h1 class="title">监控中心</h1>
		  <span class="button-text" @click="showDialog('A')">检索回放</span>
		</div>
		<div class="card-content">
		  <img v-if="!showVideo" src="@/assets/监控.png" alt="Placeholder Image" class="media">
		  <video v-if="showVideo" ref="videoPlayer" id="videoPlayer" class="video-js vjs-default-skin media" controls data-setup='{}'>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?sd" type='video/mp4' label='SD' res='480'/>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?hd" type='video/mp4' label='HD' res='1080'/>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?phone" type='video/mp4' label='Phone' res='144'/>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?4k" type='video/mp4' label='4K' res='2160'/>
		  </video>
		</div>
		<div class="card-bottom">
		  <span class="button-text" @click="showRealTimeDialog">实时操作</span>
		  <span class="button-text" @click="showDialog('C')">远程控制</span>
		</div>
	  </div>
  
	  <!-- 实时操作选择摄像头编号 -->
	  <el-dialog
		v-if="dialogVisible.realTime"
		title="选择摄像头编号"
		:visible.sync="dialogVisible.realTime"
		width="30%"
		@closed="resetRealTimeDialog">
		<div class="select-container">
		  <el-select v-model="selectedCamera" placeholder="选择摄像头编号">
			<el-option label="S01001" value="1"></el-option>
			<el-option label="S01002" value="2"></el-option>
			<el-option label="S01003" value="3"></el-option>
			<el-option label="S01004" value="4"></el-option>
		  </el-select>
		</div>
		<span slot="footer" class="dialog-footer">
		  <el-button type="primary" @click="playRealTimeVideo">播放</el-button>
		</span>
	  </el-dialog>
  
	  <!-- 数据查询和视频播放 -->
	  <el-dialog
		v-if="dialogVisible.A"
		title="检索回放"
		:visible.sync="dialogVisible.A"
		width="60%"
		@closed="resetSearchDialog">
		<div class="horizontal-container">
		  <el-select v-model="selectedCamera" placeholder="选择摄像头编号">
			<el-option label="S01001" value="1"></el-option>
			<el-option label="S01002" value="2"></el-option>
			<el-option label="S01003" value="3"></el-option>
			<el-option label="S01004" value="4"></el-option>
		  </el-select>
		  <el-date-picker
			v-model="startDate"
			type="datetime"
			placeholder="选择开始时间">
		  </el-date-picker>
		  <el-date-picker
			v-model="endDate"
			type="datetime"
			placeholder="选择结束时间">
		  </el-date-picker>
		</div>
		<div class="video-container" v-if="dialogVideoVisible" ref="dialogVideoContainer">
		  <video ref="dialogVideoPlayer" id="dialogVideoPlayer" class="video-js vjs-default-skin dialog-video" controls data-setup='{}'>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?sd" type='video/mp4' label='SD' res='480'/>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?hd" type='video/mp4' label='HD' res='1080'/>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?phone" type='video/mp4' label='Phone' res='144'/>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?4k" type='video/mp4' label='4K' res='2160'/>
		  </video>
		</div>
		<span slot="footer" class="dialog-footer">
		  <el-button type="primary" @click="playDialogVideo">播放视频</el-button>
		</span>
	  </el-dialog>
  
	  <!-- 远程控制 -->
	  <el-dialog
		v-if="dialogVisible.C"
		title="远程控制"
		:visible.sync="dialogVisible.C"
		width="60%"
		@closed="resetControlDialog">
		<div class="horizontal-container">
		  <el-select v-model="selectedCamera" placeholder="选择摄像头编号">
			<el-option label="S01001" value="1"></el-option>
			<el-option label="S01002" value="2"></el-option>
			<el-option label="S01003" value="3"></el-option>
			<el-option label="S01004" value="4"></el-option>
		  </el-select>
		</div>
		<div class="video-container" v-if="controlVideoVisible" ref="controlVideoContainer">
		  <video ref="controlVideoPlayer" id="controlVideoPlayer" class="video-js vjs-default-skin dialog-video" controls data-setup='{}'>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?sd" type='video/mp4' label='SD' res='480'/>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?hd" type='video/mp4' label='HD' res='1080'/>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?phone" type='video/mp4' label='Phone' res='144'/>
			<source src="https://vjs.zencdn.net/v/oceans.mp4?4k" type='video/mp4' label='4K' res='2160'/>
		  </video>
		</div>
		<span slot="footer" class="dialog-footer">
		  <el-button type="primary" @click="playControlVideo">播放视频</el-button>
		</span>
	  </el-dialog>
	</div>
  </template>
  
  <script>
  import axios from 'axios';
  import * as XLSX from 'xlsx';
  import videojs from 'video.js';
  import 'video.js/dist/video-js.css';
  import 'videojs-resolution-switcher';
  
  export default {
	name: 'CardComponent',
	data() {
	  return {
		dialogVisible: {
		  A: false,
		  B: false,
		  C: false,
		  realTime: false
		},
		alertList: [],
		v: 0,
		a: 0,
		w: 0,
		totalE: 0,
		hot_consum: '',
		cool_consum: '',
		water_pressure: '',
		water_speed: '',
		selectedOption1: '',
		selectedOption2: '',
		selectedOption3: '',
		selectedOption4: '',
		selectedOption5: '',
		selectedOption6: '',
		searchResult: '',
		hot_water: '',
		cool_water: '',
		Sushe: [],
		Admin: [],
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
		showVideo: false,
		dialogVideoVisible: false,
		controlVideoVisible: false,
		selectedCamera: null,
		startDate: null,
		endDate: null,
		videoSrc: '',
		dialogVideoSrc: '',
		controlVideoSrc: '',
		player: null,
		dialogPlayer: null,
		controlPlayer: null,
		realTimePlayer: null
	  };
	},
	mounted() {
	  this.getAllEle();
	  this.fetchSushe();
	  this.fetchAdmin();
	},
	methods: {
	  showDialog(button) {
		this.searchResult = '';
		Object.keys(this.dialogVisible).forEach(key => {
		  this.dialogVisible[key] = false;
		});
		this.dialogVisible[button] = true;
	  },
	  showRealTimeDialog() {
		this.dialogVisible.realTime = true;
	  },
	  locate() {
		this.dialogVisible.A = false;
		this.$emit('locate', this.selectedOption1 + '区' + this.selectedOption2 + '栋');
	  },
	  search() {
		this.searchResult = {};
		let searchCondition = this.selectedOption1 + '区' + this.selectedOption2 + '栋';
		let sushe = this.selectedOption3;
  
		this.searchResult = {
		  hot_consum: searchResult_hot[0].Today_water_consumption,
		  cool_consum: searchResult_cool[0].Today_water_consumption,
		  water_pressure: searchResult_hot[0].Hydraulic,
		  water_speed: searchResult_hot[0].Water_flow_velocity
		};
	  },
	  exportToExcel() {
		if (this.searchResult === '') {
		  this.$message({
			message: '请先查询数据',
			type: 'warning'
		  });
		  return;
		}
  
		let data = {
		  '热水用量': this.searchResult.hot_consum,
		  '冷水用量': this.searchResult.cool_consum,
		  '水压': this.searchResult.water
		};
		var wb = XLSX.utils.book_new();
		var ws = XLSX.utils.json_to_sheet([data]);
		XLSX.utils.book_append_sheet(wb, ws, "sheet1");
		XLSX.writeFile(wb, this.selectedOption1 + '区' + this.selectedOption2 + '栋' + this.selectedOption3 + '宿舍用水数据' + '.xlsx');
		this.dialogVisible.C = false;
	  },
	  playVideo() {
		if (this.selectedCamera) {
		  this.videoSrc = require(`@/assets/${this.selectedCamera}.mp4`);
		  this.showVideo = true;
		  this.dialogVisible.realTime = false;
		  this.$nextTick(() => {
			this.player = videojs(this.$refs.videoPlayer, {
			  plugins: {
				videoJsResolutionSwitcher: {
				  default: 'high',
				  dynamicLabel: true
				}
			  }
			});
			this.player.src([
			  { src: require('@/assets/video-low.mp4'), type: 'video/mp4', label: '低质量', res: 360 },
			  { src: require('@/assets/video-high.mp4'), type: 'video/mp4', label: '高质量', res: 720 }
			]);
			this.player.on('resolutionchange', () => {
			  console.log('Source changed to %s', this.player.src());
			});
			this.player.play();
		  });
		}
	  },
	  playDialogVideo() {
		if (this.selectedCamera && this.startDate && this.endDate) {
		  this.dialogVideoSrc = require(`@/assets/1.mp4`);
		  this.dialogVideoVisible = true;
		  this.$nextTick(() => {
			this.dialogPlayer = videojs(this.$refs.dialogVideoPlayer, {
			  plugins: {
				videoJsResolutionSwitcher: {
				  default: 'high',
				  dynamicLabel: true
				}
			  }
			});
			this.dialogPlayer.src([
			  { src: require('@/assets/video-low.mp4'), type: 'video/mp4', label: '低质量', res: 360 },
			  { src: require('@/assets/video-high.mp4'), type: 'video/mp4', label: '高质量', res: 720 }
			]);
			this.dialogPlayer.on('resolutionchange', () => {
			  console.log('Source changed to %s', this.dialogPlayer.src());
			});
			this.adjustVideoContainerHeight();
			this.dialogPlayer.play();
		  });
		}
	  },
	  playControlVideo() {
		if (this.selectedCamera) {
		  this.controlVideoSrc = require(`@/assets/${this.selectedCamera}.mp4`);
		  this.controlVideoVisible = true;
		  this.$nextTick(() => {
			this.controlPlayer = videojs(this.$refs.controlVideoPlayer, {
			  plugins: {
				videoJsResolutionSwitcher: {
				  default: 'high',
				  dynamicLabel: true
				}
			  }
			});
			this.controlPlayer.src([
			  { src: require('@/assets/video-low.mp4'), type: 'video/mp4', label: '低质量', res: 360 },
			  { src: require('@/assets/video-high.mp4'), type: 'video/mp4', label: '高质量', res: 720 }
			]);
			this.controlPlayer.on('resolutionchange', () => {
			  console.log('Source changed to %s', this.controlPlayer.src());
			});
			this.adjustControlVideoContainerHeight();
			this.controlPlayer.play();
		  });
		}
	  },
	  playRealTimeVideo() {
		if (this.selectedCamera) {
		  this.videoSrc = require(`@/assets/${this.selectedCamera}.mp4`);
		  this.showVideo = true;
		  this.dialogVisible.realTime = false;
		  this.$nextTick(() => {
			this.realTimePlayer = videojs(this.$refs.realTimeVideoPlayer, {
			  plugins: {
				videoJsResolutionSwitcher: {
				  default: 'high',
				  dynamicLabel: true
				}
			  }
			});
			this.realTimePlayer.src([
			  { src: require('@/assets/video-low.mp4'), type: 'video/mp4', label: '低质量', res: 360 },
			  { src: require('@/assets/video-high.mp4'), type: 'video/mp4', label: '高质量', res: 720 }
			]);
			this.realTimePlayer.on('resolutionchange', () => {
			  console.log('Source changed to %s', this.realTimePlayer.src());
			});
			this.realTimePlayer.play();
		  });
		}
	  },
	  adjustVideoContainerHeight() {
		this.$refs.dialogVideoContainer.style.minHeight = '300px'; // 根据需要设置最小高度
	  },
	  adjustControlVideoContainerHeight() {
		this.$refs.controlVideoContainer.style.minHeight = '300px'; // 根据需要设置最小高度
	  },
	  resetRealTimeDialog() {
		this.selectedCamera = null;
		this.showVideo = false;
		if (this.realTimePlayer) {
		  this.realTimePlayer.dispose();
		  this.realTimePlayer = null;
		}
	  },
	  resetSearchDialog() {
		this.selectedCamera = null;
		this.startDate = null;
		this.endDate = null;
		this.dialogVideoVisible = false;
		if (this.dialogPlayer) {
		  this.dialogPlayer.dispose();
		  this.dialogPlayer = null;
		}
	  },
	  resetControlDialog() {
		this.selectedCamera = null;
		this.controlVideoVisible = false;
		if (this.controlPlayer) {
		  this.controlPlayer.dispose();
		  this.controlPlayer = null;
		}
	  },
	  showDetail(index) {
		this.dialogVisible.B = false;
		let admin = this.Admin.find(item => item.Locate_Building === this.alertList[index].Locate_Building);
		let sushe = this.Sushe.find(item => item.Manage_building === this.alertList[index].Locate_Building);
		let peoplePhone = {
		  sushe: sushe.Header_Phone,
		  admin: admin.Phone
		};
		this.$emit('locate', sushe.Locate_Building, peoplePhone);
	  },
	  showAlert() {
		this.getAllAlert();
		this.showDialog('B');
	  },
	  getAllEle() {
		axios.all([
		  axios.post('http://127.0.0.1:8000/smartschools/Get_Dormitory_ammeter/'),
		  axios.post('http://127.0.0.1:8000/smartschools/Get_Building_ammeter/')
		]).then(axios.spread((bElec, dElec) => {
		  this.buildingE = bElec.data;
		  this.dormitoryE = dElec.data;
		  this.totalE = this.dormitoryE.reduce((acc, cur) => {
			return acc + parseInt(cur.Today_electricity_consumption);
		  }, 0);
		  this.w = this.dormitoryE.reduce((acc, cur) => {
			return acc + parseInt(cur.Electrical_power);
		  }, 0);
		  this.v = this.dormitoryE[0].Voltage;
		  this.i = this.dormitoryE[0].Current;
		}));
	  },
	  getAllAlert() {
		this.alertList = this.hot_water.filter(item => parseInt(item.Today_water_consumption) > parseInt(5))
		  .map(item => ({
			time: item.Time,
			name: item.Id + '宿舍',
			building: item.Locate_Building,
			detail: '热水用量过大'
		  }))
		  .concat(
			this.cool_water.filter(item => parseInt(item.Today_water_consumption) > parseInt(80))
			  .map(item => ({
				time: item.Time,
				name: item.Id + '宿舍',
				building: item.Locate_Building,
				detail: '冷水用量过大'
			  }))
		  );
	  },
	  fetchSushe() {
		axios.post('http://127.0.0.1:8000/smartschools/Get_Dormitory_table/')
		  .then(response => {
			this.Sushe = response.data;
		  })
		  .catch(error => console.error('Error fetching data:', error));
	  },
	  fetchAdmin() {
		axios.post('http://127.0.0.1:8000/smartschools/Get_Administrator_information/')
		  .then(response => {
			this.Admin = response.data;
		  })
		  .catch(error => console.error('Error fetching data:', error));
	  }
	}
  };
  </script>
  
  <style scoped>
  @import '~video.js/dist/video-js.css';
  
  .card {
	position: relative;
	width: 280px;
	height: 200px;
	background-size: cover;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	display: flex;
	background-image: url('@/assets/矩形.png');
	flex-direction: column;
	margin-bottom: 5px;
  }
  .card-top,
  .card-bottom {
	display: flex;
	justify-content: space-between;
	padding: 0px;
	background-color: rgba(0, 0, 0, 0.2);
  }
  .title {
	margin: 0;
	text-align: left;
	color: #FFFFFF;
	font-size: 16px;
	line-height: 30px;
  }
  .button-text {
	color: #FFFFFF;
	cursor: pointer;
	font-size: 16px;
	line-height: 30px;
  }
  .card-content {
	flex-grow: 1;
	padding: 0;
	color: #FFFFFF;
	text-align: center;
	background-color: rgba(0, 0, 0, 0.1);
	position: relative;
  }
  .select-container {
	display: flex;
	flex-direction: column;
	gap: 10px;
  }
  .horizontal-container {
	display: flex;
	justify-content: space-between;
	gap: 10px;
	margin-bottom: 10px;
  }
  .media {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
  }
  .video-container {
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 10px;
	min-height: 300px; /* 设置最小高度 */
  }
  .dialog-video {
	width: 100%;
	height: auto;
  }
  .alert-item {
	cursor: pointer;
	padding: 5px;
	border-radius: 5px;
	margin-bottom: 5px;
	background-color: #f0ad4e;
	color: #fff;
  }
  .alert-list {
	max-height: 300px;
	overflow-y: auto;
  }
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
	background-color: #eea236;
  }
  .result-container {
	margin-top: 20px;
	border: 1px solid #ccc;
	padding: 10px;
	background-color: #f5f5f5;
	min-height: 100px;
  }
  </style>
  