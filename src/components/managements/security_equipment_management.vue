<template>
    <div id="security-equipment-management">
      <Header></Header>
      <div class="toolbar">
        <el-input v-model="searchText" placeholder="搜索设备" class="search-input"></el-input>
        <el-button @click="dialogVisible = true" type="primary" class="add-button">添加设备</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="data"
        style="width: 100%;margin-top:5px"
        height="calc(100% - 150px)"
        stripe>
        <el-table-column prop="Id" label="序号"></el-table-column>
        <el-table-column prop="Security_equipment_Id" label="安防设备编号"></el-table-column>
        <el-table-column prop="Locate_floor" label="所在楼栋"></el-table-column>
        <el-table-column prop="Shelf_life" label="保质期"></el-table-column>
        <el-table-column prop="Replacement_time" label="更换时间"></el-table-column>
        <el-table-column prop="Turnaround_time" label="检修时间"></el-table-column>
        <el-table-column label="设备状态">
          <template slot-scope="scope">
            <el-button size="mini" type="success" v-if="scope.row.Access_status === 'true'">正常</el-button>
            <el-button size="mini" type="danger" v-else>异常</el-button>
          </template>
        </el-table-column>
           
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteIndex(scope)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加新设备" :visible.sync="dialogVisible" width="30%">
        <el-form :model="formData">
          <el-form-item label="序号">
            <el-input v-model="formData.Id"></el-input>
          </el-form-item>
          <el-form-item label="安防设备编号">
            <el-input v-model="formData.Security_equipment_Id"></el-input>
          </el-form-item>
          <el-form-item label="所在楼栋">
            <el-input v-model="formData.Locate_floor"></el-input>
          </el-form-item>
          <el-form-item label="保质期">
            <el-input v-model="formData.Shelf_life"></el-input>
          </el-form-item>
          <el-form-item label="更换时间">
            <el-input v-model="formData.Replacement_time" type="datetime"></el-input>
          </el-form-item>
          <el-form-item label="检修时间">
            <el-input v-model="formData.Turnaround_time" type="datetime"></el-input>
          </el-form-item>
          <el-form-item label="设备状态">
            <el-switch v-model="formData.Access_status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
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
        formData: {
          Id: '',
          Security_equipment_Id: '',
          Locate_floor: '',
          Shelf_life: '',
          Replacement_time: '',
          Turnaround_time: '',
          Access_status: false
        },
        currentPage: 1,
      };
    },
    components: {
      Header
    },
    mounted() {
      this.getAllSecurityEquipment();
    },
    methods: {
      refreshData(){
        this.getAllSecurityEquipment();
      },
      getAllSecurityEquipment() {
        this.loading = true;
        axios.post('http://127.0.0.1:8000/smartschools/Get_Security_equipment/')
          .then(res => {
            console.log('Get_Security_equipment',res.data)
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
      submitForm() {
          let that = this
          axios.post('http://127.0.0.1:8000/smartschools/Add_Security_equipment/',
            that.formData
          ).then(res => {
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
        this.formData =  {
          Id: '',
          Security_equipment_Id: '',
          Locate_floor: '',
          Shelf_life: '',
          Replacement_time: '',
          Turnaround_time: '',
          Access_status: false
        }
      },
      deleteIndex(scope){
        let that = this
        console.log(scope.row.Id)
        axios.post('http://127.0.0.1:8000/smartschools/Decrease_Security_equipment/',{'Id':scope.row.Id})
          .then(res => {
            console.log(res)
            if(res.status === 201){
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.refreshData()
            }else{
              console.log(res)
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
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
      },
      filteredData() {
        return this.data.filter(item => {
          return item.Security_equipment_Id.toLowerCase().includes(this.searchText.toLowerCase());
        });
      }
    },
    
  };
  </script>
  
  <style scoped>
  html, body, #app {
    height: 100%;
    margin: 0;
    font-family: 'Arial', sans-serif;
    background: #f4f4f4; 
  }
  
  #security-equipment-management{
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
  
  