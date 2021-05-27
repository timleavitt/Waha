// import SvgUri from 'expo-svg-uri'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { gutterSize, scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    font: getLanguageFont(activeGroupSelector(state).language),
    t: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

/*
  A simple set of 3 components to display different parts of the lesson text.
*/

const HeaderBig = ({ text, font, isRTL, onLayout }) => (
  <View
    style={{
      marginBottom: 10 * scaleMultiplier,
      paddingHorizontal: gutterSize
    }}
    onLayout={onLayout}
  >
    <Text
      style={[
        StandardTypography({ font, isRTL }, 'h2', 'Black', 'left', colors.tuna)
      ]}
    >
      {text}
    </Text>
  </View>
)

const HeaderSmall = ({ text, font, isRTL }) => (
  <View>
    <Text
      style={[
        StandardTypography(
          { font, isRTL },
          'h3',
          'Regular',
          'left',
          colors.oslo
        ),
        { paddingHorizontal: gutterSize, marginVertical: 5 * scaleMultiplier }
      ]}
    >
      {text}
    </Text>
  </View>
)

const StandardText = ({ text, font, isRTL }) => (
  <View>
    <Text
      style={[
        StandardTypography(
          { font, isRTL },
          'h3',
          'Regular',
          'left',
          colors.shark
        ),
        {
          zIndex: 0,
          paddingHorizontal: gutterSize
        }
      ]}
    >
      {text}
    </Text>
  </View>
)

/**
 * Displays all of the text for the different lesson sections.
 * @param {ref} lessonTextContentRef - The ref for the carousel component of the AlbumArtSwiper. Used to manually jump to specific pages.
 * @param {Object} thisLesson - The object for the lesson that the user has selected to do.
 * @param {string} lessonType - The type of the current lesson. See lessonTypes in constants.js.
 * @param {Object} layouts - The heights of the text content and text window.
 * @param {Function} onScroll - Function that triggers on every scroll event.
 * @param {Object[]} sectionOffsets - Stores the different sections of the lesson text and their global scroll offset.
 */
const LessonTextContent = ({
  // Props passed from a parent component.
  lessonTextContentRef,
  thisLesson,
  lessonType,
  layouts,
  onScroll,
  sectionOffsets,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  t,
  isRTL
}) => {
  /**
   * Adds a section and its offset in the sectionOffsets array.
   * @param {string} sectionTitle
   * @param {Object} nativeEvent
   */
  const setOffsets = (sectionTitle, nativeEvent) => {
    if (
      nativeEvent &&
      // Don't add duplicates.
      !sectionOffsets.current.some(section => section.title === sectionTitle)
    ) {
      sectionOffsets.current = [
        ...sectionOffsets.current,
        {
          title: sectionTitle,
          globalOffset: nativeEvent.layout.y
        }
        // Sort by the offsets so every section is in order.
      ].sort((a, b) => a.globalOffset - b.globalOffset)
    }
  }

  /** Adds the text window height to the layouts object. */
  const onLayout = event => {
    if (event.nativeEvent)
      layouts.current = {
        ...layouts.current,
        windowHeight: event.nativeEvent.layout.height
      }
  }

  return (
    <ScrollView
      ref={lessonTextContentRef}
      onScroll={onScroll}
      onContentSizeChange={(width, height) =>
        (layouts.current = {
          ...layouts.current,
          contentHeight: height
        })
      }
      onLayout={onLayout}
      removeClippedSubviews={false}
      scrollEventThrottle={256}
    >
      {!lessonType.includes('BookText') ? (
        <View>
          {/* Used to get the offset for the Fellowship section. */}
          <View
            onLayout={({ nativeEvent }) =>
              setOffsets(t.play && t.play.fellowship, nativeEvent)
            }
          />
          {/* Fellowship questions. */}
          {activeDatabase.questions[thisLesson.fellowshipType].map(
            (question, index) => (
              <View key={index}>
                <HeaderSmall
                  text={
                    t.play && t.play.question + ' ' + (index + 1).toString()
                  }
                  font={font}
                  isRTL={isRTL}
                />
                <StandardText
                  text={question + '\n'}
                  font={font}
                  isRTL={isRTL}
                />
              </View>
            )
          )}
          {/* Scripture passages. */}
          {thisLesson.scripture.map((scriptureChunk, index) => (
            <View
              key={index}
              onLayout={({ nativeEvent }) => {
                setOffsets(scriptureChunk.header, nativeEvent)
              }}
            >
              <HeaderBig
                text={scriptureChunk.header}
                font={font}
                isRTL={isRTL}
              />
              <StandardText
                text={scriptureChunk.text}
                font={font}
                isRTL={isRTL}
              />
            </View>
          ))}
          {/* Header for application section. */}
          <HeaderBig
            onLayout={({ nativeEvent }) =>
              setOffsets(t.play && t.play.application, nativeEvent)
            }
            font={font}
            isRTL={isRTL}
            text={t.play && t.play.application}
          />
          {/* Application questions. */}
          {activeDatabase.questions[thisLesson.applicationType].map(
            (question, index) => (
              <View key={index}>
                <HeaderSmall
                  text={
                    t.play && t.play.question + ' ' + (index + 1).toString()
                  }
                  font={font}
                  isRTL={isRTL}
                />
                <StandardText
                  text={question + '\n'}
                  font={font}
                  isRTL={isRTL}
                />
              </View>
            )
          )}
        </View>
      ) : (
        <View style={{ paddingTop: 20 * scaleMultiplier }}>
          {thisLesson.text.split('\n').map((paragraph, index) => (
            <StandardText
              key={index}
              font={font}
              isRTL={isRTL}
              text={paragraph + '\n'}
            />
          ))}
        </View>
      )}
    </ScrollView>
  )
}
const styles = StyleSheet.create({})

export default connect(mapStateToProps)(LessonTextContent)
