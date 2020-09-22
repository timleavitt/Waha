import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'

function ChapterButton (props) {
  // styles for the different modes

  const buttonStyles = {
    active: {
      backgroundColor: props.primaryColor,
      borderColor: props.primaryColor
    },
    inactive: {
      borderColor: props.primaryColor,
      backgroundColor: colors.athens
    },
    downloading: {
      borderColor: colors.chateau,
      backgroundColor: colors.athens
    },
    disabled: {
      borderColor: colors.chateau,
      backgroundColor: colors.athens
    }
  }

  const textStyles = {
    active: Typography(props, 'p', 'black', 'center', colors.white),
    inactive: Typography(props, 'p', 'black', 'center', props.primaryColor),
    downloading: Typography(props, 'p', 'black', 'center', colors.chateau),
    disabled: Typography(props, 'p', 'black', 'center', colors.chateau)
  }

  // get the icon name depending on the mode/if this button is active or not
  function getNumberIcon () {
    const iconNamesOutline = {
      1: 'number-1-outline',
      2: 'number-2-outline',
      3: 'number-3-outline',
      4: 'number-4-outline'
    }
    const iconNamesFilled = {
      1: 'number-1-filled',
      2: 'number-2-filled',
      3: 'number-3-filled',
      4: 'number-4-filled'
    }
    if (props.activeNumber > props.number) return 'check-filled'
    else if (props.mode === 'active') return iconNamesOutline[props.number]
    else return iconNamesFilled[props.number]
  }

  return (
    <TouchableOpacity
      style={[styles.chapterButton, buttonStyles[props.mode]]}
      // no onPress if button is disabled
      onPress={
        props.mode === 'disabled' || props.mode === 'downloading'
          ? () => {}
          : () => props.onPress(props.name)
      }
      activeOpacity={
        props.mode === 'disabled' || props.mode === 'downloading' ? 1 : 0.2
      }
    >
      {props.mode === 'downloading' ? (
        <AnimatedCircularProgress
          size={22 * scaleMultiplier}
          width={4}
          fill={props.downloadProgress * 100}
          tintColor={props.primaryColor}
          rotation={0}
          backgroundColor={colors.white}
          padding={4}
        />
      ) : (
        <Icon
          name={props.mode === 'disabled' ? 'cloud-slash' : getNumberIcon()}
          size={25 * scaleMultiplier}
          color={
            props.mode === 'disabled'
              ? colors.chateau
              : props.mode === 'active'
              ? colors.white
              : props.primaryColor
          }
        />
      )}
      <Text style={textStyles[props.mode]}>
        {props.translations.play[props.name]}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chapterButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    height: 55 * scaleMultiplier,
    justifyContent: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    primaryColor: state.database[activeGroup.language].primaryColor,
    translations: state.database[activeGroup.language].translations
  }
}

export default connect(mapStateToProps)(ChapterButton)
