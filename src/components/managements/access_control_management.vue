<template>
  <div id="dormitory-access-management">
    <Header></Header>
    <el-row class="toolbar">
      <el-col :span="4">
        <el-input v-model="searchText" placeholder="搜索学生姓名" class="search-input"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button @click="dialogVisible = true" type="primary" class="add-button">添加记录</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="filteredData"
      style="width: 100%;margin-top:5px"
      height="calc(100% - 150px)"
      stripe>
      <el-table-column prop="Id" label="序号"></el-table-column>
      <el-table-column prop="Time" label="时间"></el-table-column>
      <el-table-column prop="Locate_floor" label="所在楼栋"></el-table-column>
      <el-table-column prop="Student_name" label="学生姓名"></el-table-column>
      <el-table-column prop="Dormitory" label="所在宿舍"></el-table-column>
      <el-table-column label="出入类型">
        <template v-slot="{ row }">
          <el-button size="mini" :type="row.Access_status === 'chu' ? 'danger' : 'success'">
            {{ row.Access_status === 'chu' ? '出' : '入' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template v-slot="{ row }">
          <el-button size="mini" @click="deleteEntry(row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加记录" :visible.sync="dialogVisible">
      <el-form :model="formData" :rules="rules" ref="dataForm">
        <el-form-item label="序号" prop="Id">
          <el-input v-model.number="formData.Id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="Time">
          <el-input v-model="formData.Time" type="datetime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在楼栋" prop="Locate_floor">
          <el-input v-model="formData.Locate_floor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" prop="Student_name">
          <el-input v-model="formData.Student_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在宿舍" prop="Dormitory">
          <el-input v-model="formData.Dormitory" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出入类型" prop="Access_status">
          <el-input v-model="formData.Access_status" autocomplete="off"></el-input>
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
        Time: '',
        Locate_floor: '',
        Student_name: '',
        Dormitory: '',
        Access_status: ''
      },
      rules: {
        Id: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        Time: [{ required: true, message: '请输入时间', trigger: 'blur' }],
        Locate_floor: [{ required: true, message: '请输入所在楼栋', trigger: 'blur' }],
        Student_name: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
        Dormitory: [{ required: true, message: '请输入所在宿舍', trigger: 'blur' }],
        Access_status: [{ required: true, message: '请输入出入类型', trigger: 'blur' }]
      }
    };
  },
  computed: {
    filteredData() {
      return this.data.filter(item => item.Student_name.toLowerCase().includes(this.searchText.toLowerCase()));
    }
  },
  methods: {
    fetchData() {
      axios.post('http://127.0.0.1:8000/smartschools/Get_Access_status_table/')
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
      axios.post('http://127.0.0.1:8000/smartschools/Add_Access_status_table/', this.formData)
        .then(response => {
          this.$message({ message: '记录添加成功', type: 'success' });
          this.dialogVisible = false;
          this.fetchData();
        })
        .catch(error => {
          console.error('Error adding record:', error);
          this.$message({ message: '添加失败', type: 'error' });
        });
    },
    deleteEntry(row) {
      axios.post('http://127.0.0.1:8000/smartschools/Decrease_Access_status_table/', { 'Id': row.Id })
        .then(response => {
          this.data.splice(this.data.indexOf(row), 1);
          this.$message({ message: '记录删除成功', type: 'success' });
        })
        .catch(error => {
          console.error('Error deleting record:', error);
          this.$message({ message: '删除失败', type: 'error' });
        });
    },
    handleDialogClose() {
      this.dialogVisible = false;
      this.formData = {
        Id: '',
        Time: '',
        Locate_floor: '',
        Student_name: '',
        Dormitory: '',
        Access_status: ''
      };
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
</script>
<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  font-family: 'Arial', sans-serif;
  background: #f4f4f4; 
}

#dormitory-access-management {
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