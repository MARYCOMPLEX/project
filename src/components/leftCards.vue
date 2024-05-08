<template>
  <div class="container">
    <div class="card">
      <div class="card-header">水力中心</div>
      <div class="card-body">
        <div class="scrolling-content">
          <div class="scrolling-wrapper">
            <div v-for="(item, index) in waterCenterContents" :key="`water-${index}`" class="content-item">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">电力中心</div>
      <div class="card-body">
        <div class="scrolling-content">
          <div class="scrolling-wrapper">
            <template v-for="n in 2">
              <div v-for="(log, index) in electricalCenterContents" :key="`log-${index}-${n}`" class="content-item">
                <div>电表: {{ log.Ammeter }}</div>
                <div>所在楼栋: {{ log.Locate_Building }}</div>
                <div :style="{ color: parseInt(log.Electrical_power) >  8 ? 'red' : 'green' }">
                  用电功率: {{ log.Electrical_power}}
                </div>
                <div>时间: {{ log.time }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">门禁中心</div>
      <div class="card-body">
        <div class="scrolling-content">
          <div class="scrolling-wrapper">
            <!-- 为了无缝滚动效果，内容需要重复 -->
            <template v-for="n in 2">
              <div v-for="(log, index) in accessCenterContents" :key="`log-${index}-${n}`" class="content-item">
                <div>时间: {{ log.time }}</div>
                <div>学生名: {{ log.studentName }}</div>
                <div>所处楼栋: {{ log.dormitory }}</div>
                <div :style="{ color: log.accessStatus === 'chu' ? 'red' : 'green' }">
                  出入状态: {{ log.accessStatus === 'chu' ? '出' : '入' }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      waterCenterContents: [
        '发电量统计: 1000kWh',
        '检修状态: 正常',
        '环境温度: 23°C',
        '额外信息: 数据更新中...'
      ],
      powerCenterContents: [
        '负荷率: 75%',
        '紧急事件: 无',
        '预计维护: 明日',
        '系统负荷: 正常运行'
      ],
      accessCenterContents: [
      ],
      electricalCenterContents: [
      ],
    }
  },
  mounted() {
    this.fetchAccessCenterData()
    this.fetchElectricalCenterData()
  },
  methods: {
    fetchAccessCenterData() {
      // Fetch data from API
      axios.post('http://127.0.0.1:8000/smartschools/Get_Access_status_table/')
        .then(response => {
          // this.data = response.data;
          response.data.forEach(item => {
            this.accessCenterContents.push({
              studentName: item.Student_name,
              dormitory: item.Dormitory,
              accessStatus: 'chu',
              time: item.Time
            })
          })
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          this.loading = true;
        });
        console.log(this.accessCenterContents)
    },
    // 请求电力中心数据
    fetchElectricalCenterData() {
      axios.post('http://127.0.0.1:8000/smartschools/Get_Building_ammeter/')
        .then(response => {
          // this.data = response.data;
          response.data.forEach(item => {
            this.electricalCenterContents.push({
              Ammeter: item.Ammeter,
              Locate_Building: item.Locate_Building,
              Electrical_power: item.Electrical_power + 'KW',
              time: item.Time
            })
          })
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          this.loading = true;
        });
        console.log('electricalCenterContents',this.electricalCenterContents)
    },
    
  }
}
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}
.scrolling-content {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scrolling-wrapper {
  position: absolute;
  width: 100%;
  animation: scroll 15s linear infinite; /* 调整为更短的时间，如15s */
}

@keyframes scroll {
  from { top: 0; }
  to { top: -100%; } /* 确保内容高度正确计算，可能需要调整 */
}

.content-item {
  padding: 10px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.card {
  width: 260px;
  height: 160px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  background-image: url('@/assets/矩形.png');
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}
.card-header {
  padding: 10px 15px;
  background-color: rgba(0, 0, 0, 0.2);
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  text-align: left;
}
.card-body {
  height: 100px;
  position: relative;
  overflow: hidden;
}

@keyframes scroll {
  from { top: 0; }
  to { top: -100%; } /* 确保内容高度正确计算，可能需要调整 */
}

</style>