/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'

export default {
  uploadSalesTax: (token, data, typeUpload) => ({
    type: 'UPLOAD_SALES_TAX',
    payload: http(token).post(`/sales-tax/report/upload?type_upload=${typeUpload || 'single'}`, data)
  }),
  updateSalesTax: (token, type, data) => ({
    type: 'UPDATE_SALES_TAX',
    payload: http(token).post(`/sales-tax/report/update?type=${type}`, data)
  }),
  getDetailSalesTax: (token, id) => ({
    type: 'GET_DETAIL_SALES_TAX',
    payload: http(token).get(`/sales-tax/report/detail/${id}`)
  }),
  deleteSalesTax: (token, data) => ({
    type: 'DELETE_SALES_TAX',
    payload: http(token).patch(`/sales-tax/report/delete`, data)
  }),
  getSalesTax: (token, limit, search, page, date, type) => ({
    type: 'GET_SALES_TAX',
    payload: http(token).get(
      `/sales-tax/report/get?limit=${limit}&search=${search}&page=${page || 1}&date=${date}&type=${type}`
    )
  }),
  nextPageSalesTax: (token, link) => ({
    type: 'NEXT_SALES_TAX',
    payload: http(token).get(link)
  }),
  resetSalesTax: () => ({
    type: 'RESET_SALES_TAX'
  })
}