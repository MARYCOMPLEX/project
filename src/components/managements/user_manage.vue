<template>
    <div id="train-record-manage">
      <Header></Header>
      <div class="toolbar">
        <el-input v-model="searchText" placeholder="搜索用户" class="search-input"></el-input>
        <el-button @click="dialogVisible = true" type="primary" class="add-button">添加用户</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="formatUserData"
        style="width: 100%;margin-top:5px"
        height="calc(100% - 150px)"
        stripe>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮件"></el-table-column>
        <el-table-column prop="is_staff" label="是否工作人员"></el-table-column>
        <el-table-column prop="date_joined" label="注册时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteIndex(scope)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleDialogClose"
      >
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
      </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取消</el-button>
          <el-button type="primary" @click="handleSubmit" size="small">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import Header from "@/components/Header";
  import axios from 'axios';
  import { addStation } from '@/network/common.js'
  
  export default {
    data() {
      return {
        loading: true,
        data: [],
        searchText: '',
        dialogVisible: false,
        currentPage: 1,
        registerForm: {
            username: '',
            password: '',
            confirmPassword: '',
            email: ''
          }
      };
    },
    components: {
      Header
    },
    mounted() {
      this.getAllBusynessIndex();
    },
    methods: {
      refreshData(){
        this.getAllBusynessIndex();
      },
      getAllBusynessIndex() {
        this.loading = true;
        axios.get('http://127.0.0.1:8000/smartschools/GetUsers/')
          .then(res => {
            console.log('getAllUser',res.data)
            this.data = res.data;
            this.loading = false;
          })
          .catch(error => {
            console.error('Error fetching stations:', error);
          });
        },
      openAddLine() {
        this.dialogVisible = true;
      },
      handleSubmit() {
          console.log('Register clicked');
          console.log('Username:', this.registerForm.username);
          console.log('Password:', this.registerForm.password);
          console.log('Confirm Password:', this.registerForm.confirmPassword);
          console.log('Email:', this.registerForm.email);
          let that = this
          axios.post('http://127.0.0.1:8000/smartschools/regist/',{
            'username': this.registerForm.username,
            'password': this.registerForm.password,
            'password2': this.registerForm.confirmPassword,
            'email': this.registerForm.email
          }).then(res => {
            console.log(res)
            if(res.status === 201){
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.refreshData()
            }else{
              console.log(res)
              this.$message({
                message: '添加失败,请检查输入',
                type: 'error'
              })
              this.dialogVisible = false
            }
          })
        },
      handleDialogClose(done) {
        this.clearForm();
        done();
      },
      clearForm() {
        this.$refs.dataForm.resetFields();
        this.registerForm =  {
          username: '',
          password: '',
          confirmPassword: '',
          email: ''
        }
      },
      formatISO8601Date(isoDateString) {
        const date = new Date(isoDateString);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以+1，并补零
        const day = String(date.getDate()).padStart(2, '0'); // 补零
        const hours = String(date.getHours()).padStart(2, '0'); // 补零
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 补零
        const seconds = String(date.getSeconds()).padStart(2, '0'); // 补零
  
        return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
      }
    },
    computed: {
      formatUserData() {
    // 创建一个新的对象用于存储格式化后的数据
        this.data = this.data.map(item => {
          return {
            username: item.username,
            email: item.email,
            is_staff: item.is_staff ? 'Yes' : 'No',
            date_joined: this.formatISO8601Date(item.date_joined)
          };
        });
        // 格式化日期
        if (this.data.date_joined) {
          this.data.date_joined = this.formatISO8601Date(this.data.date_joined)
        }
  
        // 格式化布尔值
        this.data.is_staff = this.data.is_staff ? 'Yes' : 'No';
  
        // 返回格式化后的数据
        return this.data;
      }
    }
  };
  </script>
  
  <style scoped>
  html, body, #app {
    height: 100%;
    margin: 0;
    font-family: 'Arial', sans-serif;
    background: #f4f4f4; 
  }
  
  #train-record-manage {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0px;
    box-sizing: border-box;
  }
  
  .toolbar {
    display: flex;
    justify-content: flex-start;
    padding: 10px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    margin-top: 5px;
  }
  
  .search-input {
    flex-grow: 0;
    width: 180px;
    margin-right: 20px;
  }
  .add-button {
    width: auto;
    padding: 10px 20px;
  }
  
  .el-table {
    margin-top: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden; /* Ensures the scrollbar is part of the table */
  }
  
  /* 滚动条默认隐藏 */
  .el-table ::-webkit-scrollbar {
    width: 8px;
    opacity: 0; /* Initially set to invisible */
    transition: opacity 0.2s ease-in-out; /* Smooth transition for opacity */
  }
  
  /* 滚动条在表格悬停时显示 */
  .el-table:hover ::-webkit-scrollbar {
    opacity: 1; /* Visible when hovering */
  }
  
  .el-table ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
  }
  
  .el-table ::-webkit-scrollbar-track {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 600px) {
    .toolbar {
      flex-direction: column;
    }
    .search-input, .el-button {
      width: 100%;
      margin-top: 10px;
    }
  }
  </style>
  
  