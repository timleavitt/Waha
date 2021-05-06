import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors, keyColors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'
import PianoKeyLabel from './PianoKeyLabel'

function mapStateToProps (state) {
  return {
    font: getLanguageFont(activeGroupSelector(state).language),
    security: state.security,
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state)
  }
}

/**
 * A component that shows the passcode that is currently entered on the piano.
 * @param {string} passcode - The current passcode.
 */
const PianoPasscodeDisplay = ({
  // Props passed from a parent component.s
  passcode,
  // Props passed from redux.
  font,
  security,
  isRTL,
  activeGroup
}) => (
  <View
    style={{
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 20,
      flexDirection: isRTL ? 'row-reverse' : 'row'
    }}
  >
    <View style={styles.keyPlaceholder}>
      {passcode[1] && (
        <PianoKeyLabel
          backgroundColor={keyColors[passcode.substr(0, 2).replace(/^0/, '')]}
          number={passcode.substr(0, 2).replace(/^0/, '')}
          style={{ alignSelf: null, marginBottom: 0 }}
        />
      )}
    </View>
    <View style={styles.keyPlaceholder}>
      {passcode[3] && (
        <PianoKeyLabel
          backgroundColor={keyColors[passcode.substr(2, 2).replace(/^0/, '')]}
          number={passcode.substr(2, 2).replace(/^0/, '')}
          style={{ alignSelf: null, marginBottom: 0 }}
        />
      )}
    </View>
    <View style={styles.keyPlaceholder}>
      {passcode[5] && (
        <PianoKeyLabel
          backgroundColor={keyColors[passcode.substr(4, 2).replace(/^0/, '')]}
          number={passcode.substr(4, 2).replace(/^0/, '')}
          style={{ alignSelf: null, marginBottom: 0 }}
        />
      )}
    </View>
    <View style={styles.keyPlaceholder}>
      {passcode[7] && (
        <PianoKeyLabel
          backgroundColor={keyColors[passcode.substr(6, 2).replace(/^0/, '')]}
          number={passcode.substr(6, 2).replace(/^0/, '')}
          style={{ alignSelf: null, marginBottom: 0 }}
        />
      )}
    </View>
    <View style={styles.keyPlaceholder}>
      {passcode[9] && (
        <PianoKeyLabel
          backgroundColor={keyColors[passcode.substr(8, 2).replace(/^0/, '')]}
          number={passcode.substr(8, 2).replace(/^0/, '')}
          style={{ alignSelf: null, marginBottom: 0 }}
        />
      )}
    </View>
    <View style={styles.keyPlaceholder}>
      {passcode[11] && (
        <PianoKeyLabel
          backgroundColor={keyColors[passcode.substr(10, 2).replace(/^0/, '')]}
          number={passcode.substr(10, 2).replace(/^0/, '')}
          style={{ alignSelf: null, marginBottom: 0 }}
        />
      )}
    </View>
  </View>
)

const styles = StyleSheet.create({
  keyPlaceholder: {
    width: Dimensions.get('window').width / 12 + 12,
    height: Dimensions.get('window').width / 12 + 12,
    borderRadius: Dimensions.get('window').width / 24 + 6,
    backgroundColor: colors.white,
    margin: 5 * scaleMultiplier,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2
  }
})

export default connect(mapStateToProps)(PianoPasscodeDisplay)
