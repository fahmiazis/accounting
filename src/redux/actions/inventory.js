/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addInventory: (token, data) => ({
        type: 'ADD_INVENTORY',
        payload: http(token).post(`/inventory/add`, qs.stringify(data))
    }),
    updateInventory: (token, id, data) => ({
        type: 'UPDATE_INVENTORY',
        payload: http(token).patch(`/inventory/update/${id}`, qs.stringify(data)),
    }),
    getInventory: (token, limit, search, page) => ({
        type: 'GET_INVENTORY',
        payload: http(token).get(`/inventory/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER_INVENTORY',
        payload: http(token).post(`/inventory/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_INVENTORY',
        payload: http(token).get(`/inventory/export`)
    }),
    getDetailInventory: (token, id) => ({
        type: 'GET_DETAIL_INVENTORY',
        payload: http(token).get(`/inventory/detail/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_INVENTORY',
        payload: http(token).get(`${link}`)
    }),
    deleteInventory: (token, data) => ({
        type: 'DELETE_INVENTORY',
        payload: http(token).patch(`/inventory/delete`, data)
    }),

    // Report Inventory
    uploadRepinv: (token, data, typeUpload) => ({
        type: 'UPLOAD_DATA_REPINV',
        payload: http(token).post(`/inventory/report/upload?type_upload=${typeUpload === undefined ? 'single' : typeUpload}`, data)
    }),
    updateRepinv: (token, type, data) => ({
        type: 'UPDATE_DATA_REPINV',
        payload: http(token).post(`/inventory/report/update?type=${type}`, data)
    }),
    getDetailRepinv: (token, id) => ({
        type: 'GET_DETAIL_REPINV',
        payload: http(token).get(`/inventory/report/detail/${id}`)
    }),
    deleteRepinv: (token, data) => ({
        type: 'DELETE_REPINV',
        payload: http(token).patch(`/inventory/report/delete`, data)
    }),
    getRepinv: (token, limit, search, page, date, type) => ({
        type: 'GET_REPINV',
        payload: http(token).get(`/inventory/report/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&date=${date}&type=${type}`)
    }),
    generateRepinv: (token, data) => ({
        type: 'GENERATE_REPINV',
        payload: http(token).patch(`/inventory/report/generate`, data)
    }),
    mergeRepinv: (token, data) => ({
        type: 'MERGE_REPINV',
        payload: http(token).patch(`/inventory/report/merge`, data)
    }),
    nextPageRepinv: (token, link) => ({
        type: 'NEXT_DATA_REPINV',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_INVENTORY'
    })
}