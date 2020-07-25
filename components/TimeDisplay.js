//basic imports
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
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
      <Text style={[styles.timeText, { fontFamily: props.font + '-regular' }]}>
        {msToTime(props.time)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  timeText: {
    color: colors.shark,
    fontSize: 12 * scaleMultiplier
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(TimeDisplay)
