import React, { Component } from 'react'
import AppBar from 'react-toolbox/lib/app_bar'
import { Layout, Panel } from 'react-toolbox/lib/layout'
import Autocomplete from 'react-toolbox/lib/autocomplete'
import Avatar from 'react-toolbox/lib/avatar'
import { Button, IconButton } from 'react-toolbox/lib/button'
import { Card, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import Chip from 'react-toolbox/lib/chip'
import Checkbox from 'react-toolbox/lib/checkbox'
import Dialog from 'react-toolbox/lib/dialog'
import Dropdown from 'react-toolbox/lib/dropdown'
import FontIcon from 'react-toolbox/lib/font_icon'
import Input from 'react-toolbox/lib/input'
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list'
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio'
import Slider from 'react-toolbox/lib/slider'
import Snackbar from 'react-toolbox/lib/snackbar'
import Switch from 'react-toolbox/lib/switch'
import { Tab, Tabs } from 'react-toolbox/lib/tabs'
import Tooltip from 'react-toolbox/lib/tooltip'

import successButtonStyle from './SuccessButton.css'

const source = {
  'ES-es': 'Spain',
  'TH-th': 'Thailand',
  'EN-gb': 'England',
  'EN-en': 'USA'
}

const countries = [
  { value: 'EN-gb', label: 'England' },
  { value: 'ES-es', label: 'Spain'},
  { value: 'TH-th', label: 'Thailand' },
  { value: 'EN-en', label: 'USA'}
]

const TooltipButton = Tooltip(Button)

export default class App extends Component {
  state = {
    countries: ['ES-es', 'TH-th'],
    active: false,
    country: 'EN-gb',
    slider: 0,
    snackbar: false,
    index: 0
  }

  handleChange = (countries) => {
    this.setState({ countries })
  }

  handleDropDownChange = (country) => {
    this.setState({ country })
  }

  handleToggle = () => {
    this.setState({ active: !this.state.active })
  }

  handleSnackbarToggle = (snackbar) => {
    this.setState({ snackbar })
  }

  handleSliderChange = slider => {
    this.setState({ slider })
  }

  handleTabChange = index => {
    this.setState({ index })
  }

  actions = [
    { label: 'Cancel', onClick: this.handleToggle },
    { label: 'Save', onClick: this.handleToggle}
  ]

  render () {
    console.log(this)
    return (
      <Layout>
        <Panel>
          <AppBar title='Sequelize UI' />
            <div style={{ padding: '2%' }}>
              <Tabs
                index={this.state.index}
                onChange={this.handleTabChange}
              >
                <Tab label='Demo'>>
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
                      <Button label='Action 1' />
                      <Button label='Action 2' />
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
                  <Dropdown
                    auto
                    onChange={this.handleDropdownChange}
                    source={countries}
                    value={this.state.country}
                  />
                  <h2>Font Icon</h2>
                  <FontIcon value='star' />
                  <h2>Input</h2>
                  <Input
                    type='text'
                    label='label'
                    hint='hint'
                    icon='folder'
                  />
                  <h2>List</h2>
                  <List selectable>
                    <ListSubHeader caption='List Sub Header Caption' />
                    <ListItem
                      caption='List Item Caption'
                      legent='List Item Legend'
                      rightIcon='folder'
                    />
                    <ListDivider />
                    <ListCheckbox
                      checked
                      caption='List Checkbox Caption'
                      legend='List Checkbox Legend'
                    />
                  </List>
                  <h2>Icon Menu</h2>
                  <IconMenu
                    icon='more_vert'
                  >
                    <MenuItem
                      value='download'
                      icon='get_app'
                      caption='Download'
                    />
                  </IconMenu>
                  <h2>Progress Bar</h2>
                  <ProgressBar
                    type='circular'
                    mode='indeterminate'
                  />
                  <ProgressBar
                    type='circular'
                    mode='determinate'
                    value={75}
                  />
                  <ProgressBar
                    type='linear'
                    mode='indeterminate'
                  />
                  <ProgressBar
                    type='linear'
                    mode='determinate'
                    value={75}
                  />
                  <h2>Radio Buttons</h2>
                  <RadioGroup name='Group Name'>
                    <RadioButton label='Button 1' />
                    <RadioButton label='Button 2' />
                  </RadioGroup>
                  <h2>Slider</h2>
                  <Slider
                    value={this.state.slider}
                    onChange={this.handleSliderChange}
                    min={-10}
                    max={10}
                    pinned
                    step={0.01}
                  />
                  <h2>Snackbar</h2>
                  <Button
                    label='Open Snackbar'
                    onClick={() => this.handleSnackbarToggle(true)}
                  />
                  <Snackbar
                    action='Action'
                    label='The label'
                    active={this.state.snackbar}
                    onClick={() => this.handleSnackbarToggle(false)}
                  />
                  <h2>Switch</h2>
                  <Switch
                    checked
                    label='Label'
                  />
                  <h2>Tooltip</h2>
                  <TooltipButton label='OK' tooltip='Click Me!' />
                </Tab>
                <Tab label='Custom'>
                  <ul>
                    <li>
                      <Button label='Primary' primary raised />
                    </li>
                    <li />
                    <li>
                      <Button label='Success' theme={successButtonStyle} />
                    </li>
                  </ul>
                </Tab>
              </Tabs>

            </div>
        </Panel>
      </Layout>
    )
  }
}
