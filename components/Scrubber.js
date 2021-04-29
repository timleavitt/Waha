import Slider from '@react-native-community/slider'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import TimeDisplay from '../components/TimeDisplay'
import { colors } from '../styles/colors'

// scrubber component rendered on play screen
const Scrubber = ({
  // Props passed from a parent component.
  playFromLocation,
  shouldThumbUpdate,
  mediaLength,
  thumbPosition
}) => (
  <View style={styles.scrubberContainer}>
    <View style={styles.scrubber}>
      <Slider
        value={thumbPosition}
        onSlidingComplete={playFromLocation}
        onValueChange={() => (shouldThumbUpdate.current = false)}
        minimumValue={0}
        maximumValue={mediaLength}
        step={100}
        minimumTrackTintColor={colors.tuna}
        maximumTrackTintColor={colors.geyser}
        thumbTintColor={colors.tuna}
      />
    </View>
    <View style={styles.timeInfo}>
      <TimeDisplay time={thumbPosition} max={mediaLength} side='left' />
      <TimeDisplay time={mediaLength} max={mediaLength} side='right' />
    </View>
  </View>
)

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
    width: '100%',
    paddingHorizontal: 3
  }
})

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.thumbPosition === nextProps.thumbPosition &&
    prevProps.mediaLength === nextProps.mediaLength
  )
}

export default Scrubber
