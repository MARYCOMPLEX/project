<template>
    <div id="manager-management">
      <Header></Header>
      <div class="toolbar">
        <el-input v-model="searchText" placeholder="搜索管理员" class="search-input"></el-input>
        <el-button @click="dialogVisible = true" type="primary" class="add-button">添加管理员</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="filteredData"
        style="width: 100%; margin-top: 5px"
        height="calc(100% - 150px)"
        stripe>
        <el-table-column prop="Id" label="序号"></el-table-column>
        <el-table-column prop="Name" label="姓名"></el-table-column>
        <el-table-column prop="Age" label="年龄"></el-table-column>
        <el-table-column prop="Gender" label="性别"></el-table-column>
        <el-table-column prop="Phone" label="电话"></el-table-column>
        <el-table-column prop="Manage_building" label="所管楼栋"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteManager(scope.$index, scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加新管理员" :visible.sync="dialogVisible" width="30%">
        <el-form ref="dataForm" :model="formData">
          <el-form-item label="序号">
            <el-input v-model="formData.Id"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="formData.Name"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="formData.Age"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-input v-model="formData.Gender"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="formData.Phone"></el-input>
          </el-form-item>
          <el-form-item label="所管楼栋">
            <el-input v-model="formData.Manage_building"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import Header from "@/components/Header";
  import axios from 'axios';
  
  export default {
    data() {
      return {
        loading: true,
        data: [],
        searchText: '',
        dialogVisible: false,
        formData: {
          Id: '',
          Name: '',
          Age: '',
          Gender: '',
          Phone: '',
          Manage_building: ''
        },
      };
    },
    components: {
      Header
    },
    computed: {
      filteredData() {
        return this.data.filter(item => item.Name.toLowerCase().includes(this.searchText.toLowerCase()));
      }
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        axios.post('http://127.0.0.1:8000/smartschools/Get_Administrator_information/').then(response => {
          this.data = response.data;
          this.loading = false;
        }).catch(error => console.error('Error fetching data:', error));
      },
      submitForm() {
        axios.post('http://127.0.0.1:8000/smartschools/Add_Administrator_information/', this.formData)
          .then(response => {
            this.$message({ message: '管理员添加成功', type: 'success' });
            this.dialogVisible = false;
            this.fetchData();
          })
          .catch(error => {
            console.error('Error adding manager:', error);
            this.$message({ message: '添加失败', type: 'error' });
          });
      },
      deleteManager(index, row) {
        axios.post('http://127.0.0.1:8000/smartschools/Decrease_Administrator_information/', { 'Id': row.Id })
          .then(response => {
            this.data.splice(index, 1);
            this.$message({ message: '管理员删除成功', type: 'success' });
          })
          .catch(error => {
            console.error('Error deleting manager:', error);
            this.$message({ message: '删除失败', type: 'error' });
          });
      },
      handleDialogClose() {
        this.dialogVisible = false;
        this.formData = { Id: '', Name: '', Age: '', Gender: '', Phone: '', Manage_building: '' };
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
  
  #manager-management{
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
  
  