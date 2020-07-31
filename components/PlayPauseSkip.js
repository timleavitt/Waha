import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
// play, pause, and skip controls for play screen
function PlayPauseSkip (props) {
  //// RENDER

  return (
    <View style={styles.playPauseSkipContainer}>
      <TouchableOpacity
        style={styles.playPauseSkipButton}
        onPress={() => props.onSkipPress(-10000)}
      >
        <Icon
          name='skip-back'
          size={69 * scaleMultiplier}
          color={colors.tuna}
        />
      </TouchableOpacity>
      {props.isVideoBuffering ? (
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
      ) : (
        <TouchableOpacity
          style={styles.playPauseSkipButton}
          onPress={props.onPlayPress}
        >
          <Icon
            name={props.isPlaying ? 'pause' : 'play'}
            size={100 * scaleMultiplier}
            color={props.primaryColor}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.playPauseSkipButton}
        onPress={() => props.onSkipPress(10000)}
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

//// STYLES

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

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    primaryColor: state.database[activeGroup.language].primaryColor
  }
}

export default connect(mapStateToProps)(PlayPauseSkip)
