import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../context/global/GlobalContext'

const Navbar = props => {
  const globalState = useContext(GlobalContext)
  const { isAuthenticated, loading } = globalState

  useEffect(() => {
  }, [isAuthenticated])
  
  return (
      <Fragment>
          <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      <p className="title">SimpleRecommend</p>
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
        Home
      </a>

      <a class="navbar-item">
        Documentation
      </a>

      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          More
        </a>

        <div class="navbar-dropdown">
          <a class="navbar-item">
            About
          </a>
          <a class="navbar-item">
            Jobs
          </a>
          <a class="navbar-item">
            Contact
          </a>
          <hr class="navbar-divider"/>
          <a class="navbar-item">
            Report an issue
          </a>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        {
          isAuthenticated ?
          <p>You're logged in.</p> :
          <Fragment>
            <div class="buttons">
              <a class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light">
                Log in
              </a>
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