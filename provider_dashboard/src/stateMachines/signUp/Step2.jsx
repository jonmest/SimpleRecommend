import React, { Fragment, useState, useEffect, useContext } from 'react'
import SelectPlan from '../../components/pages/account/SelectPlan'


const Step2 = ({ state, callback, parentStateModifier }) => {
  return (
    <Fragment>
      <SelectPlan state={state} callback={callback} parentStateModifier={parentStateModifier}/>
    </Fragment>
  )
}      

export default Step2