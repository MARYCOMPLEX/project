<template>
  <div class="container">
    <div v-for="card in cards" :key="card.id" class="card">
      <div class="card-header">{{ card.title }}</div>
      <div class="card-body">
        <div class="scrolling-content">
          <div class="scrolling-wrapper">
            <div v-for="(item, index) in card.contents" :key="`item-${index}`" class="content-item">
              {{ item.text }}
            </div>
            <!-- Repeat content for smooth infinite scroll -->
            <div v-for="(item, index) in card.contents" :key="`item-repeat-${index}`" class="content-item">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          id: 4,
          title: '监控中心',
          contents: [
            { id: 1, text: '监控系统运行中...' },
            { id: 2, text: '所有摄像头状态正常' },
            { id: 3, text: '数据录制中...' }
          ]
        },
        {
          id: 5,
          title: '安防中心',
          contents: [
            { id: 1, text: '门禁系统已激活' },
            { id: 2, text: '安全检查进行中...' },
            { id: 3, text: '紧急响应待命中...' }
          ]
        },
        {
          id: 6,
          title: '管理员中心',
          contents: [
            { id: 1, text: '系统维护计划更新' },
            { id: 2, text: '管理员培训会议' },
            { id: 3, text: '新的安全协议实施' }
          ]
        }
      ]
    }
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
.scrolling-content {
  position: absolute;
  width: 100%;
  height: 100%;
}
.scrolling-wrapper {
  animation: scroll 20s linear infinite;
  position: absolute;
  width: 100%;
}
.content-item {
  white-space: nowrap;
  padding: 10px 15px;
}
@keyframes scroll {
  0% { top: 0; }
  100% { top: -200%; } /* Adjust based on total content height */
}
</style>
