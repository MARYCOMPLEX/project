<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="card-top">
        <h1 class="title">监控中心</h1>
        <span class="button-text" @click="showDialog('A')">检索回放</span>
      </div>
      <div class="card-content">
        <img v-if="!showVideo" src="@/assets/监控.png" alt="Placeholder Image" class="media">
        <video v-if="showVideo" ref="videoPlayer" id="videoPlayer" class="media" controls loop>
          <source :src="videoSrc" type='video/mp4'>
        </video>
      </div>
      <div class="card-bottom">
        <span class="button-text" @click="showRealTimeDialog">实时操作</span>
        <span class="button-text" @click="showDialog('C')">远程控制</span>
      </div>
    </div>

    <el-dialog
      v-if="dialogVisible.realTime"
      title="选择摄像头编号"
      :visible.sync="dialogVisible.realTime"
      width="30%"
      @close="resetRealTimeDialog">
      <div class="select-container">
        <el-select v-model="selectedCamera" placeholder="选择摄像头编号">
          <el-option label="S01001" value="1"></el-option>
          <el-option label="S01002" value="2"></el-option>
          <el-option label="S01003" value="3"></el-option>
          <el-option label="S01004" value="4"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="playVideo">播放</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="dialogVisible.A"
      title="检索回放"
      :visible.sync="dialogVisible.A"
      width="60%"
      @open="resetSearchDialog"
      @close="resetSearchDialog">
      <div class="horizontal-container">
        <el-select v-model="selectedCamera" placeholder="选择摄像头编号">
          <el-option label="S01001" value="1"></el-option>
          <el-option label="S01002" value="2"></el-option>
          <el-option label="S01003" value="3"></el-option>
          <el-option label="S01004" value="4"></el-option>
        </el-select>
        <el-date-picker v-model="startDate" type="datetime" placeholder="选择开始时间"></el-date-picker>
        <el-date-picker v-model="endDate" type="datetime" placeholder="选择结束时间"></el-date-picker>
      </div>
      <div class="video-container" v-if="dialogVideoVisible" ref="dialogVideoContainer">
        <video ref="dialogVideoPlayer" id="dialogVideoPlayer" class="dialog-video" controls loop>
          <source :src="dialogVideoSrc" type='video/mp4'>
        </video>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="playDialogVideo">播放视频</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="dialogVisible.C"
      title="远程控制"
      :visible.sync="dialogVisible.C"
      width="60%"
      @close="resetControlDialog">
      <div class="horizontal-container">
        <el-select v-model="selectedCamera" placeholder="选择摄像头编号">
          <el-option label="S01001" value="1"></el-option>
          <el-option label="S01002" value="2"></el-option>
          <el-option label="S01003" value="3"></el-option>
          <el-option label="S01004" value="4"></el-option>
        </el-select>
        <el-button>画面放大</el-button>
        <el-button>画面缩小</el-button>
        <el-button>调整角度</el-button>
        <el-button>调整画面质量</el-button>
      </div>
      <div class="video-container" v-if="controlVideoVisible" ref="controlVideoContainer">
        <video ref="controlVideoPlayer" id="controlVideoPlayer" class="dialog-video" controls loop>
          <source :src="controlVideoSrc" type='video/mp4'>
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
      showVideo: false,
      dialogVideoVisible: false,
      controlVideoVisible: false,
      selectedCamera: null,
      startDate: null,
      endDate: null,
      videoSrc: '',
      dialogVideoSrc: '',
      controlVideoSrc: ''
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
      this.selectedCamera = '';
      Object.keys(this.dialogVisible).forEach(key => {
        this.dialogVisible[key] = false;
      });
      this.dialogVisible[button] = true;
    },
    showRealTimeDialog() {
      this.selectedCamera = '';
      this.dialogVisible.realTime = true;
    },
    playVideo() {
      if (this.selectedCamera) {
        this.videoSrc = require(`@/assets/${this.selectedCamera}.mp4`);
        this.showVideo = true;
        this.dialogVisible.realTime = false;
        this.$nextTick(() => {
          const videoPlayer = this.$refs.videoPlayer;
          if (videoPlayer) {
            videoPlayer.load();
            videoPlayer.play();
          }
        });
      }
    },
    playDialogVideo() {
      if (this.selectedCamera && this.startDate && this.endDate) {
        this.dialogVideoSrc = require(`@/assets/${this.selectedCamera}.mp4`);
        this.dialogVideoVisible = true;
        this.$nextTick(() => {
          const dialogVideoPlayer = this.$refs.dialogVideoPlayer;
          if (dialogVideoPlayer) {
            dialogVideoPlayer.load();
            dialogVideoPlayer.play();
          }
        });
      }
    },
    playControlVideo() {
      if (this.selectedCamera) {
        this.controlVideoSrc = require(`@/assets/${this.selectedCamera}.mp4`);
        this.controlVideoVisible = true;
        this.$nextTick(() => {
          const controlVideoPlayer = this.$refs.controlVideoPlayer;
          if (controlVideoPlayer) {
            controlVideoPlayer.load();
            controlVideoPlayer.play();
          }
        });
      }
    },
    resetRealTimeDialog() {
      this.showVideo = false;
      this.selectedCamera = null;
      this.startDate = null;
      this.endDate = null;
      this.dialogVideoVisible = false;
    },
    resetSearchDialog() {
      this.selectedCamera = null;
      this.startDate = null;
      this.endDate = null;
      this.dialogVideoVisible = false;
    },
    resetControlDialog() {
      this.selectedCamera = null;
      this.controlVideoVisible = false;
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
  min-height: 300px;
}
.dialog-video {
  width: 100%;
  height: auto;
}
</style>
