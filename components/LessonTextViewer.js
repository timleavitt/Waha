// import SvgUri from 'expo-svg-uri'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useMemo, useRef, useState } from 'react'
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
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

const scrollBarSize = 40 * scaleMultiplier

/**
 *
 */
const LessonTextViewer = ({
  // Props passed from a parent component.
  lessonTextContentRef,
  thisLesson,
  // setSectionOffsets,
  sectionOffsets,
  isScrolling,
  isScrollBarDragging,
  setIsScrolling,
  setIsScrollBarDragging,
  sectionTitle,
  setSectionTitleText,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  translations,
  isRTL
}) => {
  /** Keeps track of whether or not the scroll bar should be visible. */
  const [shouldShowScrollBar, setShouldShowScrollBar] = useState(false)

  /** Keeps track of the total height of the lesson text content. */
  const [lessonTextContentHeight, setLessonTextContentHeight] = useState(0)

  /** Keeps track of the height of the lesson text viewer. */
  const [lessonTextViewerHeight, setLessonTextViewerHeight] = useState(0)

  /** Keeps track of the y position of the scroll bar based on the gesture. */
  const scrollBarYPosition_Gesture = useRef(new Animated.Value(0)).current

  /** Keeps track of the actual y position of the scroll bar. */
  const [scrollBarYPosition_Actual, setScrollBarYPosition_Actual] = useState(0)

  /** Keeps track of the horizontal position of the scroll bar. It animates in and out. */
  const scrollBarXPosition = useRef(new Animated.Value(scrollBarSize)).current

  /** Holds a timeout function that hides the scroll bar after a few seconds. The timeout is reset whenever the user starts scrolling. */
  const hideScrollBarTimeout = useRef(null)

  /** Keeps track of whether or not the scroll bar is actively "snapped" to one of the text sections. */
  const isSnapped = useRef(false)

  /** Keeps track of the opacity of the section labels. */
  const floatingSectionLabelsOpacity = useRef(new Animated.Value(0)).current

  /** Keeps track of whether the various layout states have been set yet. */
  const [isFullyRendered, setIsFullyRendered] = useState(false)

  const numberOfSections = thisLesson.scripture.length + 2

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

  /** useEffect function that continually refreshes the hideScrollBar timeout as the user scrolls. If the user stops scrolling, the scroll bar hides after 1.5 seconds. */
  useEffect(() => {
    if (isScrolling) {
      clearTimeout(hideScrollBarTimeout.current)
      Animated.spring(scrollBarXPosition, {
        toValue: scrollBarSize / 2,
        duration: 400,
        useNativeDriver: true
      }).start()
    } else if (!isScrolling) {
      hideScrollBarTimeout.current = setTimeout(
        () =>
          Animated.spring(scrollBarXPosition, {
            // 1.1 so that the shadow isn't visible when the scroll bar is hidden.
            toValue: scrollBarSize * 1.1,
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
      // scrollBarPosition is the position of the scroll bar from 0 to the height of the text area - 50. The 50 is to account for the scroll bar not going out-of-bounds. We want to convert that to a number between 0 and the total height of the text content minus the text area height, since we never scroll past the bottom of the content. This is the offset we want to scroll the text area to whenever we drag the scroll bar.
      var offsetToScrollTo =
        (scrollBarYPosition_Actual *
          (lessonTextContentHeight - lessonTextViewerHeight)) /
        (lessonTextViewerHeight - scrollBarSize)

      // Scroll the text to the correct offset.
      lessonTextContentRef.current.scrollTo({
        y: offsetToScrollTo,
        animated: false
      })
    }
  }, [scrollBarYPosition_Actual])

  /** Gets fired whenever the user scrolls the lesson text content. */
  const onScroll = ({ nativeEvent }) => {
    // Set the isScrolling variable to true if it isn't already.
    if (!isScrolling) setIsScrolling(true)
    // If we're not currently dragging the scroll bar, we want to update its position as we scroll the text content.
    if (!isScrollBarDragging) {
      // We want to adjust the position of the scroll bar based on the current scroll position of the text area. currentScrollPosition goes from 0 to totalTextContentHeight. We want to convert that to a number between 0 and the text area height minus the size of the scroll bar. Again, the size of the scroll bar is to account for the scroll bar not going out-of-bounds.
      const currentScrollPosition = nativeEvent.contentOffset.y
      const textAreaHeight = nativeEvent.layoutMeasurement.height
      const totalTextContentHeight = nativeEvent.contentSize.height
      // Update the gesture y position of the scroll bar. This will trigger the listener and update the actual scroll bar y position.
      scrollBarYPosition_Gesture.setValue(
        (currentScrollPosition * (textAreaHeight - scrollBarSize)) /
          (totalTextContentHeight - textAreaHeight)
      )
    }
  }

  const convertGlobalScrollPosToLocal = globalPosition =>
    (globalPosition * (lessonTextViewerHeight - scrollBarSize)) /
    (lessonTextContentHeight - lessonTextViewerHeight)

  useEffect(() => {
    lessonTextContentHeight > 0 &&
      lessonTextViewerHeight > 0 &&
      sectionOffsets.current.length === numberOfSections &&
      setIsFullyRendered(true)

    console.log(sectionOffsets.current.length)
  }, [lessonTextContentHeight, sectionOffsets.current, lessonTextViewerHeight])

  /** Start listener for the position of the scroll bar position. */
  useEffect(() => {
    // We need the various layout states for this, so don't start the listener until they're all set.
    if (isFullyRendered) {
      // As we update the position of the scroll bar on screen, we want to update its state value as well. The state value is used for  The only change is that we don't want to update it if it goes out-of-bounds. This way, the user can't scroll before beginning of the content or passed the end of the content.

      scrollBarYPosition_Gesture.removeAllListeners()

      var localSectionOffsets = sectionOffsets.current.map(section => ({
        name: section.name,
        offset:
          (section.offset * (lessonTextViewerHeight - scrollBarSize)) /
          (lessonTextContentHeight - lessonTextViewerHeight)
      }))

      scrollBarYPosition_Gesture.addListener(({ value }) => {
        sectionOffsets.current.forEach((section, index, array) => {
          if (
            (value > convertGlobalScrollPosToLocal(section.offset) &&
              index !== array.length - 1 &&
              value < convertGlobalScrollPosToLocal(array[index + 1].offset)) ||
            (value > convertGlobalScrollPosToLocal(section.offset) &&
              index === array.length - 1)
          ) {
            if (sectionTitle.current !== section.name) {
              setSectionTitleText(section.name)
              sectionTitle.current = section.name
            }
          }
        })

        // TODO: make section title change upon snapping as well. Store the local offsets in the sectionOffsets array as well as the global. Then move logic to change the section title from the function above to all below.
        var snapped = false
        localSectionOffsets.forEach(section => {
          if (
            value < section.offset + 15 &&
            value > section.offset - 15 &&
            isScrollBarDragging
          ) {
            if (!isSnapped.current) {
              sectionTitle.current = section.name
              setSectionTitleText(section.name)
              Haptics.impactAsync()
              isSnapped.current = true
            }
            snapped = true

            setScrollBarYPosition_Actual(section.offset)
          }
          // else setScrollBarPosition(value | 0)
        })

        if (
          !snapped &&
          value >= 0 &&
          value <= lessonTextViewerHeight - scrollBarSize
        ) {
          setScrollBarYPosition_Actual(value | 0)
          isSnapped.current = false
        }
      })
    }
  }, [isFullyRendered, isScrollBarDragging])

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

  const getIndices = () => {
    var indices = []
    indices.push(1)
    thisLesson.scripture.forEach((scriptureChunk, index) => {
      indices.push(
        activeDatabase.questions[thisLesson.fellowshipType].length +
          2 +
          2 * index
      )
    })
    indices.push(
      activeDatabase.questions[thisLesson.fellowshipType].length +
        thisLesson.scripture.length * 2 +
        2
    )
    return indices
  }

  const sectionIndices = useMemo(() => getIndices(), [])

  return (
    <View style={{ flex: 1 }}>
      <LessonTextContent
        thisLesson={thisLesson}
        lessonTextContentRef={lessonTextContentRef}
        sectionIndices={sectionIndices}
        setLessonTextContentHeight={setLessonTextContentHeight}
        onScroll={onScroll}
        setTextAreaHeight={setLessonTextViewerHeight}
        setIsScrolling={setIsScrolling}
        sectionOffsets={sectionOffsets}
        // setSectionOffsets={setSectionOffsets}
        isFullyRendered={isFullyRendered}
        convertGlobalScrollPosToLocal={convertGlobalScrollPosToLocal}
      />
      <Animated.View
        style={[
          styles.floatingSectionLabelsContainer,
          { opacity: floatingSectionLabelsOpacity }
        ]}
      >
        {sectionOffsets.current.map((section, index) => (
          <FloatingSectionLabel
            key={index}
            section={section}
            totalTextContentHeight={lessonTextContentHeight}
            textAreaHeight={lessonTextViewerHeight}
            scrollBarSize={scrollBarSize}
          />
        ))}
      </Animated.View>
      <TouchableOpacity
        style={styles.scrollBarArea}
        activeOpacity={1}
        onPress={() => {
          clearTimeout(hideScrollBarTimeout.current)
          Animated.spring(scrollBarXPosition, {
            toValue: scrollBarSize / 2,
            duration: 400,
            useNativeDriver: true
          }).start()
          hideScrollBarTimeout.current = setTimeout(
            () =>
              Animated.spring(scrollBarXPosition, {
                // 1.1 so that the shadow isn't visible when the scroll bar is hidden.
                toValue: scrollBarSize * 1.1,
                duration: 400,
                useNativeDriver: true
              }).start(),
            1500
          )
        }}
      >
        {sectionOffsets.current.map((section, index) => (
          <View
            key={index}
            style={[
              styles.sectionDotIndicator,
              {
                top:
                  lessonTextContentHeight !== 0
                    ? (section.offset *
                        (lessonTextViewerHeight - scrollBarSize)) /
                        (lessonTextContentHeight - lessonTextViewerHeight) +
                      12.5 * scaleMultiplier
                    : 0
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
    </View>
  )
}
const styles = StyleSheet.create({
  floatingSectionLabelsContainer: {
    height: '100%',
    position: 'absolute',
    right: 0,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    overflow: 'visible'
  },
  scrollBarArea: {
    position: 'absolute',
    zIndex: 2,
    right: 0,
    height: '100%',
    alignItems: 'flex-end',
    width: scrollBarSize / 2
  },
  sectionDotIndicator: {
    position: 'absolute',
    alignItems: 'center',
    width: 5,
    height: 5,
    right: 2,
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
