import React, { Fragment, useState, useContext } from 'react'

const Alert = ({ message, type, closeCallback, id }) => {

    return (
        <Fragment>
            <div id={id} class={"notification" + " is-" + type}>
                <button message={message} type={type} onClick={closeCallback} class="delete"></button>
                {message}
            </div>
        </Fragment>
    )
}

export default Alert