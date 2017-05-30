import React, { Component } from 'react'
import styles from '../../assets/style.css'
import AppBar from 'react-toolbox/lib/app_bar'
import { Layout, Panel } from 'react-toolbox'
import Autocomplete from 'react-toolbox/lib/autocomplete'
import Avatar from 'react-toolbox/lib/avatar'
import { Button, IconButton } from 'react-toolbox/lib/button'
import { Card, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import Chip from 'react-toolbox/lib/chip'
import Checkbox from 'react-toolbox/lib/checkbox'
import Dialog from 'react-toolbox/lib/dialog'

const source = {
  'ES-es': 'Spain',
  'TH-th': 'Thailand',
  'EN-gb': 'England',
  'EN-en': 'USA'
}

export default class App extends Component {
  state = {
    countries: ['ES-es', 'TH-th'],
    active: false
  }

  handleChange = (value) => {
    this.setState({ countries: value });
  }

  handleToggle = () => {
    this.setState({ active: !this.state.active })
  }

  actions = [
    { label: 'Cancel', onClick: this.handleToggle },
    { label: 'Save', onClick: this.handleToggle}
  ]

  render () {
    return (
      <Layout>
        <Panel>
          <AppBar title='Sequelize UI' />
            <div style={{ padding: '2%' }}>
              <h2>Autocomplete</h2>
              <Autocomplete
                direction='down'
                selectedPosition='above'
                label='Choose countries'
                onChange={this.handleChange}
                source={source}
                value={this.state.countries}
              />
              <h2>Avatar</h2>
              <Avatar
                title='folder'
                icon='folder'
              />
              <h2>Button</h2>
              <Button icon='bookmark' label='Bookmark' />
              <IconButton icon='bookmark' /> 
              <h2>Card</h2>
              <Card>
                <CardTitle
                  title='Card'
                  subtitle='Subtitle'
                />
                <CardText>
                  The card text
                </CardText>
                <CardActions>
                  <Button label='Action 1'/>
                  <Button label='Action 2'/>
                </CardActions>
              </Card>
              <h2>Chip</h2>
              <Chip>Example chip</Chip>
              <Chip deletable>Deletable Chip</Chip>
              <h2>Checkbox</h2>
              <Checkbox
                label='Checked option'
              />
              <h2>Dialog</h2>
              <Button
                 label='Open Dialog'
                 onClick={this.handleToggle}
               />
              <Dialog
                actions={this.actions}
                active={this.state.active}
                onEscKeyDown={this.handleToggle}
                onOverlayClick={this.handleToggle}
                title='The Dialog'
              />
              <h2>Dropdown</h2>
              <h2>Font Icon</h2>
              <h2>Input</h2>
              <h2>Link</h2>
              <h2>List</h2>
              <h2>Menu</h2>
              <h2>Navigation</h2>
              <h2>Progress Bar</h2>
              <h2>Radio Buttons</h2>
              <h2>Slider</h2>
              <h2>Snackbar</h2>
              <h2>Switch</h2>
              <h2>Tabs</h2>
              <h2>Tooltip</h2>
            </div>
        </Panel>
      </Layout>
    )
  }
}
