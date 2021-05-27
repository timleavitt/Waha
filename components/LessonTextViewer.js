// import SvgUri from 'expo-svg-uri'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'
import LessonTextContent from './LessonTextContent'

function mapStateToProps (state) {
  return {
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    font: getLanguageFont(activeGroupSelector(state).language),
    t: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

const scrollBarSize = 40 * scaleMultiplier

/**
 * Displays all of the text for the different lesson sections.
 * @param {ref} lessonTextContentRef - The ref for the carousel component of the AlbumArtSwiper. Used to manually jump to specific pages.
 * @param {Object} thisLesson - The object for the lesson that the user has selected to do.
 * @param {string} lessonType - The type of the current lesson. See lessonTypes in constants.js.
 * @param {Object[]} sectionOffsets - Stores the different sections of the lesson text and their global scroll offset.
 * @param {Function} setSectionTitleText - Sets the section title text.
 * @param {number} setSectionTitleOpacity - The opacity of the section title.
 * @param {number} sectionTitleYTransform - The y transform value for the section title.
 * @param {Function} markLessonAsComplete - Marks this lesson as complete.
 * @param {boolean} isThisLessonComplete - Whether or not this lesson is complete.
 */
const LessonTextViewer = ({
  // Props passed from a parent component.
  lessonTextContentRef,
  thisLesson,
  lessonType,
  sectionOffsets,
  setSectionTitleText = null,
  sectionTitleOpacity = null,
  sectionTitleYTransform = null,
  markLessonAsComplete = null,
  isThisLessonComplete = null,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  t,
  isRTL
}) => {
  /** Keeps track of the heights of the various text layouts. */
  const layouts = useRef({
    contentHeight: 0,
    windowHeight: 0
  })

  /** Simple state to re-render the section header. */
  const [refreshSectionHeader, setRefreshSectionHeader] = useState(false)

  /** Keeps track of the section that the user is currently in. */
  const [currentSection, setCurrentSection] = useState()

  /** Gets fired whenever the user scrolls the lesson text content. */
  const onScroll = ({ nativeEvent }) => {
    // Check if the section header needs to be updated.
    checkForSectionHeaderUpdates(
      nativeEvent.contentOffset.y < 0 ? 0 : nativeEvent.contentOffset.y
    )

    // Marks a lesson as complete if the user scrolls 20% of the way through the application text.
    if (
      currentSection &&
      currentSection.title === t.play.application &&
      !isThisLessonComplete.current &&
      (nativeEvent.contentOffset.y - currentSection.globalOffset) /
        (layouts.current.contentHeight - currentSection.globalOffset) >
        0.2
    )
      markLessonAsComplete()
  }

  /**
   * Checks if the section header needs to be updated based on the current scroll position.
   */
  const checkForSectionHeaderUpdates = scrollPosition => {
    // There's no section headers for book/audiobook lessons, so return if we're in one of those lessons.
    if (lessonType.includes('BookText')) return

    // The index of the current section.
    const currentIndex = sectionOffsets.current.indexOf(currentSection)

    // Only find the current section if the scroll position is outside of the current section's bounds.
    if (
      scrollPosition < currentSection.globalOffset ||
      scrollPosition > sectionOffsets.current[currentIndex + 1].globalOffset
    ) {
      // Find the section that we're currently scrolling in by itereting through the sections and checking their offsets.
      var sectionIndex = -1
      do {
        sectionIndex += 1
      } while (
        scrollPosition >= sectionOffsets.current[sectionIndex].globalOffset
      )
      setCurrentSection(sectionOffsets.current[sectionIndex - 1])
    }
  }

  /** useEffect function that sets the initial section once all of the sections have been added. */
  useEffect(() => {
    if (sectionOffsets.current.length === thisLesson.scripture.length + 3)
      setCurrentSection(sectionOffsets.current[0])
  }, [sectionOffsets.current])

  /** useEffect function that sets and animates the section header text whenever the current section changes. */
  useEffect(() => {
    currentSection && setAndAnimateSectionHeaderText(currentSection.title)
  }, [currentSection])

  /**
   * Animates the current section title out and sets it to the new title..
   * @param {string} newTitle - The new title to set.
   */
  const setAndAnimateSectionHeaderText = newTitle => {
    Animated.parallel([
      Animated.timing(sectionTitleOpacity, {
        toValue: 0,
        duration: 150
      }),
      Animated.timing(sectionTitleYTransform, {
        toValue: -10,
        duration: 100
      })
    ]).start(() => {
      setSectionTitleText(newTitle)
      setRefreshSectionHeader(current => !current)
    })
  }

  /** useEffect function that animates the section title back in after it's been changed. */
  useEffect(() => {
    if (currentSection !== null) {
      sectionTitleYTransform.setValue(0)
      Animated.timing(sectionTitleOpacity, {
        toValue: 1,
        duration: 100
      }).start()
    }
  }, [refreshSectionHeader])

  return (
    <View style={{ flex: 1 }}>
      <LessonTextContent
        thisLesson={thisLesson}
        lessonType={lessonType}
        lessonTextContentRef={lessonTextContentRef}
        layouts={layouts}
        onScroll={onScroll}
        sectionOffsets={sectionOffsets}
      />
      <LinearGradient
        colors={[colors.white, colors.white + '00']}
        start={[1, 1]}
        end={[1, 0]}
        style={styles.bottomFadeArea}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  bottomFadeArea: {
    position: 'absolute',
    bottom: 0,
    height: 20 * scaleMultiplier,
    width: '100%'
  }
})

export default connect(mapStateToProps)(LessonTextViewer)
