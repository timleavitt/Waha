import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import KeyLabel from '../components/KeyLabel'
import { colors, keyColors } from '../constants'

function KeyLabels (props) {
  var keyLabel1 = props.keyOrder[1] ? (
    <KeyLabel
      backgroundColor={keyColors[props.keyOrder.substr(0, 2).replace(/^0/, '')]}
      number={props.keyOrder.substr(0, 2).replace(/^0/, '')}
      style={{ alignSelf: null, marginBottom: 0 }}
    />
  ) : null

  var keyLabel2 = props.keyOrder[3] ? (
    <KeyLabel
      backgroundColor={keyColors[props.keyOrder.substr(2, 2).replace(/^0/, '')]}
      number={props.keyOrder.substr(2, 2).replace(/^0/, '')}
      style={{ alignSelf: null, marginBottom: 0 }}
    />
  ) : null

  var keyLabel3 = props.keyOrder[5] ? (
    <KeyLabel
      backgroundColor={keyColors[props.keyOrder.substr(4, 2).replace(/^0/, '')]}
      number={props.keyOrder.substr(4, 2).replace(/^0/, '')}
      style={{ alignSelf: null, marginBottom: 0 }}
    />
  ) : null

  var keyLabel4 = props.keyOrder[7] ? (
    <KeyLabel
      backgroundColor={keyColors[props.keyOrder.substr(6, 2).replace(/^0/, '')]}
      number={props.keyOrder.substr(6, 2).replace(/^0/, '')}
      style={{ alignSelf: null, marginBottom: 0 }}
    />
  ) : null

  var keyLabel5 = props.keyOrder[9] ? (
    <KeyLabel
      backgroundColor={keyColors[props.keyOrder.substr(8, 2).replace(/^0/, '')]}
      number={props.keyOrder.substr(8, 2).replace(/^0/, '')}
      style={{ alignSelf: null, marginBottom: 0 }}
    />
  ) : null

  var keyLabel6 = props.keyOrder[11] ? (
    <KeyLabel
      backgroundColor={
        keyColors[props.keyOrder.substr(10, 2).replace(/^0/, '')]
      }
      number={props.keyOrder.substr(10, 2).replace(/^0/, '')}
      style={{ alignSelf: null, marginBottom: 0 }}
    />
  ) : null

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <View style={styles.keyPlaceholder}>{keyLabel1}</View>
      <View style={styles.keyPlaceholder}>{keyLabel2}</View>
      <View style={styles.keyPlaceholder}>{keyLabel3}</View>
      <View style={styles.keyPlaceholder}>{keyLabel4}</View>
      <View style={styles.keyPlaceholder}>{keyLabel5}</View>
      <View style={styles.keyPlaceholder}>{keyLabel6}</View>
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  keyPlaceholder: {
    width: Dimensions.get('window').width / 12 + 10,
    height: Dimensions.get('window').width / 12 + 10,
    borderRadius: Dimensions.get('window').width / 24 + 5,
    backgroundColor: colors.white,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    security: state.security
  }
}

export default connect(mapStateToProps)(KeyLabels)
