import Slider from '@react-native-community/slider'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import TimeDisplay from '../components/TimeDisplay'
import { gutterSize } from '../constants'
import { colors } from '../styles/colors'

/**
 * A component on the Play Screen that shows the current progress through the loaded media and allows the user to "scrub" to a different position.
 * @param {Function} playFromLocation - Function that plays the media from a specific location in milliseconds.
 * @param {boolean} shouldThumbUpdate - Whether the "thumb", or draggable circle, of the scrubber should update (i.e. "tick").
 * @param {number} mediaLength - The length of the loaded media in milliseconds.
 * @param {number} mediaProgress - The progress in milliseconds through the current media.
 */
const Scrubber = ({
  // Props passed from a parent component.
  playFromLocation,
  shouldThumbUpdate,
  mediaLength,
  mediaProgress,
  isTablet
}) => (
  <View
    style={[
      styles.scrubberContainer,
      {
        marginTop: isTablet ? 20 : 10,
        marginBottom: isTablet ? 10 : 0
      }
    ]}
  >
    <View style={styles.sliderContainer}>
      <Slider
        value={mediaProgress}
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
    <View style={styles.timeInfoContainer}>
      <TimeDisplay time={mediaProgress} max={mediaLength} side='left' />
      <TimeDisplay time={mediaLength} max={mediaLength} side='right' />
    </View>
  </View>
)

const styles = StyleSheet.create({
  scrubberContainer: {
    // Padding here and on timeInfoContainer are different per platform because the slider on Android has 10px of padding by default while on iOS it has 0.
    paddingHorizontal: Platform.OS === 'ios' ? gutterSize : 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  sliderContainer: {
    width: '100%'
  },
  timeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Platform.OS === 'ios' ? 5 : 15
  }
})

export default Scrubber
