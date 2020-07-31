import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'

function WahaButton (props) {
  switch (props.type) {
    case 'outline':
      return (
        <TouchableOpacity
          style={[
            {
              width: props.width
            },
            styles.buttonContainer,
            {
              borderWidth: 2,
              borderColor: props.color
            },
            props.style
          ]}
          onPress={props.onPress}
        >
          <Text
            style={[
              styles.buttonText,
              {
                fontFamily: props.font ? props.font + '-medium' : null,
                color: props.color,
                fontWeight: props.font ? null : 'bold'
              },
              props.textStyle
            ]}
          >
            {props.label}
          </Text>
          {props.extraComponent}
        </TouchableOpacity>
      )
      break
    case 'filled':
      return (
        <TouchableOpacity
          style={[
            {
              width: props.width
            },
            styles.buttonContainer,
            {
              backgroundColor: props.color
            },
            props.style
          ]}
          onPress={props.onPress}
        >
          <Text
            style={[
              styles.buttonText,
              {
                fontFamily: props.font ? props.font + '-medium' : null,
                color: colors.white,
                textAlign: 'center',
                fontWeight: props.font ? null : 'bold'
              },
              props.textStyle
            ]}
          >
            {props.label}
          </Text>
          {props.extraComponent}
        </TouchableOpacity>
      )
      break
    case 'inactive':
      return (
        <View
          style={[
            styles.buttonContainer,
            {
              width: props.width
            },
            { borderWidth: 2, borderColor: colors.chateau },
            props.style
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                fontSize: 14 * scaleMultiplier,
                color: colors.chateau,
                fontFamily: props.font ? props.font + '-medium' : null,
                fontWeight: props.font ? null : 'bold'
              },
              props.textStyle
            ]}
          >
            {props.label}
          </Text>
          {props.extraComponent}
        </View>
      )
      break
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
    marginVertical: 20,
    height: 55 * scaleMultiplier,
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18 * scaleMultiplier,
    flex: 1
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return activeGroup
    ? {
        font: state.database[activeGroup.language].font,
        isRTL: state.database[activeGroup.language].isRTL
      }
    : {}
}

export default connect(mapStateToProps)(WahaButton)
