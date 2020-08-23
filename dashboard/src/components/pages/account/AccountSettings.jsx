import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import { useCookies } from 'react-cookie'

const AccountSettings = ({state}) => {
    const globalState = useContext(GlobalContext)
   

    return (
      <Fragment>
        <section class="section">
          <div class="container">
          <form class="form-horizontal" >
        <fieldset>

        <legend>Form Name</legend>


        <div class="field">
        <label class="label" for="textinput-0">Origin Adresses</label>
        <div class="control">
            <input id="textinput-0" name="textinput-0" type="text" placeholder="YourCompany.com" class="input " required/>
            <p class="help">Enter all domains for the sites you want to track, separated by a comma. IE yourcompany.com. This is required to prevent others from tampering with your user data.</p>
        </div>
        </div>


        <div class="field">
        <label class="label" for="multipleradios-0">Type of data to track and compute recommendations on</label>
        <div class="control">
            <label class="radio" for="multipleradios-0-0">
            <input type="radio" name="multipleradios-0" id="multipleradios-0-0" value="User dwell time" checked="checked" required="required"/>
            User dwell time
            </label>
            <label class="radio" for="multipleradios-0-1">
            <input type="radio" name="multipleradios-0" id="multipleradios-0-1" value="User ratings" required="required"/>
            User ratings
            </label>
        </div>
        </div>

        <div class="field">
        <label class="label" for="singlebutton-0"></label>
        <div class="control">
            <button id="singlebutton-0" name="singlebutton-0" class="button is-primary">Save Recommendation Settings</button>
        </div>
        </div>

        </fieldset>
        </form>
          </div>
        </section>
      </Fragment>
    )
  }
  
  export default AccountSettings