import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'

function WahaItem (props) {
  return props.onPress ? (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {
          flexDirection: props.isRTL ? 'row-reverse' : 'row'
        },
        props.style
      ]}
      onPress={props.onPress}
    >
      <Text
        style={{
          fontFamily: props.font + '-medium',
          fontSize: 18 * scaleMultiplier,
          color: colors.shark
        }}
      >
        {props.title}
      </Text>
      {props.children}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        styles.itemContainer,
        {
          flexDirection: props.isRTL ? 'row-reverse' : 'row'
        },
        props.style
      ]}
    >
      <Text
        style={{
          fontFamily: props.font + '-medium',
          fontSize: 18 * scaleMultiplier,
          color: colors.shark
        }}
      >
        {props.title}
      </Text>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    // height: 80 * scaleMultiplier,
    aspectRatio: 5,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(WahaItem)
