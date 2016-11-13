import React from 'react'
import {render} from 'react-dom'
import App from './app'


render(
    <div>
        <App loginShouldRender={true} pageShouldRender={false}></App>
        
    </div>,
    document.getElementById('root')
)
