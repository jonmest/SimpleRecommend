import React, { Fragment, useState, useContext } from 'react'
import GlobalContext from '../../context/global/GlobalContext'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,

} from "react-router-dom"

const Navbar = props => {
  const globalState = useContext(GlobalContext)
  const { isAuthenticated, loading } = globalState

  return (
    <Fragment>
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <p className="title">SimpleRecommend            <span className="is-size-7 has-text-weight-light">Alpha</span>
</p>
          </a>

          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item">
            <Link to="/">
              Home
              </Link>
            </a>
            

            <a class="navbar-item" href="https://simplerecommend.readthedocs.io">
              Documentation
            </a>

            
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              {
                isAuthenticated ?
                  <p>You're logged in.</p> :
                  <Fragment>
                    <div class="buttons">
                    <Link to="/register"><a class="button is-primary">
                        <strong>Sign up</strong>
                      </a>
                      </Link>
                      <Link to="/login">
                        <a class="button is-light">
                        Log in
              </a></Link>
                    </div>
                  </Fragment>
              }
            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  )
}

export default Navbar