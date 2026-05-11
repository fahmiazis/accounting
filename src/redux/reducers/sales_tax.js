/* eslint-disable import/no-anonymous-default-export */
const initState = {
  isLoading:        false,
  isError:          false,
  isUpload:         false,
  isUpdate:         false,
  isDelete:         false,
  isGet:            false,
  isMerge:          null,
  alertMsg:         '',
  dataSalesTax:     [],
  detailSalesTax:   {},
  page:             {},
}

export default (state = initState, action) => {
  switch (action.type) {
    // ── GET ──────────────────────────────────────────────────────────────
    case 'GET_SALES_TAX_PENDING':
      return { ...state, isLoading: true, isGet: false }
    case 'GET_SALES_TAX_FULFILLED':
      return { ...state, isLoading: false, isGet: true, isError: false, dataSalesTax: action.payload.data.result.rows, page: action.payload.data.pageInfo }
    case 'GET_SALES_TAX_REJECTED':
      return { ...state, isLoading: false, isError: true, alertMsg: 'Unable connect to server' }

    case 'NEXT_SALES_TAX_PENDING':
      return { ...state, isLoading: true, isGet: false }
    case 'NEXT_SALES_TAX_FULFILLED':
      return { ...state, isLoading: false, isGet: true, dataSalesTax: action.payload.data.result.rows, page: action.payload.data.pageInfo }
    case 'NEXT_SALES_TAX_REJECTED':
      return { ...state, isLoading: false, isError: true }

    // ── GET DETAIL ───────────────────────────────────────────────────────
    case 'GET_DETAIL_SALES_TAX_PENDING':
      return { ...state, isLoading: true }
    case 'GET_DETAIL_SALES_TAX_FULFILLED':
      return { ...state, isLoading: false, detailSalesTax: action.payload.data.result }
    case 'GET_DETAIL_SALES_TAX_REJECTED':
      return { ...state, isLoading: false, isError: true }

    // ── UPLOAD ───────────────────────────────────────────────────────────
    case 'UPLOAD_SALES_TAX_PENDING':
      return { ...state, isLoading: true, isUpload: false }
    case 'UPLOAD_SALES_TAX_FULFILLED':
      return { ...state, isLoading: false, isUpload: true, isError: false }
    case 'UPLOAD_SALES_TAX_REJECTED':
      return { ...state, isLoading: false, isUpload: false, isError: true, alertMsg: action.payload?.response?.data?.message || 'Upload gagal' }

    // ── UPDATE ───────────────────────────────────────────────────────────
    case 'UPDATE_SALES_TAX_PENDING':
      return { ...state, isLoading: true, isUpdate: false }
    case 'UPDATE_SALES_TAX_FULFILLED':
      return { ...state, isLoading: false, isUpdate: true }
    case 'UPDATE_SALES_TAX_REJECTED':
      return { ...state, isLoading: false, isUpdate: false, isError: true }

    // ── DELETE ───────────────────────────────────────────────────────────
    case 'DELETE_SALES_TAX_PENDING':
      return { ...state, isLoading: true }
    case 'DELETE_SALES_TAX_FULFILLED':
      return { ...state, isLoading: false, isDelete: true }
    case 'DELETE_SALES_TAX_REJECTED':
      return { ...state, isLoading: false, isError: true }

    // ── RESET ────────────────────────────────────────────────────────────
    case 'RESET_SALES_TAX':
      return { ...state, isError: false, isUpload: false, isUpdate: false, isDelete: false, isMerge: null }

    default:
      return state
  }
}