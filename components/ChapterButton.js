import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import { colors, getLanguageFont, scaleMultiplier } from '../constants'
import { StandardTypography } from '../styles/typography'

function ChapterButton ({
  // passed from parents
  name,
  mode,
  number,
  activeNumber,
  onPress,
  downloadProgress,
  // passed from redux
  font,
  activeGroup,
  primaryColor,
  translations,
  isRTL
}) {
  // styles for the different modes

  const buttonStyles = {
    active: {
      backgroundColor: primaryColor,
      borderColor: primaryColor
    },
    inactive: {
      borderColor: primaryColor,
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
    active: StandardTypography(
      { font, isRTL },
      'p',
      'Black',
      'center',
      colors.white
    ),
    inactive: StandardTypography(
      { font, isRTL },
      'p',
      'Black',
      'center',
      primaryColor
    ),
    downloading: StandardTypography(
      { font, isRTL },
      'p',
      'Black',
      'center',
      colors.chateau
    ),
    disabled: StandardTypography(
      { font, isRTL },
      'p',
      'Black',
      'center',
      colors.chateau
    )
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
    if (activeNumber > number) return 'check-filled'
    else if (mode === 'active') return iconNamesOutline[number]
    else return iconNamesFilled[number]
  }

  return (
    <TouchableOpacity
      style={[styles.chapterButton, buttonStyles[mode]]}
      // no onPress if button is disabled
      onPress={
        mode === 'disabled' || mode === 'downloading'
          ? () => {}
          : () => onPress(name)
      }
      activeOpacity={mode === 'disabled' || mode === 'downloading' ? 1 : 0.2}
    >
      {mode === 'downloading' ? (
        <AnimatedCircularProgress
          size={22 * scaleMultiplier}
          width={4}
          fill={downloadProgress * 100}
          tintColor={primaryColor}
          rotation={0}
          backgroundColor={colors.white}
          padding={4}
        />
      ) : (
        <Icon
          name={mode === 'disabled' ? 'cloud-slash' : getNumberIcon()}
          size={25 * scaleMultiplier}
          color={
            mode === 'disabled'
              ? colors.chateau
              : mode === 'active'
              ? colors.white
              : primaryColor
          }
        />
      )}
      <Text style={textStyles[mode]}>{translations.play[name]}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chapterButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    height: 62 * scaleMultiplier,
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
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup,
    primaryColor: state.database[activeGroup.language].primaryColor,
    translations: state.database[activeGroup.language].translations,
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(ChapterButton)
