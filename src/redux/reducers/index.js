import {combineReducers} from 'redux'

import auth from './auth'
import email from './email'
import divisi from './divisi'
import alasan from './alasan'
import depo from './depo'
import dokumen from './dokumen'
import user from './user'
import pic from './pic'
import dashboard from './dashboard'
import date from './date'
import merge from './merge'
import movement from './movement'
import inventory from './inventory'

export default combineReducers({
  auth,
  email,
  divisi,
  alasan,
  depo,
  dokumen,
  user,
  pic,
  dashboard,
  date,
  merge,
  movement,
  inventory,
})