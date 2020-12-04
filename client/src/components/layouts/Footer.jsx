import React, { Fragment, useState, useContext } from 'react'
import GlobalContext from '../../context/global/GlobalContext'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,

} from "react-router-dom"

const Footer = props => {
  const globalState = useContext(GlobalContext)
  const { isAuthenticated, loading } = globalState

  return (
    <Fragment>
      <footer class="footer">
  <div class="content has-text-centered">
    <p>
      <strong>SimpleRecommend</strong> can be contacted at <a href="https://jgthms.com">simplerecommend@gmail.com</a>.
    </p>
  </div>
</footer>
    </Fragment>
  )
}

export default Footer