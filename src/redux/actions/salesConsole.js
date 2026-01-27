/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    uploadSalesConsole: (token, data, typeUpload) => ({
        type: 'UPLOAD_DATA_SALESCONSOLE',
        payload: http(token).post(`/sales-console/upload?type_upload=${typeUpload === undefined ? 'single' : typeUpload}`, data)
    }),
    updateSalesConsole: (token, type, data) => ({
        type: 'UPDATE_DATA_SALESCONSOLE',
        payload: http(token).post(`/sales-console/update?type=${type}`, data)
    }),
    getDetailSalesConsole: (token, id) => ({
        type: 'GET_DETAIL_SALESCONSOLE',
        payload: http(token).get(`/sales-console/detail/${id}`)
    }),
    deleteSalesConsole: (token, data) => ({
        type: 'DELETE_SALESCONSOLE',
        payload: http(token).patch(`/sales-console/delete`, data)
    }),
    getSalesConsole: (token, limit, search, page, date, type) => ({
        type: 'GET_SALESCONSOLE',
        payload: http(token).get(`/sales-console/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&date=${date}&type=${type}`)
    }),
    nextPageSalesConsole: (token, link) => ({
        type: 'NEXT_DATA_SALESCONSOLE',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_INVENTORY'
    })
}