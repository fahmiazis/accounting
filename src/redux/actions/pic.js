/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addPic: (token, data) => ({
        type: 'ADD_PIC',
        payload: http(token).post(`/pic/add`, qs.stringify(data))
    }),
    updatePic: (token, id, data) => ({
        type: 'UPDATE_PIC',
        payload: http(token).patch(`/pic/update/${id}`, qs.stringify(data)),
    }),
    getPic: (token, limit, search) => ({
        type: 'GET_PIC',
        payload: http(token).get(`/pic/get?limit=${limit}&search=${search}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/pic/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_PIC',
        payload: http(token).get(`/pic/export`)
    }),
    getDetailPic: (token, id) => ({
        type: 'GET_DETAIL_PIC',
        payload: http(token).get(`/pic/detail/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_PIC',
        payload: http(token).get(`${link}`)
    }),
    deletePic: (token, id) => ({
        type: 'DELETE_PIC',
        payload: http(token).delete(`/pic/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}