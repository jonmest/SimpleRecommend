import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import Cookies from 'js-cookie'
import { TagInput } from 'reactjs-tag-input'
import { useAlert } from 'react-alert'

const RecommendSettings = ({state}) => {   
  const globalState = useContext(GlobalContext)
  const { hostnames, max_rating, min_rating } = globalState.client
  const [tagState, setTagState] = useState([])
  const [isTagSet, setIsTagSet] = useState(false)
  const alert = useAlert()

  useEffect(() => {
    const tags = hostnames.map((item, index) => {
      return {
        id: index,
        displayValue: item
      }
    })
    setTagState(tags)
    setIsTagSet(true)
  }, [])

  const handleChange = e => {
    const client = globalState.client
    if (e.target.type === "number") {
      client[e.target.name] = parseFloat(e.target.value)
    } else {
      client[e.target.name] = e.target.value
    }
    globalState.setClient(client)
  }

  const onTagsChanged = tags => {
    setTagState({tags})
    globalState.setClient({
      ...globalState.client,
      hostnames: tags.map(item => item.displayValue)
    })
}

  const handleSubmit = e => {
    e.preventDefault()
    fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account', {
      method: 'PATCH', mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('token')
      },
      body: JSON.stringify({
        max_rating, min_rating, hostnames
      })})
      .then(res => res.json())
      .then(data => {
        alert.show('Settings saved!', {type: 'success'})
      })
      .catch(error => {
        alert.show('Something went wrong.', {type: 'error'})
      })
  }
    return (
      <Fragment>
        <section class="section">
          <div class="container">
          <form class="form-horizontal" onSubmit={handleSubmit} >

        <fieldset>

        <legend>Settings for recommendation generation</legend>


        <section class="section">
          <div class="container">
            <p class="title">Whitelisted Hostnames & IPs</p>
          <p class="help">Enter the hostnames and IPs for the site you want to track. IE yourcompany.com or an IP address. This is required to prevent others from tampering with your user data. Only whitelisted hostnames are authorized to use the SimpleRecommend API.</p>
<br/><br/>
          <div class="field">

        <div class="control">

        {
                  isTagSet && <TagInput tags={tagState} onTagsChanged={onTagsChanged} />
        }
        </div>
        </div>
            </div>      
        </section>



        <div class="field">
        <label class="label" for="textinput-0">Minimum rating</label>
        <div class="control">
            <input onChange={handleChange} id="textinput-0" name="min_rating" value={min_rating} type="number" placeholder="1" class="input " required/>
        </div>

        <label class="label" for="textinput-0">Maximum rating</label>
        <div class="control">
            <input onChange={handleChange} id="textinput-0" name="max_rating" type="number" value={max_rating} placeholder="5" class="input " required/>
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
  
  export default RecommendSettings