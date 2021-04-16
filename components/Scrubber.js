import Slider from '@react-native-community/slider'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import TimeDisplay from '../components/TimeDisplay'
import { colors } from '../styles/colors'

// scrubber component rendered on play screen
const Scrubber = ({
  // Props passed from a parent component.
  onSlidingComplete,
  onValueChange,
  maximumValue,
  seekPosition
}) => {
  console.log(`${Date.now()} Scrubber re-rendering.`)

  return (
    <View style={styles.scrubberContainer}>
      <View style={styles.scrubber}>
        <Slider
          value={seekPosition}
          onSlidingComplete={value => onSlidingComplete(value)}
          onValueChange={onValueChange}
          minimumValue={0}
          maximumValue={maximumValue}
          step={100}
          minimumTrackTintColor={colors.tuna}
          thumbTintColor={colors.tuna}
        />
      </View>
      <View style={styles.timeInfo}>
        <TimeDisplay time={seekPosition} max={maximumValue} />
        <TimeDisplay time={maximumValue} max={maximumValue} />
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

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.seekPosition === nextProps.seekPosition &&
    prevProps.maximumValue === nextProps.maximumValue
  )
}

export default Scrubber
