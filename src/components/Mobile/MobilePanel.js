import React from 'react'

import 'typeface-montserrat'
import 'typeface-raleway'
import 'typeface-roboto'

import MobileClosedCaption from './MobileClosedCaption'
import { DisplaySettings } from '../display-settings'

const classNames = require('classnames')

function MobilePanel() {
  const containerClass = classNames({})

  return (
    <div id="mobile-container" className={containerClass}>
      <div className="">
        <MobileClosedCaption />
        <DisplaySettings />
      </div>
    </div>
  )
}

export default MobilePanel
