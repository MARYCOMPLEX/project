<template>
    <div class="register-container">
      <el-card class="register-card">
        <div class="register-title">注册账户</div>
        <el-form ref="registerForm" :model="registerForm" class="register-form">
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="Username"
              prefix-icon="el-icon-user"
              clearable
              class="register-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="registerForm.password"
              placeholder="Password"
              prefix-icon="el-icon-lock"
              show-password
              clearable
              class="register-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              type="password"
              v-model="registerForm.confirmPassword"
              placeholder="Confirm Password"
              prefix-icon="el-icon-lock"
              show-password
              clearable
              class="register-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="Email"
              prefix-icon="el-icon-message"
              clearable
              class="register-input"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="register" class="register-button">注册</el-button>
          </el-form-item>
          <el-form-item>
            <router-link to="/login" class="login-link">回到登录</router-link>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script>
  // 此页面主要是用于注册，包括用户名，密码，确认密码，邮箱，注册按钮，回到登录按钮
  // 通过v-model来绑定数据，通过@click来监听注册按钮的点击事件，当点击注册按钮时，触发register方法，该方法通过axios来向后端发送post请求，请求的url为http://

  import { userRegister } from '@/network/common.js'
  import axios from 'axios'
  export default {
    data() {
      return {
        registerForm: {
          username: '',
          password: '',
          confirmPassword: '',
          email: ''
        }
      };
    },
    methods: {
      register() {
        // Perform registration logic here
        // You can make an API call to register the user
        console.log('Register clicked');
        console.log('Username:', this.registerForm.username);
        console.log('Password:', this.registerForm.password);
        console.log('Confirm Password:', this.registerForm.confirmPassword);
        console.log('Email:', this.registerForm.email);
        axios.post('http://127.0.0.1:8000/smartschools/regist/',{
          'username': this.registerForm.username,
          'password': this.registerForm.password,
          'password2': this.registerForm.confirmPassword,
          'email': this.registerForm.email
        }).then(res => {
          console.log(res)
          if(res.status === 201){
            this.$message({
              message: '注册成功',
              type: 'success'
            })
            this.$router.push('/login')
          }else{
            this.$message({
              message: '注册失败,请检查输入',
              type: 'error'
            })
          }
        })
      }
    }
  };
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .register-card {
    width: 400px;
    padding: 30px;
    text-align: center;
  }
  
  .register-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .register-form {
    margin-top: 20px;
  }
  
  .register-input {
    width: 100%;
  }
  
  .register-button {
    width: 100%;
  }
  
  .login-link {
    color: #409eff;
  }
  </style>
  