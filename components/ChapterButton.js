import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import {
  chapterButtonModes,
  chapters,
  lessonTypes,
  scaleMultiplier
} from '../constants'
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
    isRTL: activeDatabaseSelector(state).isRTL,
    downloads: state.downloads,
    isConnected: state.network.isConnected
  }
}

const ChapterButton = ({
  // Props passed from a parent component.
  chapter,
  activeChapter,
  changeChapter,
  lessonType = null,
  lessonID = null,
  isFullyDownloaded = false,
  // Props passed from redux.
  font,
  activeGroup,
  primaryColor,
  translations,
  isRTL,
  downloads,
  isConnected
}) => {
  const [mode, setMode] = useState(chapterButtonModes.INACTIVE)

  const [isMediaDownloading, setIsMediaDownloading] = useState(false)

  const [iconName, setIconName] = useState('')
  const [buttonStyle, setButtonStyle] = useState({})
  const [textStyle, setTextStyle] = useState({})
  const [iconColor, setIconColor] = useState(primaryColor)

  const chapterNames = [
    'Filler',
    translations.play.fellowship,
    translations.play.story,
    translations.play.training,
    translations.play.application
  ]

  useEffect(() => {
    getMode()
  }, [activeChapter, isConnected])

  useEffect(() => {
    if (chapter === chapters.STORY || chapter === chapters.TRAINING) getMode()
  }, [downloads])

  // Every time the mode changes, we need to reset the styles for the button.
  useEffect(() => {
    setStyles()
  }, [mode])

  // const getIcon = () => {
  //   else if (chapter < activeChapter)
  //     setIcon('check-filled')
  //   else if ()
  //   else setIcon(`number-${chapter}-filled`)
  // }

  const getMode = () => {
    // Set the chapter button to the appropriate mode.
    switch (chapter) {
      case chapters.FELLOWSHIP:
        if (activeChapter === chapters.FELLOWSHIP)
          setMode(chapterButtonModes.ACTIVE)
        else setMode(chapterButtonModes.INACTIVE)
        break
      case chapters.STORY:
        if (
          (lessonType === lessonTypes.STANDARD_DBS ||
            lessonType === lessonTypes.STANDARD_DMC) &&
          !isConnected &&
          !isFullyDownloaded
        )
          setMode(chapterButtonModes.DISABLED)
        else if (downloads[lessonID] && downloads[lessonID].progress < 1)
          setMode(chapterButtonModes.DOWNLOADING)
        else if (activeChapter === chapters.STORY)
          setMode(chapterButtonModes.ACTIVE)
        else setMode(chapterButtonModes.INACTIVE)
        break
      case chapters.TRAINING:
        if (!isConnected && !isFullyDownloaded)
          setMode(chapterButtonModes.DISABLED)
        else if (
          downloads[lessonID + 'v'] &&
          downloads[lessonID + 'v'].progress < 1
        )
          setMode(chapterButtonModes.DOWNLOADING)
        else if (activeChapter === chapters.TRAINING)
          setMode(chapterButtonModes.ACTIVE)
        else setMode(chapterButtonModes.INACTIVE)
        break
      case chapters.APPLICATION:
        if (activeChapter === chapters.APPLICATION)
          setMode(chapterButtonModes.ACTIVE)
        else setMode(chapterButtonModes.INACTIVE)
        break
    }
  }

  const setStyles = () => {
    switch (mode) {
      case chapterButtonModes.ACTIVE:
        setButtonStyle({
          backgroundColor: primaryColor,
          borderColor: primaryColor
        })
        setTextStyle(
          StandardTypography(
            { font, isRTL },
            'p',
            'Black',
            'center',
            colors.white
          )
        )
        setIconColor(colors.white)
        // Slight adjustment if the lesson contains a training chapter since that will make the Application need the '4' label instead of '3'.
        if (lessonType.includes('Video') && chapter === chapters.APPLICATION)
          setIconName('number-4-filled')
        else if (
          !lessonType.includes('Video') &&
          chapter === chapters.APPLICATION
        )
          setIconName('number-3-filled')
        else setIconName(`number-${chapter}-filled`)
        break
      case chapterButtonModes.INACTIVE:
        setButtonStyle({
          borderColor: primaryColor,
          backgroundColor: colors.athens
        })
        setTextStyle(
          StandardTypography(
            { font, isRTL },
            'p',
            'Black',
            'center',
            primaryColor
          )
        )
        setIconColor(primaryColor)
        // Slight adjustment if the lesson contains a training chapter since that will make the Application need the '4' label instead of '3'. Another adjustment is that if the chapter is behind the active chapter, the icon is a check mark to show that it's been completed.
        if (lessonType.includes('Video') && chapter === chapters.APPLICATION)
          setIconName('number-4-filled')
        else if (
          !lessonType.includes('Video') &&
          chapter === chapters.APPLICATION
        )
          setIconName('number-3-filled')
        else if (chapter < activeChapter) setIconName('check-filled')
        else setIconName(`number-${chapter}-filled`)
        break
      case chapterButtonModes.DOWNLOADING:
        setButtonStyle({
          borderColor: colors.chateau,
          backgroundColor: colors.athens
        })
        setTextStyle(
          StandardTypography(
            { font, isRTL },
            'p',
            'Black',
            'center',
            colors.chateau
          )
        )
        setIconName(null)
        setIconColor(null)
        break
      case chapterButtonModes.DISABLED:
        setButtonStyle({
          borderColor: colors.chateau,
          backgroundColor: colors.athens
        })
        setTextStyle(
          StandardTypography(
            { font, isRTL },
            'p',
            'Black',
            'center',
            colors.chateau
          )
        )
        setIconName('cloud-slash')
        setIconColor(colors.chateau)
        break
    }
  }

  return (
    <TouchableOpacity
      style={[buttonStyle, styles.chapterButton]}
      onPress={
        mode === chapterButtonModes.DISABLED ||
        mode === chapterButtonModes.DOWNLOADING
          ? () => {}
          : () => changeChapter(chapter)
      }
      activeOpacity={
        mode === chapterButtonModes.DISABLED ||
        mode === chapterButtonModes.DOWNLOADING
          ? 1
          : 0.2
      }
    >
      {mode === chapterButtonModes.DOWNLOADING ? (
        <AnimatedCircularProgress
          size={22 * scaleMultiplier}
          width={4}
          fill={
            chapter === chapters.TRAINING
              ? downloads[lessonID + 'v'].progress * 100
              : downloads[lessonID].progress * 100
          }
          tintColor={primaryColor}
          rotation={0}
          backgroundColor={colors.white}
          padding={4}
        />
      ) : (
        <Icon name={iconName} size={25 * scaleMultiplier} color={iconColor} />
      )}
      <Text style={textStyle}>{chapterNames[chapter]}</Text>
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

export default connect(mapStateToProps)(ChapterButton)
