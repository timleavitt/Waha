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

/**
 * Pressable component for a single chapter button used in ChapterSeparator. Has a variety of possible styles based on its current mode.
 * @param {number} chapter - The chapter to display on this button. See chapters in constants.js.
 * @param {number} activeChapter - The currently active chapter of the current lesson. See chapters in constants.js.
 * @param {Function} changeChapter - Changes the currently active chapter.
 * @param {string} lessonType - The type of the current lesson. See lessonTypes in constants.js.
 * @param {string} lessonID - The ID of the current lesson. Only needed for the Story and Training chapters.
 * @param {boolean} isAudioDownloaded - Whether this lesson has its audio file downloaded or not. Only needed for the Story chapter button.
 * @param {boolean} isVideoDownloaded - Whether this lesson has its video file downloaded or not. Only needed for the Training chapter button.
 */
const ChapterButton = ({
  // Props passed from a parent component.
  chapter,
  activeChapter,
  changeChapter,
  lessonType,
  lessonID = null,
  isAudioDownloaded = false,
  isVideoDownloaded = false,
  // Props passed from redux.
  font,
  activeGroup,
  primaryColor,
  translations,
  isRTL,
  downloads,
  isConnected
}) => {
  /** Keeps track of the mode of this chapter button. */
  const [mode, setMode] = useState(chapterButtonModes.INACTIVE)

  /** Keeps track of the icon name, button style, text style, and icon color for the chapter button. Updates whenever the mode changes. */
  const [iconName, setIconName] = useState('')
  const [extraButtonStyle, setExtraButtonStyle] = useState({})
  const [textStyle, setTextStyle] = useState({})
  const [iconColor, setIconColor] = useState(primaryColor)

  /** Keeps track of the download progress for the piece of media associated with the chapter button's chapter. */
  const [downloadProgress, setDownloadProgress] = useState(0)

  // The names of the chapters. 'Filler' is there to line up this array with the chapters enum since the enum starts at 1.
  const chapterNames = [
    'Filler',
    translations.play.fellowship,
    translations.play.story,
    translations.play.training,
    translations.play.application
  ]

  // Whenever the active chapter or the user's internet connection status changes, get the most updated mode.
  useEffect(() => {
    setChapterButtonMode()
  }, [activeChapter, isConnected])

  // Also get the most updated mode whenever the download progress changes for this lesson.
  useEffect(() => {
    if (chapter === chapters.STORY || chapter === chapters.TRAINING)
      setChapterButtonMode()
  }, [downloads[lessonID], downloads[lessonID + 'v']])

  // Every time the mode changes, reset the styles for the button.
  useEffect(() => {
    setStyles()
  }, [mode])

  /** Sets the mode for this chapter button. */
  const setChapterButtonMode = () => {
    switch (chapter) {
      case chapters.FELLOWSHIP:
        if (activeChapter === chapters.FELLOWSHIP)
          setMode(chapterButtonModes.ACTIVE)
        // Because the active chapter and chapter are stored as numbers, we can check if the active chapter is bigger than the chapter for this button to see if it's already been completed.
        else if (activeChapter > chapter) setMode(chapterButtonModes.COMPLETE)
        else setMode(chapterButtonModes.INCOMPLETE)
        break
      case chapters.STORY:
        if (
          (lessonType === lessonTypes.STANDARD_DBS ||
            lessonType === lessonTypes.STANDARD_DMC) &&
          !isConnected &&
          !isAudioDownloaded
        )
          setMode(chapterButtonModes.DISABLED)
        else if (downloads[lessonID] && downloads[lessonID].progress < 1) {
          setDownloadProgress(downloads[lessonID].progress * 100)
          setMode(chapterButtonModes.DOWNLOADING)
        } else if (activeChapter === chapters.STORY)
          setMode(chapterButtonModes.ACTIVE)
        else if (activeChapter > chapter) setMode(chapterButtonModes.COMPLETE)
        else setMode(chapterButtonModes.INCOMPLETE)
        break
      case chapters.TRAINING:
        if (!isConnected && !isVideoDownloaded)
          setMode(chapterButtonModes.DISABLED)
        else if (
          downloads[lessonID + 'v'] &&
          downloads[lessonID + 'v'].progress < 1
        ) {
          setDownloadProgress(downloads[lessonID + 'v'].progress * 100)
          setMode(chapterButtonModes.DOWNLOADING)
        } else if (activeChapter === chapters.TRAINING)
          setMode(chapterButtonModes.ACTIVE)
        else if (activeChapter > chapter) setMode(chapterButtonModes.COMPLETE)
        else setMode(chapterButtonModes.INCOMPLETE)
        break
      case chapters.APPLICATION:
        if (activeChapter === chapters.APPLICATION)
          setMode(chapterButtonModes.ACTIVE)
        else if (activeChapter > chapter) setMode(chapterButtonModes.COMPLETE)
        else setMode(chapterButtonModes.INCOMPLETE)
        break
    }
  }

  /** Sets the various style states based on the current mode. */
  const setStyles = () => {
    switch (mode) {
      case chapterButtonModes.ACTIVE:
        setExtraButtonStyle({
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
      case chapterButtonModes.INCOMPLETE:
        setExtraButtonStyle({
          borderColor: colors.porcelain,
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
        else setIconName(`number-${chapter}-filled`)
        break
      case chapterButtonModes.COMPLETE:
        setExtraButtonStyle({
          borderColor: colors.porcelain,
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
        setIconName('check-filled')
        break
      case chapterButtonModes.DOWNLOADING:
        setExtraButtonStyle({
          borderColor: colors.porcelain,
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
        setExtraButtonStyle({
          borderColor: colors.porcelain,
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
      style={[styles.chapterButton, extraButtonStyle]}
      // Disable onPress (by making the onPress function empty and by disabling the touch effect) if the chapter button is DISABLED or DOWNLOADING.
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
      {/* If we're DOWNLOADING, show the progress indicator. Otherwise, show an icon. */}
      {mode === chapterButtonModes.DOWNLOADING ? (
        <AnimatedCircularProgress
          size={22 * scaleMultiplier}
          width={4}
          fill={downloadProgress}
          tintColor={primaryColor}
          rotation={0}
          backgroundColor={colors.white}
          padding={4}
        />
      ) : (
        <Icon name={iconName} size={25 * scaleMultiplier} color={iconColor} />
      )}
      {/* The name of the chapter. */}
      <Text style={textStyle}>{chapterNames[chapter]}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chapterButton: {
    flex: 1,
    paddingVertical: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 20,
    borderWidth: 2
    // borderTopWidth: 2,
    // borderBottomWidth: 2
  }
})

export default connect(mapStateToProps)(ChapterButton)
