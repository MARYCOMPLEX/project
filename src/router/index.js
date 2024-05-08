import VueRouter from 'vue-router';
import Vue from 'vue';
Vue.use(VueRouter)
// 主要路由有
// if(command === 'security_equipment_management') {
//   this.$router.push('/security_equipment_management')
// } else if (command === 'administrator_information_management') {
//   this.$router.push('/administrator_information_management')
// } else if (command === 'building_management') {
//   this.$router.push('/building_management')
// } else if (command === 'building_cold_water_meter_management') {
//   this.$router.push('/building_cold_water_meter_management')
// } else if (command === 'building_hot_water_meter_management') {
//   this.$router.push('/building_hot_water_meter_management')
// } else if (command === 'access_control_management') {
//   this.$router.push('/access_control_management')
// } else if (command === 'camera_management') {
//   this.$router.push('/camera_management')
// } else if (command === 'dormitory_management') {
//   this.$router.push('/dormitory_management')
// } else if (command === 'dormitory_electricity_meter_management') {
//   this.$router.push('/dormitory_electricity_meter_management')
// } else if (command === 'dormitory_cold_water_meter_management') {
//   this.$router.push('/dormitory_cold_water_meter_management')
// } else if (command === 'dormitory_hot_water_meter_management') {
//   this.$router.push('/dormitory_hot_water_meter_management')
// } else if (command === 'student_information_management') {
//   this.$router.push('/student_information_management')
// }
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/login')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../components/register')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../components/main')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../components/test')
  },
  {
    path: '/security_equipment_management',
    name: 'security_equipment_management',
    component: () => import('../components/managements/security_equipment_management')
  },
  {
    path: '/administrator_information_management',
    name: 'administrator_information_management',
    component: () => import('../components/managements/administrator_information_management')
  },
  {
    path: '/building_management',
    name: 'building_management',
    component: () => import('../components/managements/building_management')
  },
  {
    path: '/building_cold_water_meter_management',
    name: 'building_cold_water_meter_management',
    component: () => import('../components/managements/building_cold_water_meter_management')
  },
  {
    path: '/building_hot_water_meter_management',
    name: 'building_hot_water_meter_management',
    component: () => import('../components/managements/building_hot_water_meter_management')
  },
  {
    path: '/access_control_management',
    name: 'access_control_management',
    component: () => import('../components/managements/access_control_management')
  },
  {
    path: '/camera_management',
    name: 'camera_management',
    component: () => import('../components/managements/camera_management')
  },
  {
    path: '/dormitory_management',
    name: 'dormitory_management',
    component: () => import('../components/managements/dormitory_management')
  },
  {
    path: '/dormitory_electricity_meter_management',
    name: 'dormitory_electricity_meter_management',
    component: () => import('../components/managements/dormitory_electricity_meter_management')
  },
  {
    path: '/dormitory_cold_water_meter_management',
    name: 'dormitory_cold_water_meter_management',
    component: () => import('../components/managements/dormitory_cold_water_meter_management')
  },
  {
    path: '/dormitory_hot_water_meter_management',
    name: 'dormitory_hot_water_meter_management',
    component: () => import('../components/managements/dormitory_hot_water_meter_management')
  },
  {
    path: '/student_information_management',
    name: 'student_information_management',
    component: () => import('../components/managements/student_information_management')
  }
 
  
]

const router = new VueRouter({
    mode:'hash',
    routes
})

export default router;
