import axios from './mock'

export const getCityListByParentId = parentCode => axios.get(`/apis/v1/systemctl/location/parent`)
