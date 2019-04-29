import { createReducer } from '../../app/common/util/reducerUtil'
//import {ONE_ACTION } from './constants'

const initialData = [
    {
      name: 'Page A', uv: 4000, pv: 2400, zv: 400, amt: 2400,
    },
    {
      name: 'Page B', uv: 3000, pv: 1398, zv: 500, amt: 2210,
    },
    {
      name: 'Page C', uv: 2000, pv: 9800, zv: 800, amt: 2290,
    },
    {
      name: 'Page D', uv: 2780, pv: 3908, zv: 200,amt: 2000,
    },
    {
      name: 'Page E', uv: 1890, pv: 4800, zv: 400, amt: 2181,
    },
    {
      name: 'Page F', uv: 2390, pv: 3800, zv: 500, amt: 2500,
    },
    {
      name: 'Page G', uv: 3490, pv: 4300, zv: 600,amt: 2100,
    },
  ];
/*
export const oneAction = (data, payload) => {
    return payload.data
}
*/

export default createReducer(initialData, [])
 