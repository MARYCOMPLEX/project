<template>
    <div id="ammeter-management">
      <Header></Header>
      <el-row class="toolbar">
        <el-col :span="4">
          <el-input v-model="searchText" placeholder="搜索电表" class="search-input"></el-input>
        </el-col>
        <el-col :span="20">
          <el-button @click="dialogVisible = true" type="primary" class="add-button">添加电表</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="filteredData"
        style="width: 100%;margin-top:5px"
        height="calc(100% - 150px)"
        stripe>
        <el-table-column prop="Id" label="序号"></el-table-column>
        <el-table-column prop="Ammeter" label="电表编号"></el-table-column>
        <el-table-column prop="Time" label="时间"></el-table-column>
        <el-table-column prop="Locate_Building" label="所在楼栋"></el-table-column>
        <el-table-column prop="Voltage" label="电压"></el-table-column>
        <el-table-column prop="Current" label="电流"></el-table-column>
        <el-table-column prop="Electrical_power" label="电功率"></el-table-column>
        <el-table-column prop="Cumulative_workload" label="累计用电量"></el-table-column>
        <el-table-column prop="Today_electricity_consumption" label="今日用电量"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template v-slot="{ row }">
            <el-button size="mini" @click="deleteEntry(row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加新电表" :visible.sync="dialogVisible">
        <el-form :model="formData" :rules="rules" ref="dataForm">
          <el-form-item label="序号" prop="Id">
            <el-input v-model.number="formData.Id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电表编号" prop="Ammeter">
            <el-input v-model="formData.Ammeter" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="时间" prop="Time">
            <el-input v-model="formData.Time" type="datetime" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所在楼栋" prop="Locate_Building">
            <el-input v-model="formData.Locate_Building" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电压" prop="Voltage">
            <el-input v-model.number="formData.Voltage" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电流" prop="Current">
            <el-input v-model.number="formData.Current" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电功率" prop="Electrical_power">
            <el-input v-model.number="formData.Electrical_power" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="累计用电量" prop="Cumulative_workload">
            <el-input v-model.number="formData.Cumulative_workload" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="今日用电量" prop="Today_electricity_consumption">
            <el-input v-model.number="formData.Today_electricity_consumption" autocomplete="off"></el-input>
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
          Ammeter: '',
          Time: '',
          Locate_Building: '',
          Voltage: '',
          Current: '',
          Electrical_power: '',
          Cumulative_workload: '',
          Today_electricity_consumption: ''
        },
        rules: {
          Id: [{ required: true, message: '请输入序号', trigger: 'blur' }, { type: 'number', message: '序号必须为数字', trigger: 'blur' }],
          Ammeter: [{ required: true, message: '请输入电表编号', trigger: 'blur' }],
          Time: [{ required: true, message: '请输入时间', trigger: 'blur' }],
          Locate_Building: [{ required: true, message: '请输入所在楼栋', trigger: 'blur' }],
          Voltage: [{ required: true, message: '请输入电压', trigger: 'blur' }, { type: 'number', message: '电压必须为数字', trigger: 'blur' }],
          Current: [{ required: true, message: '请输入电流', trigger: 'blur' }, { type: 'number', message: '电流必须为数字', trigger: 'blur' }],
          Electrical_power: [{ required: true, message: '请输入电功率', trigger: 'blur' }, { type: 'number', message: '电功率必须为数字', trigger: 'blur' }],
          Cumulative_workload: [{ required: true, message: '请输入累计用电量', trigger: 'blur' }, { type: 'number', message: '累计用电量必须为数字', trigger: 'blur' }],
          Today_electricity_consumption: [{ required: true, message: '请输入今日用电量', trigger: 'blur' }, { type: 'number', message: '今日用电量必须为数字', trigger: 'blur' }]
        }
      };
    },
    methods: {
      fetchData() {
        this.loading = true;
        axios.post('http://127.0.0.1:8000/smartschools/Get_Dormitory_ammeter/')
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
        axios.post('http://127.0.0.1:8000/smartschools/Add_Dormitory_ammeter/', this.formData)
          .then(response => {
            this.$message({ message: '电表添加成功', type: 'success' });
            this.dialogVisible = false;
            this.fetchData();
          })
          .catch(error => {
            console.error('Error adding ammeter:', error);
            this.$message({ message: '添加失败', type: 'error' });
          });
      },
      deleteEntry(row) {
        axios.post('http://127.0.0.1:8000/smartschools/Decrease_Dormitory_ammeter/', { 'Id': row.Id })
          .then(response => {
            this.data.splice(this.data.indexOf(row), 1);
            this.$message({ message: '电表删除成功', type: 'success' });
          })
          .catch(error => {
            console.error('Error deleting ammeter:', error);
            this.$message({ message: '删除失败', type: 'error' });
          });
      },
      handleDialogClose() {
        this.dialogVisible = false;
        this.formData = {
          Id: '',
          Ammeter: '',
          Time: '',
          Locate_Building: '',
          Voltage: '',
          Current: '',
          Electrical_power: '',
          Cumulative_workload: '',
          Today_electricity_consumption: ''
        };
      }
    },
    computed: {
        filteredData() {
          return this.data.filter(item => item.Locate_Building.toLowerCase().includes(this.searchText.toLowerCase()));
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
  
  #ammeter-management {
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