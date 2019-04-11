import React from 'react'
import ReactDOM from 'react-dom'
import App from './react/App.jsx'
import './index.css'
import Prism from 'prismjs'
Prism.highlightAll()

ReactDOM.render(React.createElement(App), document.getElementById('react-app'))
