import axios from 'axios'

export function convert (config) {
  const instance = axios.create({
    baseURL:'https://restapi.amap.com/v3/assistant/coordinate'
  })
  return instance(config)
}
export function user (config) {
  const instance = axios.create({
    baseURL:'http://127.0.0.1:8000/travel/',
  })
  return instance(config)
}
