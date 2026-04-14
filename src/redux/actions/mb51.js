/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'

export default {
  getMb51: (token, period, search) => ({
    type: 'GET_MB51',
    payload: http(token).get(`/mb51/report/get?period=${period || ''}&search=${search || ''}`)
  }),
  getDetailMb51: (token, id) => ({
    type: 'GET_DETAIL_MB51',
    payload: http(token).get(`/mb51/report/detail/${id}`)
  }),
  generateMb51: (token, data) => ({
    type: 'GENERATE_MB51',
    payload: http(token).post(`/mb51/report/generate`, data)
  }),
  deleteMb51: (token, data) => ({
    type: 'DELETE_MB51',
    payload: http(token).patch(`/mb51/report/delete`, data)
  }),
  resetMb51: () => ({
    type: 'RESET_MB51'
  })
}