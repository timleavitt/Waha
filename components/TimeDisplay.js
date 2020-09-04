//basic imports
import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors } from '../constants'
function TimeDisplay (props) {
  //function to convert a time in milliseconds to a
  //nicely formatted string (for the scrubber)
  function msToTime (duration) {
    if (duration > 0 && duration <= props.max) {
      var seconds = Math.floor((duration / 1000) % 60)
      var minutes = Math.floor((duration / (1000 * 60)) % 60)

      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds

      return minutes + ':' + seconds
    } else if (duration > props.max) {
      return msToTime(props.max)
    } else {
      return '00:00'
    }
  }

  return (
    <View styles={props.style}>
      <Text style={Typography(props, 'd', 'regular', 'center', colors.shark)}>
        {msToTime(props.time)}
      </Text>
    </View>
  )
}

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(TimeDisplay)
