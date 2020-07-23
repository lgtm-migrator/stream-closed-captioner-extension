import React from 'react'
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import FontFamilyOptions from '../FontFamilyOptions'

afterEach(cleanup)

describe('FontFamilyOptions', () => {
  it('renders', async () => {
    const { queryByText } = renderWithRedux(<FontFamilyOptions />)

    expect(queryByText('Use Dyslexia Font')).toBeInTheDocument()
  })

  it('clicking on dyslexia enables it', async () => {
    const { getByText, store } = renderWithRedux(<FontFamilyOptions />)

    const { configSettings: defaultSetting } = store.getState()
    expect(defaultSetting.dyslexiaFontEnabled).toEqual(false)

    fireEvent.click(getByText('Use Dyslexia Font'))

    const { configSettings: newConfigs } = store.getState()
    expect(newConfigs.dyslexiaFontEnabled).toEqual(true)
  })
})
