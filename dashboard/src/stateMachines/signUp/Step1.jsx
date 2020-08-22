import React, { Fragment, useState, useEffect, useContext } from 'react'
import Register from '../../components/pages/account/Register'
import GlobalContext from '../context/global/GlobalContext'

const Step1 = ({ state, callback, parentStateModifier }) => {
  return (
    <Fragment>
      <Register state={GlobalContext} parentStateModifier={parentStateModifier} callback={callback}/>
    </Fragment>
  )
}      

export default Step1