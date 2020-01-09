import { Popover, Tooltip } from '@blueprintjs/core'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import React from 'react'
import { useShallowEqualSelector } from '@/redux/redux-helpers'
import { LanguageButton } from '@/components/language-button'
import { isVideoOverlay } from '@/helpers/video-helpers'
import VisibilityToggle from '@/components/VideoOverlay/VisibilityToggle'
import { SettingsMenu } from './setting-items'


function isPositionLeft(configSettings) {
  return isVideoOverlay() && configSettings.switchSettingsPosition
}

const Controls = () => {
  const arePlayerControlsVisible = useShallowEqualSelector(
    (state) => state.videoPlayerContext.arePlayerControlsVisible,
  )

  const switchSettingsPosition = useShallowEqualSelector(
    (state) => state.configSettings.switchSettingsPosition,
  )

  if (isVideoOverlay() && !arePlayerControlsVisible) {
    return null
  }

  const controlClass = classnames({
    'controls-container': isVideoOverlay(),
    'position-right': !isPositionLeft(switchSettingsPosition),
    'position-left': isPositionLeft(switchSettingsPosition),
    'mobile-controls-button': !isVideoOverlay(),
    'bg-black-transparent': true,
  })

  return (
    <span data-testid="display-settings" className={controlClass}>
      <LanguageButton />
      <VisibilityToggle />
      <Popover position="left-bottom" content={<SettingsMenu />} captureDismiss >
        <Tooltip content={'Settings'}>
          <FontAwesomeIcon size="2x" icon={faCog} />
        </Tooltip>
      </Popover>
    </span>
  )
}

Controls.propTypes = {
}


export default Controls
