import React, { Fragment, useState, useEffect, useContext } from 'react'
import SelectPlan from '../../components/pages/account/SelectPlan'


const Step3 = ({ state, callback }) => {
  return (
    <Fragment>
      <div className="container">
      <h1>Order Checkout:</h1>
      <table class="table">
  <thead>
    <tr>
      <th scope="col"> </th>
      <th scope="col">You Chose:</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Username</th>
      <td>{state.username}</td>
    </tr>
    <tr>
      <th scope="row">Email</th>
      <td>{state.email}</td>
    </tr>
    <tr>
      <th scope="row">Plan</th>
      <td>{state.plan.charAt(0).toUpperCase() + state.plan.slice(1)}, renewed montly</td>
    </tr>
  </tbody>
</table>
      </div>
    </Fragment>
  )
}      

export default Step3