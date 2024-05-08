<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-title">欢迎进入基于WebGIS的智慧宿舍系统</div>
      <el-form ref="loginForm" :model="loginForm" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="el-icon-user"
            clearable
            class="login-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            show-password
            clearable
            class="login-input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" class="login-button">登录</el-button>
        </el-form-item>
        <el-form-item>
          <router-link to="/register" class="register-link">注册</router-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
// 此页面主要是用于登录，包括用户名，密码，登录按钮，注册按钮
// 通过v-model来绑定用户名和密码
// 通过@click来监听登录按钮的点击事件，当点击登录按钮时，触发login方法，该方法通过$emit来向父组件传递login事件，同时传递loginForm.username和loginForm.password
// 通过v-on来监听父组件传递过来的login事件，当login事件触发时，触发login方法，该方法通过loginForm.username和loginForm.password来判断当前用户是否是要登录的用户，如果是，则登录成功，否则登录失败
// 通过router-link来实现路由跳转，当点击注册按钮时，跳转到注册页面

import { userLogin } from '@/network/common.js'
import axios from 'axios'
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    // login() {
    //   // Perform login logic here
    //   // You can make an API call to authenticate the user
    //   console.log('Login clicked');
    //   console.log('Username:', this.loginForm.username);
    //   console.log('Password:', this.loginForm.password);
    //   let that = this
    //   axios.post('http://127.0.0.1:8000/travel/login',{
    //     'username': this.loginForm.username,
    //     'password': this.loginForm.password
    //   }).then(res => {
    //     console.log(res)
    //     if (res.status == 201) {
    //       this.$message({
    //         message: '登录成功',
    //         type: 'success'
    //       })
    //       // 将用户信息存储到sessionStorage中
    //       sessionStorage.setItem('user', this.loginForm.username)
    //       that.$router.push('/travelPlan')
    //     } else {
    //       this.$message({
    //         message: '登录失败',
    //         type: 'error'
    //       })
    //     }
    //   })

    // }
    login(){
      this.$router.push('/main')
    }
  }
};
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 400px;
  padding: 30px;
  text-align: center;
}

.login-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.login-form {
  margin-top: 20px;
}

.login-input {
  width: 100%;
}

.login-button {
  width: 100%;
}

.register-link {
  color: #409eff;
}
</style>
