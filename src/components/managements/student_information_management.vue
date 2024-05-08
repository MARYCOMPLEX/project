<template>
    <div id="student-management">
      <Header></Header>
      <div class="toolbar">
        <el-input v-model="searchText" placeholder="搜索学生" class="search-input"></el-input>
        <el-button @click="dialogVisible = true" type="primary" class="add-button">添加学生</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="filteredData"
        style="width: 100%; margin-top: 5px"
        height="calc(100% - 150px)"
        stripe>
        <el-table-column prop="Id" label="序号"></el-table-column>
        <el-table-column prop="Student_Id" label="学号"></el-table-column>
        <el-table-column prop="Student_name" label="姓名"></el-table-column>
        <el-table-column prop="Student_age" label="年龄"></el-table-column>
        <el-table-column prop="Student_gender" label="性别"></el-table-column>
        <el-table-column prop="Academy" label="学院"></el-table-column>
        <el-table-column prop="Major" label="专业"></el-table-column>
        <el-table-column prop="Class" label="班级"></el-table-column>
        <el-table-column prop="Locate_Building" label="所在楼栋"></el-table-column>
        <el-table-column prop="Locate_Dormitory" label="所在宿舍"></el-table-column>
        <el-table-column prop="Phone" label="电话"></el-table-column>
        <el-table-column label="出入状态">
          <template slot-scope="scope">
            <el-button size="mini" type="success" v-if="scope.row.Access_status === 'true'">在宿舍</el-button>
            <el-button size="mini" type="danger" v-else>不在宿舍</el-button>
          </template>
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        width="200">
          <template slot-scope="scope">
            <el-button @click="editData(scope.$index, scope.row)" type="success" size="mini">编辑</el-button>
            <el-button @click="deleteStudent(scope.$index, scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加新学生" :visible.sync="dialogVisible" width="30%">
        <el-form ref="dataForm" :model="formData" :rules="rules">
          <el-form-item label="序号" prop="Id">
            <el-input v-model.number="formData.Id"></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="formData.Student_Id"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="formData.Student_name"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="Student_age">
            <el-input v-model.number="formData.Student_age"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-input v-model="formData.Student_gender"></el-input>
          </el-form-item>
          <el-form-item label="学院">
            <el-input v-model="formData.Academy"></el-input>
          </el-form-item>
          <el-form-item label="专业">
            <el-input v-model="formData.Major"></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="formData.Class"></el-input>
          </el-form-item>
          <el-form-item label="所在楼栋">
            <el-input v-model="formData.Locate_Building"></el-input>
          </el-form-item>
          <el-form-item label="所在宿舍">
            <el-input v-model="formData.Locate_Dormitory"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="formData.Phone"></el-input>
          </el-form-item>
          <el-form-item label="出入状态">
            <el-switch v-model="formData.Access_status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
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
          Student_Id: '',
          Student_name: '',
          Student_age: '',
          Student_gender: '',
          Academy: '',
          Major: '',
          Class: '',
          Locate_Building: '',
          Locate_Dormitory: '',
          Phone: '',
          Access_status: false
        },
        formMode: 'add',
        rules: {
          Id: [
            { required: true, message: '请输入序号', trigger: 'blur' },
            { type: 'number', message: '序号必须为数字值', trigger: 'blur' }
          ],
          Student_age: [
            { required: true, message: '请输入年龄', trigger: 'blur' },
            { type: 'number', message: '年龄必须为数字值', trigger: 'blur' }
          ]
        }
      };
    },
    components: {
      Header
    },
    computed: {
      filteredData() {
        return this.data.filter(item => item.Student_name.toLowerCase().includes(this.searchText.toLowerCase()));
      }
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        axios.post('http://127.0.0.1:8000/smartschools/Get_Student_Information/').then(response => {
          this.data = response.data;
          this.loading = false;
        }).catch(error => console.error('Error fetching data:', error));
      },
      submitForm() {
        if (this.formMode === 'add') {
          axios.post('http://127.0.0.1:8000/smartschools/Add_Student_Information/', this.formData)
          .then(response => {
            this.$message({ message: '学生添加成功', type: 'success' });
            this.dialogVisible = false;
            this.fetchData();
          })
          .catch(error => {
            console.error('Error adding student:', error);
            this.$message({ message: '添加失败', type: 'error' });
          });
        } else {
          axios.post('http://127.0.0.1:8000/smartschools/Updata_Student_Information/', this.formData)
          .then(response => {
            this.$message({ message: '学生编辑成功', type: 'success' });
            this.dialogVisible = false;
            this.fetchData();
          })
          .catch(error => {
            console.error('Error adding student:', error);
            this.$message({ message: '编辑失败', type: 'error' });
          });
        }
      },
      deleteStudent(index, row) {
        axios.post('http://127.0.0.1:8000/smartschools/Decrease_Student_Information/', { 'Id': row.Id })
          .then(response => {
            this.data.splice(index, 1);
            this.$message({ message: '学生删除成功', type: 'success' });
          })
          .catch(error => {
            console.error('Error deleting student:', error);
            this.$message({ message: '删除失败', type: 'error' });
          });
      },
      editData(index, row){
        this.dialogVisible = true;
        this.formData = row;
        this.formMode = 'edit';
      },
      handleDialogClose() {
        this.dialogVisible = false;
        this.formData = { 
          Id: '',
          Student_Id: '',
          Student_name: '',
          Student_age: '',
          Student_gender: '',
          Academy: '',
          Major: '',
          Class: '',
          Locate_Building: '',
          Locate_Dormitory: '',
          Phone: '',
          Access_status: false
        };
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
  
  #student-management {
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