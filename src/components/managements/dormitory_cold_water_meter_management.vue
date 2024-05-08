<template>
    <div id="water-meter-management">
      <Header></Header>
      <el-row class="toolbar">
        <el-col :span="4">
          <el-input v-model="searchText" placeholder="搜索水表编号" class="search-input"></el-input>
        </el-col>
        <el-col :span="20">
          <el-button @click="dialogVisible = true" type="primary" class="add-button">添加水表记录</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="filteredData"
        style="width: 100%; margin-top: 5px"
        height="calc(100% - 150px)"
        stripe>
        <el-table-column prop="Id" label="序号"></el-table-column>
        <el-table-column prop="Water_meter_Id" label="水表编号"></el-table-column>
        <el-table-column label="水表类型">
          <template v-slot="{ row }">
            {{ row.Water_meter_type === 're' ? '热水' : '冷水' }}
          </template>
        </el-table-column>
        <el-table-column prop="Time" label="时间"></el-table-column>
        <el-table-column prop="Locate_Building" label="所在楼栋"></el-table-column>
        <el-table-column prop="Cumulative_water_consumption" label="累计用水量"></el-table-column>
        <el-table-column prop="Today_water_consumption" label="今日用水量"></el-table-column>
        <el-table-column prop="Water_temperature" label="水温"></el-table-column>
        <el-table-column prop="Hydraulic" label="水压"></el-table-column>
        <el-table-column prop="Water_flow_velocity" label="水流速度"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template v-slot="{ row }">
            <el-button size="mini" @click="deleteEntry(row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加新水表记录" :visible.sync="dialogVisible">
        <el-form :model="formData" :rules="rules" ref="dataForm">
            <el-form-item label="序号" prop="Id">
              <el-input v-model.number="formData.Id" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="水表编号" prop="Water_meter_Id">
              <el-input v-model="formData.Water_meter_Id" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="水表类型" prop="Water_meter_type">
              <el-input v-model="formData.Water_meter_type" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="时间" prop="Time">
              <el-input v-model="formData.Time" type="datetime" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所在楼栋" prop="Locate_Building">
              <el-input v-model="formData.Locate_Building" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="累计用水量" prop="Cumulative_water_consumption">
              <el-input v-model.number="formData.Cumulative_water_consumption" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="今日用水量" prop="Today_water_consumption">
              <el-input v-model.number="formData.Today_water_consumption" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="水温" prop="Water_temperature">
              <el-input v-model.number="formData.Water_temperature" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="水压" prop="Hydraulic">
              <el-input v-model.number="formData.Hydraulic" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="水流速度" prop="Water_flow_velocity">
              <el-input v-model.number="formData.Water_flow_velocity" autocomplete="off"></el-input>
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
    components: {
      Header
    },
    data() {
      return {
        loading: false,
        data: [],
        searchText: '',
        dialogVisible: false,
        formData: {
          Id: '',
          Water_meter_Id: '',
          Water_meter_type: '',
          Time: '',
          Locate_Building: '',
          Cumulative_water_consumption: '',
          Today_water_consumption: '',
          Water_temperature: '',
          Hydraulic: '',
          Water_flow_velocity: ''
        },
        rules: {
          Id: [{ required: true, message: '请输入序号', trigger: 'blur', type: 'number' }],
          Cumulative_water_consumption: [{ required: true, message: '请输入累计用水量', trigger: 'blur', type: 'number' }],
          Today_water_consumption: [{ required: true, message: '请输入今日用水量', trigger: 'blur', type: 'number' }],
          Water_temperature: [{ required: true, message: '请输入水温', trigger: 'blur', type: 'number' }],
          Hydraulic: [{ required: true, message: '请输入水压', trigger: 'blur', type: 'number' }],
          Water_flow_velocity: [{ required: true, message: '请输入水流速度', trigger: 'blur', type: 'number' }]
        }
      };
    },
    computed: {
      filteredData() {
        return this.data.filter(item => item.Water_meter_Id.toLowerCase().includes(this.searchText.toLowerCase()));
      }
    },
    methods: {
      fetchData() {
        this.loading = true;
        axios.post('http://127.0.0.1:8000/smartschools/Get_Dormitory_Cool_water/')
          .then(response => {
            this.data = response.data;
            this.loading = false;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            this.loading = true;
          });
      },
      submitForm() {
        axios.post('http://127.0.0.1:8000/smartschools/Add_Dormitory_Cool_water/', this.formData)
          .then(response => {
            this.$message({ message: '水表记录添加成功', type: 'success' });
            this.dialogVisible = false;
            this.fetchData();
          })
          .catch(error => {
            console.error('Error adding water meter:', error);
            this.$message({ message: '添加失败', type: 'error' });
          });
      },
      deleteEntry(row) {
        axios.post('http://127.0.0.1:8000/smartschools/Decrease_Dormitory_Cool_water/', { 'Id': row.Id })
          .then(response => {
            this.data.splice(this.data.indexOf(row), 1);
            this.$message({ message: '水表记录删除成功', type: 'success' });
          })
          .catch(error => {
            console.error('Error deleting water meter:', error);
            this.$message({ message: '删除失败', type: 'error' });
          });
      },
      handleDialogClose() {
        this.dialogVisible = false;
        this.formData = {
          Id: '',
          Water_meter_Id: '',
          Water_meter_type: '',
          Time: '',
          Locate_Building: '',
          Cumulative_water_consumption: '',
          Today_water_consumption: '',
          Water_temperature: '',
          Hydraulic: '',
          Water_flow_velocity: ''
        };
      }
    },
    mounted() {
      this.fetchData();
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
    
    #water-meter-management {
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