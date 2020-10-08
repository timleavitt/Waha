import Slider from '@react-native-community/slider'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import TimeDisplay from '../components/TimeDisplay'
import { colors } from '../constants'
// scrubber component rendered on play screen
function Scrubber (props) {
  //+ RENDER

  return (
    <View style={styles.scrubberContainer}>
      <View style={styles.scrubber}>
        <Slider
          value={props.value}
          onSlidingComplete={value => props.onSlidingComplete(value)}
          onValueChange={props.onValueChange}
          minimumValue={0}
          maximumValue={props.maximumValue}
          step={100}
          minimumTrackTintColor={colors.tuna}
          thumbTintColor={colors.tuna}
        />
      </View>
      <View style={styles.timeInfo}>
        <TimeDisplay time={props.seekPosition} max={props.maximumValue} />
        <TimeDisplay time={props.maximumValue} max={props.maximumValue} />
      </View>
    </View>
  )
}

//+ STYLES

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
