/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'

export default {
  getPnl: (token, period, search) => ({
    type: 'GET_PNL',
    payload: http(token).get(`/pnl/report/get?period=${period || ''}&search=${search || ''}`)
  }),
  getDetailPnl: (token, id) => ({
    type: 'GET_DETAIL_PNL',
    payload: http(token).get(`/pnl/report/detail/${id}`)
  }),
  generatePnl: (token, data) => ({
    type: 'GENERATE_PNL',
    payload: http(token).post(`/pnl/report/generate`, data)
  }),
  deletePnl: (token, data) => ({
    type: 'DELETE_PNL',
    payload: http(token).patch(`/pnl/report/delete`, data)
  }),
  resetPnl: () => ({
    type: 'RESET_PNL'
  })
}