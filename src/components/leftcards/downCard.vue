<template>
	<div class="card-wrapper">
		<div class="card">
			<div class="card-top">
				<h1 class="title">出入管理</h1>
				<span class="button-text" @click="showDialog('A')">在线查寝</span>
			</div>
			<div class="card-content" ref='content'>
        <div v-for="(device, index) in security_device" :key="index" class='scroll'>{{ device.show }}</div>
        </div>
			<div class="card-bottom">
				<span class="button-text" @click="showAlert">空间展示</span>
				<span class="button-text" @click="showDialog('C')">人流量分析</span>
			</div>
		</div>
		<!-- 弹出框容器 -->
    <el-dialog title="在线查寝" :visible.sync="dialogVisible.A">
      <el-row>
        <el-col :span="12">
      <el-radio-group v-model="searchType">
        <el-radio label="dormitory">查宿舍</el-radio>
        <el-radio label="student">查学生</el-radio>
      </el-radio-group>

      <!-- 宿舍查询表单 -->
      <el-form v-show="searchType === 'dormitory'" :model="dormitoryForm" label-width="80px">
        <el-form-item label="选择区域">
          <el-select v-model="dormitoryForm.region" placeholder="请选择">
            <el-option
              v-for="(option, index) in options1"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
            <!-- 其他区域选项 -->
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋">
          <el-select v-model="dormitoryForm.building" placeholder="请选择">
            <el-option
              v-for="(option, index) in options2"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宿舍">
          <el-select v-model="dormitoryForm.room" placeholder="请选择">
            <el-option
              v-for="(option, index) in options3"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择日期">
          <el-date-picker v-model="dormitoryForm.date" type="datetime"></el-date-picker>
        </el-form-item>
      </el-form>

      <!-- 学生查询表单 -->
      <el-form v-show="searchType === 'student'" :model="studentForm" label-width="80px">
        <el-form-item label="学生姓名">
          <el-input v-model="studentForm.name" placeholder="请输入学生姓名"></el-input>
        </el-form-item>
        <el-form-item label="选择日期">
          <el-date-picker v-model="studentForm.date" type="datetime"></el-date-picker>
        </el-form-item>
      </el-form>

      <el-button @click="search" type="primary">查询</el-button>

      <!-- 查询结果 -->
    </el-col>
    <el-col :span="12">
      <!-- 查询结果 -->
      <div v-if="searchResult" class="result">
        <h3>查询结果：</h3>
        <div v-if="searchType === 'dormitory'">
          <p>所在楼栋：{{ searchResult.所在楼栋 }}</p>
          <p>所在宿舍：{{ searchResult.所在宿舍 }}</p>
          <p>宿舍总人数：{{ searchResult.宿舍总人数 }}</p>
          <p>已到人数：{{ searchResult.已到人数 }}</p>
          <p>未到人数：{{ searchResult.未到人数 }}</p>
          <p>寝室长姓名：{{ searchResult.寝室长姓名 }}</p>
          <p>寝室长电话：{{ searchResult.寝室长电话 }}</p>
        </div>
        <div v-else-if="searchType === 'student'">

          <p>学生姓名：{{ searchResult.学生姓名 }}</p>
          <p>是否在宿舍：{{ searchResult.是否在宿舍 }}</p>
          <p>所在楼栋：{{ searchResult.所在楼栋 }}</p>
          <p>所在宿舍：{{ searchResult.所在宿舍 }}</p>
          <p>联系电话：{{ searchResult.联系电话 }}</p>
          <p>寝室长姓名：{{ searchResult.寝室长姓名 }}</p>
          <p>寝室长电话：{{ searchResult.寝室长电话 }}</p>
        </div>
      </div>
    </el-col>
  </el-row>
    </el-dialog>

    <el-dialog
      v-if="dialogVisible.C"
      title="人流量分析"
      :visible.sync="dialogVisible.C"
      width="50%"
      >
      <div class="select-container">
        <div>
          <div class="select-title">
            <span>选择类型：</span>
          </div>
          <el-select v-model="analysisOption1" @change="onTypeChange">
            <el-option
              v-for="(option, index) in typeOptions"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        <el-row>
          <el-col :span="12">
        <div>
          <span>选择区域：</span>
          <el-select v-model="selectedOption1">
            <el-option
              v-for="(option, index) in options1"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        </el-col>
        <el-col :span="12">
          <div>
            <span>选择楼栋：</span>               
            <el-select v-model="selectedOption2">
              <el-option
                v-for="(option, index) in options2"
                :key="index"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        </el-row>
        <div>
          <div class="select-title">
            <span>日期选择：</span>
          </div>
          <el-select v-model="analysisOption2">
            <el-option
              v-for="(option, index) in analysisOptions2"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        <!-- 根据选择的日期范围显示日期选择器 -->
        <div v-if="spaceOption2 === '自定义时间段'">
          <div>
            <div class="select-title">
              <span>起始日期：</span>
            </div>
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div>
            <div class="select-title">
              <span>结束日期：</span>
            </div>
            <el-date-picker
              v-model="endDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="renderChart">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="dialogVisible.B"
      title="空间展示"
      :visible.sync="dialogVisible.B"
      width="50%">
      <div class="select-container">
        <div>
          <div class='select-title'>
            <span >选择类型：</span>
          </div>
          <el-select v-model="spaceOption1">
            <el-option
              v-for="(option, index) in spaceOptions1"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <div class='select-title'>
            <span >日期选择：</span>
          </div>
          <el-select v-model="spaceOption2">
            <el-option
              v-for="(option, index) in spaceOptions2"
              :key="index"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </div>
        <!-- 根据选择的日期范围显示日期选择器 -->
        <div v-if="spaceOption2 === '自定义时间段'">
          <div>
            <div class='select-title'>
              <span >起始日期：</span>
            </div>
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div>
            <div class='select-title'>
              <span >结束日期：</span>
            </div>
            <el-date-picker
              v-model="endDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="renderGeojson">确定</el-button>
      </span>
  </el-dialog>
  <el-dialog :visible="showChart" title="用电统计" width="700px" @close="closeChart" style="height: 700px; overflowY:hidden">
    <div ref="chart" style="width: 100%;height:500px"></div>
  </el-dialog>
	</div>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx';
import * as echarts from 'echarts';
export default {
	name: 'CardComponent',
	data() {
		return {
      searchType: 'dormitory',
      dormitoryForm: {
        region: '',
        building: '',
        room: '',
        date: ''
      },
      studentForm: {
        name: '',
        date: ''
      },
			dialogVisible: {
				A: false,
				B: false,
				C: false
			},
			alertList: [ // 预警信息列表
				// 其他预警信息...
			],
      spaceOption1: '',
      analysisOption1: '',
      typeOptions: [
        { label: '出入统计', value: '出入统计' },
        { label: '异常人数汇总', value: '异常人数汇总' },
      ],
      spaceOption2: '',
      startDate: '',
      endDate: '',
      spaceOptions1: [
        { label: '已在宿舍人数', value: '已在宿舍人数' },
        { label: '未归人数', value: '未归人数' }
      ],
      //当天，近7天，近1个月，自定义时间段
      spaceOptions2: [
        { label: '当天', value: '当天' },
        { label: '自定义时间段', value: '自定义时间段' }
      ],
      analysisOption2: '',
      analysisOptions2: [
        { label: '当天', value: '当天' },
        { label: '自定义时间段', value: '自定义时间段' }
      ],
			v: 0,
			a: 0,
			w: 0,
			totalE: 0,
			hot_consum:'',
			cool_consum:'',
			water_pressure:'',
      security_device:[],
			water_speed:'',
			selectedOption1: '',
			selectedOption2: '',
			selectedOption3: '',
			selectedOption4: '',
			selectedOption5: '',
			selectedOption6: '',
			searchResult: '',
			hot_water: '',
			cool_water: '',
			Sushe:[],
			Admin:[],
      analysisData:{
        '1区1栋当天出入统计':
        {
          x: [
              "0-2", "2-4", "4-6", "6-8", "8-10", "10-12",
              "12-14", "14-16", "16-18", "18-20", "20-22", "22-24"
          ],
          y: [
              24, 9, 4, 35, 45, 95,
              88, 42, 64, 45, 115, 80
          ],
          z: [
              5, 2, 10, 135, 85, 44,
              50, 117, 54, 112, 45, 24
          ]
        },
        '1区1栋近7天异常人数汇总':
        {
          x: [
              "4月1日", "4月2日", "4月3日", "4月4日", "4月5日", "4月6日", "4月7日"
          ],
          y: [
              24, 29, 19, 22, 24, 45, 42
          ],
          z: [
              5, 2, 4, 3, 2, 16, 4
          ],
          w: [
              8, 6, 4, 5, 3, 0, 0
          ]
        },
      },
			// options1八个选项
			options1: [
				{ label: '1', value: '1' },
				{ label: '2', value: '2' },
				{ label: '3', value: '3' },
				{ label: '4', value: '4' },
				{ label: '5', value: '5' },
				{ label: '6', value: '6' },
				{ label: '7', value: '7' },
				{ label: '8', value: '8' }
			],
			options2: [
				{ label: '1', value: '1' },
				{ label: '2', value: '2' },
				{ label: '3', value: '3' }
			],
			options3: [
				{ label: '101', value: '101' },
        { label: '102', value: '102' },
        { label: '103', value: '103' }
			],
      showChart: false,
      students : [
        {
            "学生姓名": "赵一",
            "是否在宿舍": "是",
            "所在楼栋": "1区1栋",
            "所在宿舍": "101",
            "联系电话": "15927939680",
            "寝室长姓名": "赵一",
            "寝室长电话": "15927939680"
        },
        {
            "学生姓名": "赵二",
            "是否在宿舍": "是",
            "所在楼栋": "1区1栋",
            "所在宿舍": "101",
            "联系电话": "15336511230",
            "寝室长姓名": "赵一",
            "寝室长电话": "15927939680"
        },
        {
            "学生姓名": "赵三",
            "是否在宿舍": "否",
            "所在楼栋": "1区1栋",
            "所在宿舍": "101",
            "联系电话": "17625368538",
            "寝室长姓名": "赵一",
            "寝室长电话": "15927939680"
        },
        {
            "学生姓名": "赵四",
            "是否在宿舍": "是",
            "所在楼栋": "1区1栋",
            "所在宿舍": "101",
            "联系电话": "14798371934",
            "寝室长姓名": "赵一",
            "寝室长电话": "15927939680"
        },
        {
            "学生姓名": "赵五",
            "是否在宿舍": "是",
            "所在楼栋": "1区1栋",
            "所在宿舍": "101",
            "联系电话": "18858753529",
            "寝室长姓名": "赵一",
            "寝室长电话": "15927939680"
        },
        {
            "学生姓名": "赵六",
            "是否在宿舍": "否",
            "所在楼栋": "1区1栋",
            "所在宿舍": "101",
            "联系电话": "15759179592",
            "寝室长姓名": "赵一",
            "寝室长电话": "15927939680"
        }
      ],
      dormitory :[
          {
              "所在楼栋": "1区1栋",
              "所在宿舍": "101",
              "宿舍总人数": 6,
              "已到人数": 4,
              "未到人数": 2,
              "寝室长姓名": "赵一",
              "寝室长电话": "15927939680"
          }
      ],


		};
	},
	mounted() {
		// 获取数据
		this.getAllEle()
		this.fetchSushe()
		this.fetchAdmin()

	},
  watch: {
    searchType(newVal) {
      if (newVal === 'dormitory') {
        // 重置学生查询表单
        this.searchResult = null;
        this.studentForm = {
          name: '',
          date: ''
        };
      } else if (newVal === 'student') {
        // 重置宿舍查询表单
        this.searchResult = null;
        this.dormitoryForm = {
          region: '',
          building: '',
          room: '',
          date: ''
        };
      }
    }
  },
	methods: {
    closeChart(){
      this.showChart = false;
    },
    renderChart(){
      this.dialogVisible.C = false;
      // 获取当前日期
      let date = ''
      if(this.analysisOption2==='当天'){
        date = new Date().toLocaleDateString()
      }
      let c =  this.selectedOption1 + '区' + this.selectedOption2 + '栋' + this.analysisOption2 + this.analysisOption1
      let title = this.selectedOption1 + '区' + this.selectedOption2 + '栋' + date === '' ? this.analysisOption2:date + this.spaceOption1
      this.showChart = true;
      if (this.analysisData[c]) {
      this.$nextTick(() => {
        this.chart = echarts.init(this.$refs.chart);
        // 指定图表的配置项和数据
        let option
        if(this.analysisOption1 === '出入统计'){
          option = {
            title: {
              text: `${c}统计`
            },
            tooltip: {
              show: true,
              trigger: 'axis',
              axisPointer: {
                type: 'cross', // 显示交叉指示器
                crossStyle: {
                  color: '#999'
                }
              }
            },
            toolbox: {
              right: 20,
              feature: {
                saveAsImage: {},
                restore: {},
                dataView: {},
                dataZoom: {},
                magicType: {
                  type: ['line', 'bar'] // 支持切换为折线图和柱状图
                },
              }
            },
            legend: {
                  data: ['出(人)', '进(人)'],
                  align: 'right',
                  right: 10,
                  bottom: 10
              },
              xAxis: {
                  type: 'category',
                  data: this.analysisData[c].x
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                  {
                      name: '出(人)',
                      type: 'line',
                      data: this.analysisData[c].z
                  },
                  {
                      name: '进(人)',
                      type: 'line',
                      data: this.analysisData[c].y
                  },
              ]
            };
        }else{
          option = {
            title: {
              text: `${c}统计`
            },
            tooltip: {
              show: true,
              trigger: 'axis',
              axisPointer: {
                type: 'cross', // 显示交叉指示器
                crossStyle: {
                  color: '#999'
                }
              }
            },
            toolbox: {
              right: 20,
              feature: {
                saveAsImage: {},
                restore: {},
                dataView: {},
                dataZoom: {},
                magicType: {
                  type: ['line', 'bar'] // 支持切换为折线图和柱状图
                },
              }
            },
            legend: {
                  data: ['晚归人数(人)', '未归人数(人)','有课未出人数(人)'],
                  align: 'right',
                  right: 10,
                  bottom: 10
              },
              xAxis: {
                  type: 'category',
                  data: this.analysisData[c].x
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                  {
                      name: '晚归人数(人)',
                      type: 'bar',
                      data: this.analysisData[c].y
                  },
                  {
                      name: '未归人数(人)',
                      type: 'bar',
                      data: this.analysisData[c].z
                  },
                  {
                      name: '有课未出人数(人)',
                      type: 'bar',
                      data: this.analysisData[c].w
                  },
              ]
            };
        }
        // 使用刚指定的配置项和数据显示图表
        this.chart.setOption(option);
      });
      } else {
        this.$message.error('暂无数据');
        this.showChart = false;
      }
      console.log(c)
    },
    renderGeojson(){
      this.dialogVisible.B = false;
      this.$emit('renderGeojson', this.spaceOption2 + this.spaceOption1)
    },
    onTypeChange(value) {
      if (value === '异常人数汇总') {
        this.analysisOptions2 = [
          { label: '近7天', value: '近7天' },
          { label: '自定义时间段', value: '自定义时间段' }
        ];
      } else if (value === '出入统计') {
        this.analysisOptions2 = [
          { label: '当天', value: '当天' },
          { label: '自定义时间段', value: '自定义时间段' }
        ];
      }
      // 清空当前选择的日期选项
      this.spaceOption2 = '';
    },
		showDialog(button) {
			// 关闭其他对话框
			this.searchResult = '';
			Object.keys(this.dialogVisible).forEach(key => {
				this.dialogVisible[key] = false;
			});
			// 打开对应的对话框
			this.dialogVisible[button] = true;
		},
		locate() {
			// 定位逻辑
			// 关闭对话框
			this.dialogVisible.A = false;
			this.$emit('locate',this.selectedOption1 + '区' + this.selectedOption2 + '栋')
		},
    search() {
      if (this.searchType === 'dormitory') {
        // 模拟宿舍查询结果
        let result = this.dormitory.find(item => item.所在楼栋 === this.dormitoryForm.region+ '区' + this.dormitoryForm.building + '栋');
        console.log(this.dormitoryForm.region + this.dormitoryForm.building)
        if(!result){
          this.$message.error('未找到相关信息');
          return;
        }
        console.log(result)
        // "所在楼栋": "1区1栋",
              // "所在宿舍": "101",
              // "宿舍总人数": 6,
              // "已到人数": 4,
              // "未到人数": 2,
              // "寝室长姓名": "赵一",
              // "寝室长电话": "15927939680"
              // 上面为结果字段
        this.searchResult = {
          所在楼栋: result.所在楼栋,
          所在宿舍: result.所在宿舍,
          宿舍总人数: result.宿舍总人数,
          已到人数: result.已到人数,
          未到人数: result.未到人数,
          寝室长姓名: result.寝室长姓名,
          寝室长电话: result.寝室长电话
        };
        // 重置学生查询表单
        this.studentForm = {
          name: '',
          date: ''
        };
      } else if (this.searchType === 'student') {
        // 模拟学生查询结果
        let student = this.students.find(item  => item.学生姓名 === this.studentForm.name);
        if(!student){
          this.$message.error('未找到相关信息');
          return;
        }
        //          "学生姓名": "赵二",
        // "是否在宿舍": "是",
        //   "所在楼栋": "1区1栋",
        //   "所在宿舍": "101",
        //   "联系电话": "15336511230",
        //   "寝室长姓名": "赵一",
        //   "寝室长电话": "15927939680"
        this.searchResult = {
          学生姓名: student.学生姓名,
          是否在宿舍: student.是否在宿舍,
          所在楼栋: student.所在楼栋,
          所在宿舍: student.所在宿舍,
          联系电话: student.联系电话,
          寝室长姓名: student.寝室长姓名,
          寝室长电话: student.寝室长电话
        };
        // 重置宿舍查询表单
        this.dormitoryForm = {
          region: '',
          building: '',
          room: '',
          date: ''
        };
      }
    },
		exportToExcel() {
			if(this.searchResult === '') {
				this.$message({
					message: '请先查询数据',
					type: 'warning'
				});
				return;
			}
			// 制作中文字段
			let data = {
        '学生姓名': this.searchResult.Student_name,
        '宿舍号': this.searchResult.Dormitory,
        '出入状态': this.searchResult.Access_status === 'chu' ? '出' : '入',
        '时间': this.searchResult.Time
			}
			var wb = XLSX.utils.book_new();
			var ws = XLSX.utils.json_to_sheet([data]);
			XLSX.utils.book_append_sheet(wb, ws, "sheet1");
			XLSX.writeFile(wb, this.selectedOption1 + '区' + this.selectedOption2 + '栋' + this.selectedOption3 +"宿舍"+ '出入数据'+'.xlsx');
			// 关闭对话框
			this.dialogVisible.C = false;
		},
		showDetail(index) {
			// 点击预警信息，展示详情
			// 从Sushe数组中找到对应的宿舍信息
			// 从Admin数组中找到对应的管理员信息
      console.log('this.alertList[index]',this.alertList[index])
			this.dialogVisible.B = false;
			let admin = this.Admin.find(item => item.Manage_building === this.alertList[index].Locate_Building);
			let sushe = this.Sushe.find(item => item.Locate_Building === this.alertList[index].Locate_Building);
			// 打印出sushe和admin
			console.log(sushe, admin)
			let peoplePhone = {
				sushe: sushe.Header_Phone,
				admin: admin.Phone
			}
			console.log('this.alertList[index].Locate_Building',sushe.Locate_Building)
			this.$emit('locate', sushe.Locate_Building, peoplePhone)
			
		},
		showAlert(){
			this.getAllAlert();
			this.showDialog('B');
		},
		getAllEle(){
			// 同时请求冷水热水两个接口的数据
			axios.all([
				axios.post('http://127.0.0.1:8000/smartschools/Get_Access_status_table/'),
				axios.post('http://127.0.0.1:8000/smartschools/Get_Building_ammeter/')
			]).then(axios.spread((access, dElec) => {
				this.access = access.data;
				this.dormitoryE = dElec.data;	
        console.log('accc',this.access)
				// 数据示例 {
				//     "Id": 1,
				//     "Ammeter": "D0101",
				//     "Time": "2022-02-20 10:13:23",
				//     "Locate_Building": "1区1栋",
				//     "Voltage": "220",
				//     "Current": "5",
				//     "Electrical_power": "8",
				//     "Cumulative_workload": "15000",
				//     "Today_electricity_consumption": "300"
				// }
				// 先从所有数据中算出要展示在卡片中的信息，Today_electricity_consumption求和，其余取第一个宿舍的
        console.log(this.security_device)
        // 通过Security_equipment_Id字段的首字母确认设备类型。Y为烟雾报警器，M为灭火器
        // 拼接一个字符串，展示在卡片中
        // 例如：1区1栋1楼烟雾报警器异常 就是Locate_Building + type + access_STATUS 的false为异常，true为正常
        // {
        //     "Id": 67,
        //     "Time": "2022-03-28 21:11:49",
        //     "Locate_floor": "8区11栋",
        //     "Student_name": "8区11栋1楼1宿舍1号",
        //     "Dormitory": "8110101.0",
        //     "Access_status": "chu"
        // }
        this.security_device = this.access.map(item => {
          let type = item.Access_status === 'chu' ? '出' : '入';
          let time = item.Time
          item.show = time+'-'+ item.Student_name + type
          return item;
        })
				
				// 数据查询模块
			}));
			
		},
		getAllAlert(){
      //       {
      //     "Id": 67,
      //     "Time": "2022-03-28 21:11:49",
      //     "Locate_floor": "8区11栋",
      //     "Student_name": "8区11栋1楼1宿舍1号",
      //     "Dormitory": "8110101.0",
      //     "Access_status": "chu"
      // }
      // 过滤除所有Access_status为chu的数据
      let al1 = this.access.filter(item => item.Access_status === 'chu')
      console.log('menjinyujin',al1)
      let count = {}
      al1.forEach(item => {
        let key = item.Student_name.split('号')[0]
        if (count[key]) {
          count[key]++
        } else {
          count[key] = 1
        }
      })
      // 拼接展示字符串
      // 例如：8区11栋1楼1宿舍出现了3次
      // 通过Object.keys(count)获取所有的键，遍历这个数组，拼接字符串
      // 加上一个时间参数，获取当前时间
      let time = new Date().toLocaleString()
      this.alertList = Object.keys(count).map(key => {
        return {
          Time: time,
          Locate_Building: key,
          count: count[key]
        }
      })


		},
		fetchSushe() {
				axios.post('http://127.0.0.1:8000/smartschools/Get_Dormitory_table/').then(response => {
					this.Sushe = response.data;
					this.loading = false;
				}).catch(error => console.error('Error fetching data:', error));
		},
		fetchAdmin() {
				axios.post('http://127.0.0.1:8000/smartschools/Get_Administrator_information/').then(response => {
					this.Admin = response.data;
					this.loading = false;
				}).catch(error => console.error('Error fetching data:', error));
			},
	}
};
</script>

<style scoped>
.card {
	position: relative;
	width: 280px;
	height: 200px;
	background-size: cover;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0);
	display: flex;
	background-image: url('@/assets/矩形.png');
	flex-direction: column;
	margin-bottom: 5px;
}
.card-top,
.card-bottom {
	display: flex;
	justify-content: space-between;
	padding: 10px;
	background-color: rgba(0, 0, 0, 0.2); /* 半透明背景以区分内容 */
}
.title {
	margin: 0;
	text-align: left; /* 将标题靠左对齐 */
	color: #FFFFFF;
	font-size: 16px;
	line-height: 30px; /* 调整行高使标题垂直居中 */
}
.button-text {
	color: #FFFFFF;
	cursor: pointer;
	font-size: 16px;
	line-height: 30px;
}
.card-content {
	flex-grow: 1;
	padding: 2px;
	color: #FFFFFF;
	text-align: left;
	padding-left: 10px;
	background-color: rgba(0, 0, 0, 0.1); /* 半透明背景突出内容区 */
	overflow :hidden;
}
.scroll{
  animation: scroll 10s linear infinite; 
}

@keyframes scroll {
  0% {
      transform: translateY(0); /* 初始状态：不偏移 */
  }
  100% {
      transform: translateY(-1000%); /* 终止状态：向上偏移100%的高度 */
  }
}
.select-container {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
.alert-item {
	cursor: pointer;
	padding: 5px;
	border-radius: 5px;
	margin-bottom: 5px;
	background-color: #f0ad4e; /* 设置背景色为黄色 */
	color: #fff; /* 设置文字颜色为白色 */
}
.alert-list {
	max-height: 300px; /* 设置最大高度 */
	overflow-y: auto; /* 当内容超过最大高度时，显示垂直滚动条 */
}
/* 自定义滚动条样式 */
.alert-list::-webkit-scrollbar {
	width: 10px;
}

.alert-list::-webkit-scrollbar-track {
	background-color: #f2f2f2;
	border-radius: 5px;
}

.alert-list::-webkit-scrollbar-thumb {
	background-color: #888;
	border-radius: 5px;
}

.alert-list::-webkit-scrollbar-thumb:hover {
	background-color: #555;
}

.alert-item:hover {
	background-color: #eea236; /* 鼠标悬停时更换颜色 */
}
.result-container {
	margin-top: 10px;
	border: 1px solid #ccc;
	padding: 5px;
	background-color: #f5f5f5;
	min-height: 100px;
}
.result {
  margin-top: 0px;
  border-top: 1px solid #ebeef5;
  padding-left: 10px;
}

.result h3 {
  margin-bottom: 20px;
  font-weight: bold;
}

.result p {
  margin-bottom: 5px;
}
</style>
