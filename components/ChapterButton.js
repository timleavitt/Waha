import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state),
    primaryColor: activeDatabaseSelector(state).primaryColor,
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

const ChapterButton = ({
  // Props passed from a parent component.
  name,
  mode,
  number,
  activeNumber,
  onPress,
  downloadProgress,
  // Props passed from redux.
  font,
  activeGroup,
  primaryColor,
  translations,
  isRTL
}) => {
  // styles for the different modes

  const buttonStyles = {
    active: {
      backgroundColor: primaryColor,
      borderColor: primaryColor
    },
    inactive: {
      borderColor: colors.porcelain,
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
      1: 'number-1-filled',
      2: 'number-2-filled',
      3: 'number-3-filled',
      4: 'number-4-filled'
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
    // height: 62 * scaleMultiplier,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1
  }
})

export default connect(mapStateToProps)(ChapterButton)
