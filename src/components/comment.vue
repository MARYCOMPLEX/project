<template>
  <div class="comment" @mouseover="showDeleteButton" @mouseleave="hideDeleteButton">
    <div class="info">
      <div class="header">
        <div class="avatar">
          <img :src=image  alt="User Avatar" />
        </div>
        <div class="user-time">
          <div class="user">{{ comment.user }}</div>
          <div class="time">{{ comment.time }}</div>
        </div>
        <div class="delete" v-show="showDelete" @click="deleteComment">X</div>
      </div>
      <div class="content">
        {{ comment.comments }}
      </div>
    </div>
  </div>
</template>

<script>
// 此页面主要是用于展示评论，包括评论的头像，评论的用户，评论的时间，评论的内容，以及删除评论的按钮
// 通过props接收父组件传递过来的comment对象，comment对象包括user，time，comments三个属性
// 通过v-show来控制删除按钮的显示和隐藏
// 通过@mouseover和@mouseleave来控制鼠标移入和移出时删除按钮的显示和隐藏
// 通过@click来监听删除按钮的点击事件，当点击删除按钮时，触发deleteComment方法，该方法通过$emit来向父组件传递delete事件，同时传递comment.user
// 通过v-on来监听父组件传递过来的delete事件，当delete事件触发时，触发deleteComment方法，该方法通过comment.user来判断当前评论是否是要删除的评论，如果是，则删除该评论

export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    // 獲取一個一到四的隨
    const random = Math.floor(Math.random() * 4) + 1;
    // 從../assets/裏面獲取頭像，頭像名
    this.image = require(`../assets/${random}.png`);
  },
  data() {
    return {
      showDelete: false,
      image: '',
    };
  },
  methods:{
    showDeleteButton() {
      this.showDelete = true;
    },
    hideDeleteButton() {
      this.showDelete = false;
    },
    deleteComment() {
      this.$emit('delete',this.comment.user);
    },
  },
};
</script>

<style scoped>
.comment {
  display: flex;
  margin-bottom: 10px;
}

.info {
  display: flex;
  width:100%;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 10px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
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

.user-time {
  flex-grow: 1;
}

.user {
  font-weight: bold;
}

.time {
  font-size: 12px;
  color: gray;
}

.content {
  margin-top: 5px;
}
.delete {
  font-size: 12px;
  color: red;
  cursor: pointer;
}
</style>
