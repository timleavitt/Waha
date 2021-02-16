//basic imports
import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function TimeDisplay ({
  // Props passed from a parent component.
  max,
  time,
  style,
  // Props passed from redux.
  font,
  activeGroup
}) {
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
    <View styles={style}>
      <Text
        style={StandardTypography(
          { font: 'Roboto' },
          'd',
          'Regular',
          'center',
          colors.shark
        )}
      >
        {msToTime(time)}
      </Text>
    </View>
  )
}

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(TimeDisplay)
