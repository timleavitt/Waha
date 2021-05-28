import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { activeDatabaseSelector } from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'

function mapStateToProps (state) {
  return {
    primaryColor: activeDatabaseSelector(state).primaryColor,
    isTablet: state.deviceInfo.isTablet
  }
}

/**
 * A component that shows the play/pause and skip buttons on the Play Screen.
 * @param {boolean} isMediaPlaying - Whether the current media (audio or video) is currently playing.
 * @param {boolean} isMediaLoaded - Whether the current media is loaded.
 * @param {Function} playHandler - Function to call when the user presses the play/pause button.
 * @param {number} mediaProgress - The progress in milliseconds through the current media.
 * @param {Function} playFromLocation - Function that plays the media from a specific location in milliseconds. Used for the skip buttons.
 */
const PlaybackControls = ({
  // Props passed from a parent component.
  isMediaPlaying,
  isMediaLoaded,
  playHandler,
  mediaProgress,
  playFromLocation,
  // Props passed from redux.
  primaryColor,
  isTablet
}) => (
  <View style={styles.playbackControlsContainer}>
    <TouchableOpacity
      style={styles.skipButtonContainer}
      // Skip back five seconds.
      onPress={() => playFromLocation(mediaProgress - 5000)}
    >
      <Icon
        name='skip-back-5'
        size={isTablet ? 89 * scaleMultiplier : 69 * scaleMultiplier}
        color={colors.tuna}
      />
    </TouchableOpacity>
    {isMediaLoaded ? (
      <TouchableOpacity
        style={[
          styles.playButtonContainer,
          {
            width: isTablet ? 130 * scaleMultiplier : 100 * scaleMultiplier,
            height: isTablet ? 130 * scaleMultiplier : 100 * scaleMultiplier
          }
        ]}
        onPress={playHandler}
      >
        <Icon
          name={isMediaPlaying ? 'pause' : 'play'}
          size={isTablet ? 130 * scaleMultiplier : 100 * scaleMultiplier}
          color={primaryColor}
        />
      </TouchableOpacity>
    ) : (
      // Show a spinning activity indicator if the media is loading.
      <View
        style={[
          styles.playButtonContainer,
          {
            width: isTablet ? 130 * scaleMultiplier : 100 * scaleMultiplier,
            height: isTablet ? 130 * scaleMultiplier : 100 * scaleMultiplier
          }
        ]}
      >
        <ActivityIndicator size='large' color={colors.shark} />
      </View>
    )}
    <TouchableOpacity
      style={styles.skipButtonContainer}
      // Skip forward five seconds.
      onPress={() => playFromLocation(mediaProgress + 5000)}
    >
      <Icon
        name='skip-forward-5'
        size={isTablet ? 89 * scaleMultiplier : 69 * scaleMultiplier}
        color={colors.tuna}
      />
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  playbackControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -15
  },
  playButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  skipButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default connect(mapStateToProps)(PlaybackControls)
