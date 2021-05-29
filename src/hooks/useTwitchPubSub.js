import { useEffect } from 'react'
import { pipe } from 'ramda'

export const useTwitchPubSub = (onBroadcast) => {
  const itsTwitch = window.Twitch?.ext
  useEffect(() => {
    if (itsTwitch) {
      itsTwitch.listen('broadcast', (_target, _contentType, message) => {
        try {
          pipe(JSON.parse, onBroadcast)(message)
        } catch (error) {}
      })
    }
  }, [onBroadcast, itsTwitch])

  return
}
