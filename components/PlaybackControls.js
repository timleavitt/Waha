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
    primaryColor: activeDatabaseSelector(state).primaryColor
  }
}

// play, pause, and skip controls for play screen
const PlaybackControls = ({
  // Props passed from a parent component.
  isMediaPlaying,
  isMediaLoaded,
  playHandler,
  thumbPosition,
  playFromLocation,
  // Props passed from redux.
  primaryColor
}) => {
  //+ RENDER

  return (
    <View style={styles.playPauseSkipContainer}>
      <TouchableOpacity
        style={styles.playPauseSkipButton}
        onPress={() => playFromLocation(thumbPosition - 5000)}
      >
        <Icon
          name='skip-back-5'
          size={69 * scaleMultiplier}
          color={colors.tuna}
        />
      </TouchableOpacity>
      {isMediaLoaded ? (
        <TouchableOpacity
          style={styles.playPauseSkipButton}
          onPress={playHandler}
        >
          <Icon
            name={isMediaPlaying ? 'pause' : 'play'}
            size={100 * scaleMultiplier}
            color={primaryColor}
          />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            width: 100 * scaleMultiplier,
            height: 100 * scaleMultiplier,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ActivityIndicator size='large' color={colors.shark} />
        </View>
      )}
      <TouchableOpacity
        style={styles.playPauseSkipButton}
        onPress={() => playFromLocation(thumbPosition + 5000)}
      >
        <Icon
          name='skip-forward-5'
          size={69 * scaleMultiplier}
          color={colors.tuna}
        />
      </TouchableOpacity>
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  playPauseSkipContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -15
  },
  playPauseSkipButton: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default connect(mapStateToProps)(PlaybackControls)
