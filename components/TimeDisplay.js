import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { activeGroupSelector } from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state)
  }
}

const TimeDisplay = ({
  // Props passed from a parent component.
  max,
  time,
  side,
  // Props passed from redux.
  font,
  activeGroup
}) => {
  //function to convert a time in milliseconds to a
  //nicely formatted string (for the scrubber)
  function msToTime (duration) {
    if (duration > 0 && duration <= max) {
      if (duration >= 3600000) {
        var seconds = Math.floor((duration / 1000) % 60)
        var minutes = Math.floor((duration / (1000 * 60)) % 60)
        var hours = Math.floor((duration / (1000 * 60 * 60)) % 60)

        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds

        return hours + ':' + minutes + ':' + seconds
      } else {
        var seconds = Math.floor((duration / 1000) % 60)
        var minutes = Math.floor((duration / (1000 * 60)) % 60)

        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds

        return minutes + ':' + seconds
      }
    } else if (duration > max) {
      return msToTime(max)
    } else {
      return '00:00'
    }
  }

  return (
    <View style={{ paddingHorizontal: 2 }}>
      <Text
        style={StandardTypography(
          { font: 'Roboto' },
          'd',
          'Regular',
          'center',
          side === 'left' ? colors.tuna : colors.chateau
        )}
      >
        {msToTime(time)}
      </Text>
    </View>
  )
}

export default connect(mapStateToProps)(TimeDisplay)
