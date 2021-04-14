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
    getPic: (token) => ({
        type: 'GET_PIC',
        payload: http(token).get(`/pic/get`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/pic/master`, data)
    }),
    getDetailPic: (token, id) => ({
        type: 'GET_DETAIL_PIC',
        payload: http(token).get(`/pic/detail/${id}`)
    }),
    deletePic: (token, id) => ({
        type: 'DELETE_PIC',
        payload: http(token).delete(`/pic/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}