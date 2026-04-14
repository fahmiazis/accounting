/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'

export default {
  getJurnal: (token, period, search) => ({
    type: 'GET_JURNAL',
    payload: http(token).get(`/jurnal-kasbank/report/get?period=${period || ''}&search=${search || ''}`)
  }),
  getDetailJurnal: (token, id) => ({
    type: 'GET_DETAIL_JURNAL',
    payload: http(token).get(`/jurnal-kasbank/report/detail/${id}`)
  }),
  generateJurnal: (token, data) => ({
    type: 'GENERATE_JURNAL',
    payload: http(token).post(`/jurnal-kasbank/report/generate`, data)
  }),
  deleteJurnal: (token, data) => ({
    type: 'DELETE_JURNAL',
    payload: http(token).patch(`/jurnal-kasbank/report/delete`, data)
  }),
  resetJurnal: () => ({
    type: 'RESET_JURNAL'
  })
}