/* eslint-disable import/no-anonymous-default-export */
const divisiState = {
    isAdd: false,
    isUpload: false,
    isUpdate: false,
    isGet: false,
    isGetPic: false,
    isDetail: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataActive: [],
    dataDash: [],
    detailAlasan: {},
    alertM: '',
    active: [],
    isReject: false,
    isApprove: false,
    isShow: false,
    dataShow: '',
    dataDepo: [],
    dataSa: [],
    dataKasir: [],
    isSend: null,
    page: {},
    pages: {},
    isReport: false,
    dataReport: '',
    isDownload: false,
    dataDownload: '',
    dataSaActive: [],
    dataKasirActive: [],
    dataDepoActive: [],
    isEdit: false,
    isGetNotif: false,
    notifSa: [],
    notifKasir: [],
    notif: [],
    sendArea: null
};

export default (state=divisiState, action) => {
        switch(action.type){
            case 'GET_DASHBOARD_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DASHBOARD_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    isError: false,
                    dataDash: action.payload.data.results.rows
                };
            }
            case 'GET_DASHBOARD_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server",
                    alertM: action.payload.response.data.message
                };
            }
            case 'GET_DASHBOARD_PIC_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DASHBOARD_PIC_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetPic: true,
                    isError: false,
                    dataSa: action.payload.data.sa,
                    dataKasir: action.payload.data.kasir,
                    dataDepo: action.payload.data.results.rows,
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_DASHBOARD_PIC_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetPic: false,
                    isError: true,
                    alertMsg: "Unable connect to server",
                    alertM: action.payload.response
                };
            }
            case 'GET_NOTIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_NOTIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetNotif: true,
                    isError: false,
                    notifSa: action.payload.data.sa,
                    notifKasir: action.payload.data.kasir,
                };
            }
            case 'GET_NOTIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetNotif: false,
                    isError: true,
                    alertMsg: "Unable connect to server",
                };
            }
            case 'GET_NOTIF_AREA_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_NOTIF_AREA_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetNotif: true,
                    isError: false,
                    notif: action.payload.data.result,
                };
            }
            case 'GET_NOTIF_AREA_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetNotif: false,
                    isError: true,
                    alertMsg: "Unable connect to server",
                };
            }
            case 'NEXT_DATA_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetPic: true,
                    isError: false,
                    dataSa: action.payload.data.sa,
                    dataKasir: action.payload.data.kasir,
                    dataDepo: action.payload.data.results.rows,
                    page: action.payload.data.pageInfo,
                    pages: action.payload.data.pageInfo,
                    dataSaActive: action.payload.data.sa,
                    dataKasirActive: action.payload.data.kasir,
                    dataDepoActive: action.payload.data.results.rows,
                };
            }
            case 'NEXT_DATA_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetPic: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_ACTIVITY_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ACTIVITY_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataActive: action.payload.data.result.rows[0].doc,
                    active: action.payload.data.result.rows,
                    alertMsg: 'get activity Succesfully'
                };
            }
            case 'GET_ACTIVITY_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_ALL_ACTIVITY_PENDING': {
                return {
                    ...state,
                    isGetPic: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALL_ACTIVITY_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGetPic: true,
                    dataSaActive: action.payload.data.sa,
                    dataKasirActive: action.payload.data.kasir,
                    dataDepoActive: action.payload.data.results.rows,
                    pages: action.payload.data.pageInfo,
                    alertMsg: 'get activity Succesfully'
                };
            }
            case 'GET_ALL_ACTIVITY_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetPic: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_UPLOAD_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ....'
                };
            }
            case 'UPDATE_UPLOAD_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    isError: false,
                    alertMsg: 'update dokumen Succesfully'
                };
            }
            case 'UPDATE_UPLOAD_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'APPROVE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ....'
                };
            }
            case 'APPROVE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: true,
                    isError: false,
                    alertMsg: 'approve dokumen Succesfully'
                };
            }
            case 'APPROVE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'REJECT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ....'
                };
            }
            case 'REJECT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: true,
                    isError: false,
                    alertMsg: 'reject dokumen Succesfully'
                };
            }
            case 'REJECT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'EDIT_ACCESS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ....'
                };
            }
            case 'EDIT_ACCESS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isEdit: true,
                    isError: false,
                    alertMsg: 'edit acess Succesfully'
                };
            }
            case 'EDIT_ACCESS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isEdit: false,
                    isError: true,
                    alertMsg: 'edit access failed',
                };
            }
            case 'UPLOAD_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload dokumen Succesfully'
                };
            }
            case 'UPLOAD_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                };
            }
            case 'SHOW_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'SHOW_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isShow: true,
                    dataShow: action.payload.config.url,
                    alertMsg: 'show dokumen Succesfully'
                };
            }
            case 'SHOW_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isShow: false,
                    isError: true,
                    alertMsg: action.payload.response,
                };
            }
            case 'REPORT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'REPORT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isReport: true,
                    dataReport: action.payload.data.link,
                    alertMsg: 'report dokumen Succesfully'
                };
            }
            case 'REPORT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isReport: false,
                    isError: true,
                    alertMsg: action.payload.response,
                };
            }
            case 'SEND_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'SEND_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSend: true,
                    alertMsg: 'send email Succesfully'
                };
            }
            case 'SEND_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSend: false,
                    alertMsg: action.payload.response.message,
                };
            }
            case 'SEND_AREA_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'SEND_AREA_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    sendArea: true,
                    alertMsg: 'send email Succesfully'
                };
            }
            case 'SEND_AREA_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    sendArea: false,
                    alertMsg: action.payload.response.message,
                };
            }
            case 'DOWNLOAD_REPORT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'DOWNLOAD_REPORT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDownload: true,
                    dataDownload: action.payload.data,
                    alertMsg: 'report dokumen Succesfully'
                };
            }
            case 'DOWNLOAD_REPORT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDownload: false,
                    isError: true,
                    alertMsg: action.payload.response,
                };
            }
            case 'RESET': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isGetPic: false,
                    isApprove: false,
                    isReject: false,
                    alertM: '',
                    isReport: false,
                    isUpdate: false,
                    isEdit: false,
                    sendArea: null,
                    isSend: null
                }
            }
            case 'RESET_REPORT': {
                return {
                    ...state,
                    isReport: false,
                    isDownload: false
                }
            }
            default: {
                return state;
            }
        }
    }