import { createElement } from 'react'
import { render } from 'react-dom'
import App from './react/App.jsx'
import './index.css'

render(createElement(App), document.getElementById('app'))
