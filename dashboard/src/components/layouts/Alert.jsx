import React, { Fragment, useState, useContext } from 'react'

const Alert = ({ message, type, closeCallback }) => {

    return (
        <Fragment>
            <div class={"notification" + " is-" + type}>
                <button message={message} type={type} onClick={closeCallback} class="delete"></button>
                {message}
            </div>
        </Fragment>
    )
}

export default Alert