<template>
    <div class="comment">
      <el-row height="40">
        <el-col>
      <div class="avatar">
          <img :src="user.avatar" alt="User Avatar" />
      </div>
    </el-col>
    <el-col>
      <div class="info">
          <div class="user">{{ user.name }}</div>
          <div class="time">{{ comment.comment.time }}</div>
      </div>
    </el-col>
      </el-row>
      <el-row>
        <el-col>
        <div class="content">
          {{ comment.comment.content }}
        </div>
      </el-col>
      </el-row>
    </div>
</template>
  
  <script>
  export default {
    props: {
      user: {
        type: Object,
        required: true,
      },
      comment: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .comment {
    display: flex;
    margin-bottom: 10px;
  }
  .el-row{
    width: 340px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
  }
  
  .avatar img {
    width: 100%;
    height: auto;
  }
  
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100px;
  }
  
  .user {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .time {
    font-size: 12px;
    color: gray;
  }
  
  .content {
    margin-top: 50px;
  }
  </style>
  