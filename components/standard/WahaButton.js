import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../../constants'
import { BrandTypography, SystemTypography } from '../../styles/typography'

function WahaButton (props) {
  switch (props.type) {
    case 'outline':
      return (
        <TouchableOpacity
          style={[
            { width: props.width },
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
              props.useDefaultFont
                ? SystemTypography(false, 'h3', 'medium', 'center', props.color)
                : BrandTypography(props, 'h3', 'medium', 'center', props.color),
              { fontWeight: props.font ? null : 'bold' },
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
              props.useDefaultFont
                ? SystemTypography(
                    false,
                    'h3',
                    'medium',
                    'center',
                    colors.white
                  )
                : BrandTypography(
                    props,
                    'h3',
                    'medium',
                    'center',
                    colors.white
                  ),
              { fontWeight: props.font ? null : 'bold' },
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
              props.useDefaultFont
                ? SystemTypography(
                    false,
                    'p',
                    'medium',
                    'center',
                    colors.chateau
                  )
                : BrandTypography(
                    props,
                    'p',
                    'medium',
                    'center',
                    colors.chateau
                  ),
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
    marginVertical: 20 * scaleMultiplier,
    // paddingVertical: 10 * scaleMultiplier,
    height: 65 * scaleMultiplier,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
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
