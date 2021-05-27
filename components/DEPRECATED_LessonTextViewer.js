// import SvgUri from 'expo-svg-uri'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import { State } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'
import FloatingSectionLabel from './FloatingSectionLabel'
import LessonTextContent from './LessonTextContent'
import LessonTextScrollBar from './LessonTextScrollBar'

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
 * Order of events:
 * 1. Things get rendered and layout states are set, including the global offsets for the different text sections.
 * 2. Once the layout values are set, the isFullyRendered state is set to true indicating that we can actions that require those layout values. At the same time, the local offsets for the sections are set as well.
 * 3. When isFullyRendered becomes true, the listener for the scroll bar gesture position starts.
 */
const LessonTextViewer = ({
  // Props passed from a parent component.
  lessonTextContentRef,
  thisLesson,
  lessonType,
  sectionOffsets,
  isScrolling,
  setIsScrolling,
  isScrollBarDragging,
  setIsScrollBarDragging,
  sectionTitleText = null,
  sectionSubtitleText = null,
  setSectionTitleText = null,
  setSectionSubtitleText = null,
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
  /** Keeps track of whether or not the scroll bar should be visible. */
  const [shouldShowScrollBar, setShouldShowScrollBar] = useState(false)

  /** Keeps track of the heights of the various text layouts. */
  const layouts = useRef({
    contentHeight: 0,
    windowHeight: 0
  })

  /** Keeps track of the y position of the scroll bar based on the user's drag gesture. This is NOT the actual position of the scroll bar on screen, but just of the user's drag gesture on the scroll bar. These are separated because we don't always want the user's finger position while dragging to be where the scroll bar is. This happens when we are snapping to a section or dragging outside the bounds of the text window. */
  const scrollBarYPosition_Gesture = useRef(new Animated.Value(0)).current

  /** Keeps track of the actual y position of the scroll bar. */
  const [scrollBarYPosition_Actual, setScrollBarYPosition_Actual] = useState(0)

  /** Keeps track of the horizontal position of the scroll bar. It animates in and out. */
  const scrollBarXPosition = useRef(
    isRTL
      ? new Animated.Value(-scrollBarSize)
      : new Animated.Value(scrollBarSize)
  ).current

  /** Holds a timeout function that hides the scroll bar after a few seconds. The timeout is reset whenever the user starts scrolling. */
  const hideScrollBarTimeout = useRef(null)

  /** Keeps track of whether or not the scroll bar is actively "snapped" to one of the text sections. */
  const isSnapped = useRef(false)

  /** Keeps track of the opacity of the section labels. */
  const floatingSectionLabelsOpacity = useRef(new Animated.Value(0)).current

  /** Keeps track of whether the various layout states have been set yet. */
  const [isFullyRendered, setIsFullyRendered] = useState(false)

  const [refreshSectionHeader, setRefreshSectionHeader] = useState(false)

  const [floatingSectionLabelHeight, setFloatingSectionLabelHeight] = useState(
    0
  )

  const currentSection = useRef(null)

  /** Start listener for the position of the scroll bar. */
  useEffect(() => {
    startScrollBarPositionListener()
  }, [isScrollBarDragging])

  /**
   * Starts a listener for the animated scrollBarYPosition_Gesture value and handles changes. Notably, it checks if we're near enough to a section header to "snap" to it. It also updates the actual position of the scroll bar.
   */
  const startScrollBarPositionListener = () => {
    scrollBarYPosition_Gesture.removeAllListeners()
    scrollBarYPosition_Gesture.addListener(({ value }) => {
      if (
        !checkForSnaps(value) &&
        // We don't want the scroll bar to go outside of our text viewer so we limit it to between 0 and the height of the text viewer.
        value >= 0 &&
        value <= layouts.current.windowHeight - scrollBarSize
      ) {
        isSnapped.current = false
        setScrollBarYPosition_Actual(value)
      }
    })
  }

  /**
   * Handles the state change of the scroll bar. Relevant states are BEGAN when the user starts dragging the scroll bar and END when the user stops dragging it.
   * @param {Object} nativeEvent - The state change event.
   */
  const onHandlerStateChange = ({ nativeEvent }) => {
    switch (nativeEvent.state) {
      case State.BEGAN:
        // Start some haptic feedback when dragging begins.
        Haptics.selectionAsync()

        // Set the general isScrolling to true since the text content is scrolling.
        setIsScrolling(true)

        // Prevent the scroll bar position from updating based on the scroll position of the text. In this case, we want the reverse to be true--the scroll position of the text should update based on the scroll bar position as it's dragged.
        setIsScrollBarDragging(true)

        // Extract the offset so that the scrolling position is persisted.
        scrollBarYPosition_Gesture.extractOffset()
        break
      case State.END:
        // Also start some haptic feedback when dragging ends.
        Haptics.selectionAsync()

        // Make the scroll bar position update based on the scroll position of the text now that we're done dragging.
        setIsScrollBarDragging(false)

        // Set a short timeout to set isScrolling to false. This is on a timeout so that the the state change always happens after the user finishes dragging.
        setTimeout(() => setIsScrolling(false), 50)

        // Flatten the offset so that the scrolling position is persisted.
        scrollBarYPosition_Gesture.flattenOffset()
        break
    }
  }

  /** Whenever the user drags the scroll bar, update the animated value stored in scrollBarYPosition_Gesture. */
  const onGestureEvent = event => {
    scrollBarYPosition_Gesture.setValue(event.nativeEvent.translationY)
  }

  /** Gets fired whenever the user scrolls the lesson text content. */
  const onScroll = ({ nativeEvent }) => {
    // console.log(`${Date.now()} onScroll firing.`)
    // Set the isScrolling variable to true if it isn't already.
    if (!isScrolling) setIsScrolling(true)

    // Check if the section header needs to be updated.
    if (!isSnapped.current)
      checkForSectionHeaderUpdates(
        nativeEvent.contentOffset.y < 0 ? 0 : nativeEvent.contentOffset.y
      )

    if (!isScrollBarDragging)
      // Update the gesture y position of the scroll bar. This will trigger the listener and update the actual scroll bar y position.
      scrollBarYPosition_Gesture.setValue(
        convertGlobalScrollPosToLocal(nativeEvent.contentOffset.y)
      )
  }

  /** useEffect function that continually refreshes the hideScrollBar timeout as the user scrolls. If the user stops scrolling, the scroll bar hides after 1.5 seconds. */
  useEffect(() => {
    if (isScrolling) {
      clearTimeout(hideScrollBarTimeout.current)
      Animated.spring(scrollBarXPosition, {
        toValue: isRTL ? -scrollBarSize / 2 : scrollBarSize / 2,
        duration: 400,
        useNativeDriver: true
      }).start()
    } else if (!isScrolling) {
      hideScrollBarTimeout.current = setTimeout(
        () =>
          Animated.spring(scrollBarXPosition, {
            // 1.1 so that the shadow isn't visible when the scroll bar is hidden.
            toValue: isRTL ? -scrollBarSize * 1.1 : scrollBarSize * 1.1,
            duration: 400,
            useNativeDriver: true
          }).start(),
        1500
      )
    }
  }, [isScrolling])

  /** useEffect function that triggers on every scroll bar position change only if the user is actively dragging the scroll bar. It scrolls the text area to the proportional location. */
  useEffect(() => {
    if (isScrollBarDragging) {
      // Scroll the text to the correct offset based off the scroll bar position.
      lessonTextContentRef.current.scrollTo({
        y: convertLocalScrollPosToGlobal(scrollBarYPosition_Actual),
        animated: false
      })
    }
  }, [scrollBarYPosition_Actual])

  /**
   * Checks if the section header needs to be updated based on the current scroll position.
   */
  const checkForSectionHeaderUpdates = scrollPosition => {
    // console.log(`${Date.now()} Checking for section header updates.`)
    // There's no section headers for book/audiobook lessons, so return if we're in one of those lessons.
    if (lessonType.includes('BookText')) return

    // Find the section that we're currently scrolling in by itereting through the sections and checking their offsets.
    var sectionIndex = -1
    do {
      // console.log(`${Date.now()} In the do-while.`)
      sectionIndex += 1
    } while (
      scrollPosition >= sectionOffsets.current[sectionIndex].globalOffset
    )
    var section = sectionOffsets.current[sectionIndex - 1]

    // If the title or subtitle of the section we're in are different from the current title and subtitle, change them.
    if (section !== currentSection) currentSection.current = section

    // Auto-complete lesson if text is scrolled 20% through the Application chapter.
    if (
      section.title === t.play &&
      t.play.application &&
      !isThisLessonComplete.current &&
      (scrollPosition - section.globalOffset) /
        (layouts.current.contentHeight - section.globalOffset) >
        0.2
    )
      markLessonAsComplete()
  }

  /** useEffect function that sets the isFullyRendered state to true once all of the layout states have been set correctly. */
  useEffect(() => {
    if (layouts.current.contentHeight && layouts.current.windowHeight) {
      !isFullyRendered && setIsFullyRendered(true)

      sectionOffsets.current = sectionOffsets.current.map(section => ({
        ...section,
        localOffset: convertGlobalScrollPosToLocal(section.globalOffset)
      }))

      currentSection.current = sectionOffsets.current[0]
    }
  }, [layouts.current, sectionOffsets.current])

  /**
   * Checks to see if the user is dragging the scroll bar close enough to the start of a section to "snap" to it. If it is, we snap to it.
   * @return {boolean} - Whether or not a section was snapped to.
   */
  const checkForSnaps = dragPosition => {
    if (!isScrollBarDragging) return
    // console.log(`${Date.now()} Checking for snaps`)
    // This keeps track of whether a section was snapped to in this runthrough of the check function. If we aren't snapped to anything, we should update the scroll bar position as normal.
    var didSnap = false

    sectionOffsets.current.forEach((section, index, array) => {
      // Check if our current drag position is within 15 pixels on either side of a section and a section that we want to snap to. We only snap to the Fellowship section, the Application section, and the first Scripture passage.
      if (
        section.isBigSection &&
        dragPosition < section.localOffset + 15 &&
        dragPosition > section.localOffset - 15
      ) {
        // If we're not actively snapped to something already...
        if (!isSnapped.current) {
          // If the section we're snapping to is different from the section we were last on, we need to update the section header text as well.
          if (section !== currentSection) currentSection.current = section

          // Set the isSnapped ref to true since we are actively snapped to a section.
          isSnapped.current = true

          // Give the user a little haptic feedback to indicate that they snapped to something.
          Haptics.impactAsync()
        }

        // Set the position of the scroll bar to the local offset, no matter what the position of the user's drag gesture. This is what gives it the "snap" effect.
        setScrollBarYPosition_Actual(section.localOffset)

        // Set didSnap to true since we snapped to a section.
        didSnap = true
      }
    })
    return didSnap
  }

  /*
    HELPER FUNCTIONS
  */

  /** Converts a global scroll offset (from 0 to the total height of the lesson text content) to a local one (from 0 to the height of the lesson text viewer window). */
  const convertGlobalScrollPosToLocal = globalPosition =>
    (globalPosition * (layouts.current.windowHeight - scrollBarSize)) /
    (layouts.current.contentHeight - layouts.current.windowHeight)

  /** Converts a local scroll offset (from 0 to the height of the lesson text viewer window) to a global one (from 0 to the total height of the lesson text content). */
  const convertLocalScrollPosToGlobal = localPosition =>
    (localPosition *
      (layouts.current.contentHeight - layouts.current.windowHeight)) /
    (layouts.current.windowHeight - scrollBarSize)

  /*
      ANIMATION FUNCTIONS
    */
  useEffect(() => {
    if (isScrollBarDragging)
      Animated.timing(floatingSectionLabelsOpacity, {
        toValue: 1,
        duration: 300
      }).start()
    else
      Animated.timing(floatingSectionLabelsOpacity, {
        toValue: 0,
        duration: 300
      }).start()
  }, [isScrollBarDragging])

  const setAndAnimateSectionHeaderText = (newTitle, newSubtitle) => {
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
      setSectionSubtitleText(newSubtitle)
      setRefreshSectionHeader(current => !current)
    })
  }

  useEffect(() => {
    currentSection.current &&
      setAndAnimateSectionHeaderText(
        currentSection.current.title,
        currentSection.current.subtitle
      )
  }, [currentSection.current])

  useEffect(() => {
    if (sectionTitleText !== null) {
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
        // setLessonTextContentHeight={setTextContentHeight}
        layouts={layouts}
        onScroll={onScroll}
        // setTextWindowHeight={setTextWindowHeight}
        isScrolling={isScrolling}
        setIsScrolling={setIsScrolling}
        sectionOffsets={sectionOffsets}
        // setSectionOffsets={setSectionOffsets}
        isFullyRendered={isFullyRendered}
        convertGlobalScrollPosToLocal={convertGlobalScrollPosToLocal}
      />
      <Animated.View
        style={[
          styles.floatingSectionLabelsContainer,
          {
            opacity: floatingSectionLabelsOpacity,
            zIndex: isScrollBarDragging ? 2 : -1,
            right: isRTL ? null : 0,
            left: isRTL ? 0 : null,
            flexDirection: isRTL ? 'row' : 'row-reverse'
          }
        ]}
      >
        {sectionOffsets.current.map((section, index) => {
          if (section.isBigSection)
            return (
              <FloatingSectionLabel
                key={index}
                section={section}
                isFullyRendered={isFullyRendered}
                textAreaHeight={layouts.current.windowHeight}
                scrollBarSize={scrollBarSize}
                setFloatingSectionLabelHeight={setFloatingSectionLabelHeight}
              />
            )
        })}
      </Animated.View>
      <TouchableOpacity
        style={[
          styles.scrollBarArea,
          {
            right: isRTL ? null : 0,
            left: isRTL ? 0 : null,
            alignItems: isRTL ? 'flex-start' : 'flex-end'
          }
        ]}
        activeOpacity={1}
        onPress={() => {
          setIsScrolling(true)
          setTimeout(() => setIsScrolling(false), 50)
        }}
      >
        {sectionOffsets.current.map((section, index) => (
          <View
            key={index}
            style={[
              styles.sectionDotIndicator,
              {
                top:
                  section.localOffset >= 0 && floatingSectionLabelHeight > 0
                    ? section.localOffset - 2.5 + floatingSectionLabelHeight / 2
                    : 0,
                right: isRTL ? null : 2,
                left: isRTL ? 2 : null
              }
            ]}
          />
        ))}
        <LessonTextScrollBar
          scrollBarPosition={scrollBarYPosition_Actual}
          scrollBarXPosition={scrollBarXPosition}
          scrollBarSize={scrollBarSize}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        />
      </TouchableOpacity>
      <LinearGradient
        colors={[colors.white, colors.white + '00']}
        start={[1, 1]}
        end={[1, 0]}
        style={styles.bottomFadeArea}
      />
      {/* <View
        style={{
          width: 20,
          height: 2,
          backgroundColor: 'red',
          position: 'absolute',
          top: 448
        }}
      /> */}
    </View>
  )
}
const styles = StyleSheet.create({
  floatingSectionLabelsContainer: {
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    overflow: 'visible'
  },
  scrollBarArea: {
    position: 'absolute',
    height: '100%',
    width: scrollBarSize / 2,
    zIndex: 3
  },
  sectionDotIndicator: {
    position: 'absolute',
    alignItems: 'center',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.chateau
  },
  bottomFadeArea: {
    position: 'absolute',
    bottom: 0,
    height: 20 * scaleMultiplier,
    width: '100%'
  }
})

export default connect(mapStateToProps)(LessonTextViewer)
