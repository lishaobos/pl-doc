import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onGet('/apis/v1/oss/upload/sts').reply(200, {
  'status': 200, 'result': { 'requestId': '553A7FB1-CDF6-4AEC-A8EC-53BC1923D42B', 'credentials': { 'securityToken': 'CAISqgN1q6Ft5B2yfSjIr5bhO43c2OxAw6aZdmDbk2Iia8oZio7p1Tz2IHlMdXZoBOsctfkwlW1R5/wTlol4FJQcG0KdM5Mp4pkL+lKrM9easMXr5OVYgZGrEDXDV0YwbSVp/aCrIunGc9KBNnpA/00amMl0HFfPdlihNoLzY/cFCv0cQgi/axdfGd5SPXEMgcQGNHzXR/TPVxnxmTj/AVZPsAhxgn8djKOk2Z+k9wb5hl/3wfN334PqOcqIYs1hIJpYWdW41/AUE63ay3x06gNWzK5skLcmiTDcpYO0CV5L/zCbN/bV6tR1MDJhYq8zF8wjq+Pnx9l5ofD0nYb6wApWR9E3NR7SX4e92sDJNfq0P9IiD9bBNm/Kz8qEO+uh0XAtamlJMxhRKZhzaC1oBBojTjjbb7Cq+VXDZgPBPqGOy/MxyoEnjQeqr8KHIVeLSrTczisZP5Y4awRqFWZPjD2wK/5fL1IQKg87XufPd+gpMkAC85GPlBbJSyhtwktQu/DDfP7MssgdE96mBsMZiddGPs8b7Dp3FgWtGqjOmkYdcjQ9Ge9GeBs+mWcfRtQagAE5yKdC9LB45iQ7rnUGh5fCCyH9s2iS2ob9di22cvZ8/sAaz6+xIPBkuP5zFq+atH4fGR5lNKlO3/rQyUqsi9Ba5KELuXeZ7s4Oy/ITvV4+xmZYr8iWYRzgnUA6LHeOG2WchcuOktP/IHdzpetYV7D6+SkXuDnWvE1XCMevNP+L/A==', 'accessKeySecret': '7EVrxK1hxhTfsUfGKK5uKKPrp4iQLZnbPbWyBSYF3j4P', 'accessKeyId': 'STS.NUTp7h53atdrtFjwbwgE5eKB7', 'expiration': '2020-01-03T07:48:38Z' }, 'assumedRoleUser': '' }, 'traceId': '9b351fa7aa6640ae857988cc1774d8b2', 'devMessage': 'SUCCESS', 'message': '', 'url': 'http://192.168.130.34/apis/v1/oss/upload/sts'
});

mock.onGet(`/apis/v1/systemctl/location/parent`).reply(200, {
  'status': 200, 'result': [{ 'sequenceNbr': '72', 'pinyinName': '', 'locationName': '朝阳区', 'locationCode': '72', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2800', 'pinyinName': '', 'locationName': '海淀区', 'locationCode': '2800', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2801', 'pinyinName': '', 'locationName': '西城区', 'locationCode': '2801', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2802', 'pinyinName': '', 'locationName': '东城区', 'locationCode': '2802', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2803', 'pinyinName': '', 'locationName': '崇文区', 'locationCode': '2803', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2804', 'pinyinName': '', 'locationName': '宣武区', 'locationCode': '2804', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2805', 'pinyinName': '', 'locationName': '丰台区', 'locationCode': '2805', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2806', 'pinyinName': '', 'locationName': '石景山区', 'locationCode': '2806', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2807', 'pinyinName': '', 'locationName': '门头沟', 'locationCode': '2807', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2808', 'pinyinName': '', 'locationName': '房山区', 'locationCode': '2808', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2809', 'pinyinName': '', 'locationName': '通州区', 'locationCode': '2809', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2810', 'pinyinName': '', 'locationName': '大兴区', 'locationCode': '2810', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2812', 'pinyinName': '', 'locationName': '顺义区', 'locationCode': '2812', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2814', 'pinyinName': '', 'locationName': '怀柔区', 'locationCode': '2814', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2816', 'pinyinName': '', 'locationName': '密云区', 'locationCode': '2816', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2901', 'pinyinName': '', 'locationName': '昌平区', 'locationCode': '2901', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '2953', 'pinyinName': '', 'locationName': '平谷区', 'locationCode': '2953', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }, { 'sequenceNbr': '3065', 'pinyinName': '', 'locationName': '延庆区', 'locationCode': '3065', 'parentCode': '1', 'locationLevel': 2, 'orderNum': 0, 'longitude': '0', 'latitude': '0' }], 'traceId': '6d3a4f9bbccb4a8b8ec6bf1ac7b27040', 'devMessage': 'SUCCESS', 'message': '', 'url': 'http://192.168.130.34/apis/v1/systemctl/location/parent/1'
})
