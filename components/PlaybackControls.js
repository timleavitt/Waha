import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
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
function PlaybackControls ({
  // Props passed from a parent component.
  isMediaPlaying,
  onPlayPress,
  onSkipPress,
  // Props passed from redux.
  primaryColor
}) {
  //+ RENDER

  return (
    <View style={styles.playPauseSkipContainer}>
      {/* {hasHomework ? (
        <View
          style={{
            width: '100%',
            position: 'absolute',
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            style={{ position: 'absolute', paddingHorizontal: 20 }}
            onPress={showHomeworkModal}
          >
            <Icon name='list' size={40 * scaleMultiplier} color={colors.tuna} />
          </TouchableOpacity>
        </View>
      ) : null} */}
      <TouchableOpacity
        style={styles.playPauseSkipButton}
        onPress={() => onSkipPress(-5000)}
      >
        <Icon
          name='skip-back-5'
          size={69 * scaleMultiplier}
          color={colors.tuna}
        />
      </TouchableOpacity>
      {/* {isVideoBuffering ? (
        <View
          style={{
            width: 101 * scaleMultiplier,
            height: 101 * scaleMultiplier,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ActivityIndicator size='large' />
        </View>
      ) : ( */}
      <TouchableOpacity
        style={styles.playPauseSkipButton}
        onPress={onPlayPress}
      >
        <Icon
          name={isMediaPlaying ? 'pause' : 'play'}
          size={100 * scaleMultiplier}
          color={primaryColor}
        />
      </TouchableOpacity>
      {/* )} */}
      <TouchableOpacity
        style={styles.playPauseSkipButton}
        onPress={() => onSkipPress(5000)}
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
