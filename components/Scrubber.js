//basic imports
import React from 'react'
import { View, StyleSheet, Slider } from 'react-native'
import TimeDisplay from '../components/TimeDisplay'

function Scrubber (props) {
  //// RENDER

  return (
    <View style={styles.scrubberContainer}>
      <View style={styles.scrubber}>
        <Slider
          value={props.value}
          onSlidingComplete={props.onSlidingComplete}
          onValueChange={props.onValueChange}
          minimumValue={0}
          maximumValue={props.maximumValue}
          step={1000}
          minimumTrackTintColor={'#3A3C3F'}
          thumbTintColor={'#3A3C3F'}
        />
      </View>
      <View style={styles.timeInfo}>
        <TimeDisplay
          style={styles.scrubberInfo}
          time={props.seekPosition}
          max={props.maximumValue}
        />
        <TimeDisplay
          style={styles.scrubberInfo}
          time={props.maximumValue}
          max={props.maximumValue}
        />
      </View>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  scrubberContainer: {
    paddingHorizontal: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  },
  scrubber: {
    width: '100%'
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  }
})

export default Scrubber
