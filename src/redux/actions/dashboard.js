/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    updateUploadDokumen: (token, id, data) => ({
        type: 'UPDATE_UPLOAD_DOKUMEN',
        payload: http(token).patch(`/dashboard/upload/edit/${id}`, qs.stringify(data)),
    }),
    getDashboard: (token) => ({
        type: 'GET_DASHBOARD',
        payload: http(token).get(`/dashboard/get`)
    }),
    getDashboardPic: (token) => ({
        type: 'GET_DASHBOARD_PIC',
        payload: http(token).get(`/dashboard/get`)
    }),
    getActivity: (token) => ({
        type: 'GET_ACTIVITY',
        payload: http(token).get(`/dashboard/activity`)
    }),
    uploadDokumen: (token, id, time, data) => ({
        type: 'UPLOAD_DOKUMEN',
        payload: http(token).post(`/dashboard/upload/${id}/${time}`, data)
    }),
    approve: (token, id, idAct) => ({
        type: 'APPROVE',
        payload: http(token).patch(`/dashboard/approve/${id}/${idAct}`)
    }),
    reject: (token, id, idAct, data) => ({
        type: 'REJECT',
        payload: http(token).patch(`/dashboard/reject/${id}/${idAct}`, qs.stringify(data))
    }),
    showDokumen: (token, id) => ({
        type: 'SHOW',
        payload: http(token).get(`/show/get/${id}`)
    }),
    sendEmail: (token, id) => ({
        type: 'SEND',
        payload: http(token).post(`/dashboard/send/${id}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}