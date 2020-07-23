import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier, keyColors } from '../constants'
import KeyLabel from '../components/KeyLabel'
function Piano (props) {
  // RENDER

  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'flex-start'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          position: 'absolute',
          zIndex: 2
        }}
      >
        <View style={{ flex: 0.5 }} />
        <TouchableOpacity
          style={styles.blackKey}
          onPress={() => props.setPattern(pattern => pattern + '02')}
        >
          <KeyLabel backgroundColor={keyColors['2']} number='2' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.blackKey}
          onPress={() => props.setPattern(pattern => pattern + '04')}
        >
          <KeyLabel backgroundColor={keyColors['4']} number='4' />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.blackKey}
          onPress={() => props.setPattern(pattern => pattern + '07')}
        >
          <KeyLabel backgroundColor={keyColors['7']} number='7' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.blackKey}
          onPress={() => props.setPattern(pattern => pattern + '09')}
        >
          <KeyLabel backgroundColor={keyColors['9']} number='9' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.blackKey}
          onPress={() => props.setPattern(pattern => pattern + '11')}
        >
          <KeyLabel backgroundColor={keyColors['11']} number='11' />
        </TouchableOpacity>
        <View style={{ flex: 0.5 }} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%'
        }}
      >
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => props.setPattern(pattern => pattern + '01')}
        >
          <KeyLabel backgroundColor={keyColors['1']} number='1' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => props.setPattern(pattern => pattern + '03')}
        >
          <KeyLabel backgroundColor={keyColors['3']} number='3' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => props.setPattern(pattern => pattern + '05')}
        >
          <KeyLabel backgroundColor={keyColors['5']} number='5' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => props.setPattern(pattern => pattern + '06')}
        >
          <KeyLabel backgroundColor={keyColors['6']} number='6' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => props.setPattern(pattern => pattern + '08')}
        >
          <KeyLabel backgroundColor={keyColors['8']} number='8' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => props.setPattern(pattern => pattern + '10')}
        >
          <KeyLabel backgroundColor={keyColors['10']} number='10' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whiteKey}
          onPress={() => props.setPattern(pattern => pattern + '12')}
        >
          <KeyLabel backgroundColor={keyColors['12']} number='12' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

// STYLES

const styles = StyleSheet.create({
  whiteKey: {
    flex: 1,
    height: Dimensions.get('window').height / 2.5,
    margin: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    zIndex: 0
  },
  blackKey: {
    flex: 1,
    height: Dimensions.get('window').height / 4,
    margin: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    zIndex: 1,
    backgroundColor: '#000000'
  },
  circle: {
    width: Dimensions.get('window').width / 10,
    height: Dimensions.get('window').width / 10,
    borderRadius: Dimensions.get('window').width / 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    alignSelf: 'flex-end',
    zIndex: 3,
    marginBottom: 10
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(Piano)
