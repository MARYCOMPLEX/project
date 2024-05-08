<template>
    <div class="card">
      <div class="card-top">
        <h1 class="title">卡片标题</h1>
        <button class="button">按钮A</button>
      </div>
      <div class="card-content">
        <p>这里是卡片中的一些重要信息。</p>
      </div>
      <div class="card-bottom">
        <button class="button">按钮B</button>
        <button class="button">按钮C</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CardComponent',
  }
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
  }
  .card-top, .card-bottom {
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
  .button {
    width: 60px; /* 减少按钮的宽度 */
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    background-color: #007BFF;
    color: white;
    cursor: pointer;
    text-align: center;
  }
  .card-content {
    flex-grow: 1;
    padding: 20px;
    color: #FFFFFF;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.1); /* 半透明背景突出内容区 */
  }
  </style>
  