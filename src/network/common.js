import { convert } from "@/network/request";
import { user } from "@/network/request";
export function gpsConvert(params) {
  params.key = '6ed45273ceb2400a6fec7881bd92fa01'
  params.coordsys = 'gps'
  return convert({
    url:'/convert',
    params:params
  })
}
export function userLogin(params) {
  return user({
    method:'POST',
    url:'login',
    params
  })
}
export function userRegister(params) {
  return user({
    method:'POST',
    url:'regist',
    params
  })
}