import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { Tooltip, Popover } from '@blueprintjs/core'
import LanguageOptions from './LanguageOptions'
import { useShallowEqualSelector, useReduxCallbackDispatch } from '../../redux/redux-helpers'
import { toggleActivationDrawer } from '@/redux/settingsSlice'

export default function LanguageButton() {
  const isBitsEnabled = useShallowEqualSelector((state) => state.configSettings.isBitsEnabled)
  const hasTranslations = useShallowEqualSelector(
    (state) => Object.keys(state.captionsState.translations || {}).length > 0,
  )
  const toggleDrawer = useReduxCallbackDispatch(toggleActivationDrawer())

  if (!isBitsEnabled && !hasTranslations) {
    return null
  }

  let button = null
  if (hasTranslations) {
    button = (
      <Popover position="left-bottom" content={<LanguageOptions />}>
        <FontAwesomeIcon size="2x" icon={faLanguage} />
      </Popover>
    )
  } else {
    button = <FontAwesomeIcon size="2x" icon={faLanguage} onClick={toggleDrawer } />
  }

  // Display activate dialog/text
  return (
    <>
      <Tooltip content={'Translations'}>{button}</Tooltip>
    </>
  )
}
