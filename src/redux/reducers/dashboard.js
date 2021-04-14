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
    isSend: false
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
                    alertMsg: "Unable connect to server"
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
                    dataDepo: action.payload.data.results.rows
                };
            }
            case 'GET_DASHBOARD_PIC_REJECTED': {
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
                    alertMsg: action.payload.response.message,
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
                    isError: false,
                    isSend: true,
                    alertMsg: 'send email Succesfully'
                };
            }
            case 'SEND_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSend: false,
                    isError: true,
                    alertMsg: action.payload.response.message,
                };
            }
            case 'RESET': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isGetPic: false,
                    isApprove: false,
                    isReject: false
                }
            }
            default: {
                return state;
            }
        }
    }