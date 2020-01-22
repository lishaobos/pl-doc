import axios from 'axios'

export const getCityListByParentId = parentCode => axios.get(`/apis/v1/systemctl/location/parent/${parentCode}`)
