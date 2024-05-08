<template>
  <div class="header">
    <div class="title">
      基于WebGIS的智慧宿舍系统
    </div>
    <el-dropdown @command="handleCommand1" placement="bottom-end">
      <span class="el-dropdown-link">
        <div color="#FF0000 ">地图展示</div>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="main">地图页面</el-dropdown-item>
        <el-dropdown-item command="test">测试</el-dropdown-item>

      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown @command="handleCommand2" placement="bottom-end">
      <span class="el-dropdown-link">
        基础数据管理
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="security_equipment_management">安防设备管理</el-dropdown-item>
        <el-dropdown-item command="administrator_information_management">管理员信息管理</el-dropdown-item>
        <el-dropdown-item command="building_management">楼栋管理</el-dropdown-item>
        <el-dropdown-item command="building_electricity_meter_management">楼栋电表管理</el-dropdown-item>
        <el-dropdown-item command="building_cold_water_meter_management">楼栋冷水表管理</el-dropdown-item>
        <el-dropdown-item command="building_hot_water_meter_management">楼栋热水表管理</el-dropdown-item>
        <el-dropdown-item command="access_control_management">门禁管理</el-dropdown-item>
        <el-dropdown-item command="camera_management">摄像头管理</el-dropdown-item>
        <el-dropdown-item command="dormitory_management">宿舍管理</el-dropdown-item>·
        <el-dropdown-item command="dormitory_electricity_meter_management">宿舍电表管理</el-dropdown-item>
        <el-dropdown-item command="dormitory_cold_water_meter_management">宿舍冷水表管理</el-dropdown-item>
        <el-dropdown-item command="dormitory_hot_water_meter_management">宿舍热水表管理</el-dropdown-item>
        <el-dropdown-item command="student_information_management">学生信息管理</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown @command="handleCommand3" placement="bottom-end">
      <span class="el-dropdown-link">
        系统管理
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="user_manage">用户管理</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown placement="bottom-end" @command="handleCommand" >
      <span class="el-dropdown-link avatar">
        <el-avatar size="small" :src="avatarSrc"></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="logout">登出</el-dropdown-item>
        <el-dropdown-item command="register">注册</el-dropdown-item>
      </el-dropdown-menu>
      
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      avatarSrc: 'https://img.zcool.cn/community/015a605f45ac07a80120a8218319a8.jpg@1280w_1l_2o_100sh.jpg' // 你的人物头像路径
    };
  },
  methods: {
    handleCommand1(command) {
      if (command === 'main') {
        this.$router.push('/main')
      } else if (command === 'test') {
        // 展示还未开发弹窗
        this.$router.push('/test')
      }
    },
    handleCommand2(command) {
      if(command === 'security_equipment_management') {
        this.$router.push('/security_equipment_management')
      } else if (command === 'administrator_information_management') {
        this.$router.push('/administrator_information_management')
      } else if (command === 'building_management') {
        this.$router.push('/building_management')
      } else if (command === 'building_cold_water_meter_management') {
        this.$router.push('/building_cold_water_meter_management')
      } else if (command === 'building_electricity_meter_management') {
        this.$router.push('/building_electricity_meter_management')
      } else if (command === 'building_hot_water_meter_management') {
        this.$router.push('/building_hot_water_meter_management')
      } else if (command === 'access_control_management') {
        this.$router.push('/access_control_management')
      } else if (command === 'camera_management') {
        this.$router.push('/camera_management')
      } else if (command === 'dormitory_management') {
        this.$router.push('/dormitory_management')
      } else if (command === 'dormitory_electricity_meter_management') {
        this.$router.push('/dormitory_electricity_meter_management')
      } else if (command === 'dormitory_cold_water_meter_management') {
        this.$router.push('/dormitory_cold_water_meter_management')
      } else if (command === 'dormitory_hot_water_meter_management') {
        this.$router.push('/dormitory_hot_water_meter_management')
      } else if (command === 'student_information_management') {
        this.$router.push('/student_information_management')
      }
    },
    handleCommand3(command) {
      if(command === 'user_manage'){
        this.$router.push('/user_manage')
      }
    },
    handleCommand4(command) {
      console.log('Command 4:', command);
    },
    handleLogout() {
      this.$router.push('/login')
    },
    register(){
      this.$router.push('/register')
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.handleLogout();
      } else if (command === 'register') {
        this.register();
      }
    },

  }
}
</script>
<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background: linear-gradient(to right, #6a11cb, #2575fc); /* 使用渐变背景 */
  color: #fff; /* 统一颜色 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1px; /* 增加字母间距 */
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 5px; /* 添加圆角 */
  transition: background-color 0.3s, box-shadow 0.3s;
  color: #FFFFFF; /* 使字体颜色与父元素一致 */
  font-size: 16px; /* 字体大小 */
  font-weight: bold; /* 字体粗细 */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6); /* 添加文字阴影以提升清晰度 */
}

.el-dropdown-link:hover {
  background-color: rgba(255, 255, 255, 0.1); /* 暗化背景 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.el-dropdown-menu {
  border-radius: 5px; /* 菜单圆角 */
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); /* 菜单阴影 */
}
</style>


