import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import Cookies from 'js-cookie'
import { TagInput } from 'reactjs-tag-input'
import PasswordMask from 'react-password-mask';
import { useAlert } from 'react-alert'


const AccountSettings = ({state}) => {   
  const globalState = useContext(GlobalContext)
  const alert = useAlert()

  const [password, setPassword] = useState('')
  const [apiKey, setApiKey] = useState(null)


  const passwordSubmit = e => {
    fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account/get-api-key', {
        method: 'POST', mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get('token')
        }, body: JSON.stringify({
            "password": password
        })
    })
        .then(res => {
            if (res.status == 401 || res.status == 500) {
                throw new Error("Unauthorized")
            } else return res
        })
        .then(res => res.json())
        .then(res => {
            setApiKey(res.data)
        })
        .catch(e => {
            alert.show(e.message, {type: 'error'})
        })
  }


    return (
      <Fragment>
        <section class="section">
          <div class="container">

            <p className="title">API Key:</p>
            <p className="subtitle">Enter password again to access API-key:</p>
            <div class="field">
            <div className="control">
              <label class="label">Password</label>
              <input type="password" id="password1" className="input" onChange={e => {
                setPassword(e.target.value)
              }} name="password" placeholder="Password" required="required" />
            </div>
          </div>
          <button class="button is-danger" onClick={passwordSubmit} >Access API Token</button>

                <PasswordMask
                id="password"
                name="password"
                value={apiKey}
                readonly
                />
          </div>
        </section>
      </Fragment>
    )
  }
  
  export default AccountSettings