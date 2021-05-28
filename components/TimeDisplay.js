import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { activeGroupSelector } from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    font: getLanguageFont(activeGroupSelector(state).language),
    isTablet: state.deviceInfo.isTablet
  }
}

/**
 * A simple component to display a specific time in a nice format. Used for the current time and total time of a piece of media on the Play Screen and displayed in the <Scrubber /> component.
 * @param {number} max - The maximum number that this time can go up to.
 * @param {number} time - The time to display in milliseconds.
 * @param {string} side - The side that this time display goes on. Either 'right' or 'left'.
 */
const TimeDisplay = ({
  // Props passed from a parent component.
  max,
  time,
  side,
  // Props passed from redux.
  font,
  isTablet
}) => {
  /**
   * Converts a time in milliseconds to a nicely formatted time in the format HH:MM:SS.
   * @param {number} time - The time in milliseconds to convert.
   * @return {string} - The nicely formatted time.
   */
  const convertTime = time => {
    if (time > 0 && time <= max) {
      // If the time is greater than an hour, we need to show the hour of the time as well.
      if (time >= 3600000) {
        var seconds = Math.floor((time / 1000) % 60)
        var minutes = Math.floor((time / (1000 * 60)) % 60)
        var hours = Math.floor((time / (1000 * 60 * 60)) % 60)

        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds

        return hours + ':' + minutes + ':' + seconds
      } else {
        var seconds = Math.floor((time / 1000) % 60)
        var minutes = Math.floor((time / (1000 * 60)) % 60)

        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds

        return minutes + ':' + seconds
      }
    } // If the time is greater than the max allowed, just show the max.
    else if (time > max) {
      return convertTime(max)
    } else {
      return '00:00'
    }
  }

  return (
    <View>
      <Text
        style={StandardTypography(
          { font: 'Roboto' },
          'd',
          'Regular',
          'center',
          side === 'left' ? colors.shark : colors.chateau
        )}
      >
        {convertTime(time)}
      </Text>
    </View>
  )
}

export default connect(mapStateToProps)(TimeDisplay)
