import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { colors } from '../styles/colors'

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
        onPress={() => onSkipPress(-10000)}
      >
        <Icon
          name='skip-back'
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
        onPress={() => onSkipPress(10000)}
      >
        <Icon
          name='skip-forward'
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    primaryColor: state.database[activeGroup.language].primaryColor
  }
}

export default connect(mapStateToProps)(PlaybackControls)
