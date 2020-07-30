import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
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
                textAlign: props.isRTL ? 'right' : 'left',
                fontFamily: props.font + '-medium',
                color: props.color
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
                textAlign: props.isRTL ? 'right' : 'left',
                fontFamily: props.font + '-medium',
                color: colors.white
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
                textAlign: props.isRTL ? 'right' : 'left',
                fontFamily: props.font + '-medium'
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
    justifyContent: 'center',
    paddingHorizontal: 15,
    alignItems: 'center'
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18 * scaleMultiplier
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

export default connect(mapStateToProps)(WahaButton)
