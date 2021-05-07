// import SvgUri from 'expo-svg-uri'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { useEffect } from 'react/cjs/react.development'
import { scaleMultiplier } from '../constants'
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
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

const HeaderBig = ({ text, font, isRTL, onLayout }) => (
  <View
    style={{
      paddingVertical: 10 * scaleMultiplier,
      marginBottom: 10 * scaleMultiplier,
      backgroundColor: colors.white,
      paddingHorizontal: gutterSize,
      height: 50
      // backgroundColor: 'green',
      // overflow: 'hidden'
    }}
    onLayout={onLayout}
  >
    <Text
      style={[
        StandardTypography({ font, isRTL }, 'h2', 'Black', 'left', colors.shark)
        // { fontSize: 22 * scaleMultiplier }
      ]}
    >
      {text}
    </Text>
  </View>
)

const HeaderSmall = ({ text, font, isRTL }) => (
  <View style={{ zIndex: 0 }}>
    <Text
      style={[
        StandardTypography({ font, isRTL }, 'h3', 'Bold', 'left', colors.shark),
        {
          paddingHorizontal: gutterSize
        }
      ]}
    >
      {text}
    </Text>
  </View>
)

const StandardText = ({ text, font, isRTL }) => (
  <View style={{ zIndex: 0 }}>
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

const gutterSize = 10

/**
 *
 */
const LessonTextContent = ({
  // Props passed from a parent component.
  thisLesson,
  lessonTextContentRef,
  sectionIndices,
  setLessonTextContentHeight,
  onScroll,
  setTextAreaHeight,
  setIsScrolling,
  sectionOffsets,
  setSectionOffsets,
  isFullyRendered,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  translations,
  isRTL
}) => {
  const [numPassages, setNumPassages] = useState(thisLesson.scripture.length)
  const [numFellowshipQuestions, setNumFellowshipQuestions] = useState(
    activeDatabase.questions[thisLesson.fellowshipType].length
  )
  const [numApplicationQuestions, setNumApplicationQuestions] = useState(
    activeDatabase.questions[thisLesson.applicationType].length
  )

  const [stickyIndices, setStickyIndices] = useState()

  useEffect(() => {
    getIndices()
  }, [])

  const getScriptureSection = () => {
    var scriptureSection = []
    thisLesson.scripture.forEach((scriptureChunk, index) => {
      scriptureSection.push(
        <View
          key={index}
          onLayout={({ nativeEvent }) => {
            if (
              nativeEvent &&
              !sectionOffsets.some(
                section => section.name === scriptureChunk.header
              )
            )
              setSectionOffsets(current =>
                [
                  ...current,
                  {
                    name: scriptureChunk.header,
                    offset: nativeEvent.layout.y
                  }
                ].sort((a, b) => a.offset - b.offset)
              )
          }}
        />
      )
      scriptureSection.push(
        <StandardText
          text={scriptureChunk.text}
          font={font}
          isRTL={isRTL}
          key={index + 0.5}
        />
      )
    })
    return scriptureSection
  }

  const scriptureSection = useMemo(() => getScriptureSection(), [])

  const getIndices = () => {
    var indices = []
    indices.push(0)
    thisLesson.scripture.forEach((scriptureChunk, index) => {
      indices.push(
        activeDatabase.questions[thisLesson.fellowshipType].length +
          1 +
          2 * index
      )
    })
    indices.push(
      activeDatabase.questions[thisLesson.fellowshipType].length +
        thisLesson.scripture.length * 2 +
        1
    )
    setStickyIndices(indices)
  }

  return (
    <ScrollView
      ref={lessonTextContentRef}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      onContentSizeChange={(width, height) =>
        setLessonTextContentHeight(height)
      }
      onLayout={({ nativeEvent }) => {
        if (nativeEvent) setTextAreaHeight(nativeEvent.layout.height)
      }}
      removeClippedSubviews={false}
      scrollEventThrottle={64}
      stickyHeaderIndices={isFullyRendered ? stickyIndices : [0]}
      onMomentumScrollEnd={() => setIsScrolling(false)}
      onScrollEndDrag={() => setIsScrolling(false)}
    >
      {/* Fellowship header. */}
      <View
        onLayout={({ nativeEvent }) => {
          if (
            nativeEvent &&
            !sectionOffsets.some(
              section => section.name === translations.play.fellowship
            )
          )
            setSectionOffsets(current =>
              [
                ...current,
                {
                  name: translations.play.fellowship,
                  offset: nativeEvent.layout.y
                }
              ].sort((a, b) => a.offset - b.offset)
            )
        }}
      />
      {/* Fellowship questions. */}
      {activeDatabase.questions[thisLesson.fellowshipType].map(
        (question, index) => (
          <View key={index}>
            <HeaderSmall
              text={
                translations.play.question_header + ' ' + (index + 1).toString()
              }
              font={font}
              isRTL={isRTL}
            />
            <StandardText text={question + '\n'} font={font} isRTL={isRTL} />
          </View>
        )
      )}
      {/* Scripture headers/text. */}
      {scriptureSection}
      {/* Application header. */}
      <View
        onLayout={({ nativeEvent }) => {
          if (
            nativeEvent &&
            !sectionOffsets.some(
              section => section.name === translations.play.application
            )
          )
            setSectionOffsets(current =>
              [
                ...current,
                {
                  name: translations.play.application,
                  offset: nativeEvent.layout.y
                }
              ].sort((a, b) => a.offset - b.offset)
            )
        }}
      />
      {/* Application questions. */}
      {activeDatabase.questions[thisLesson.applicationType].map(
        (question, index) => (
          <View key={index}>
            <HeaderSmall
              text={
                translations.play.question_header + ' ' + (index + 1).toString()
              }
              font={font}
              isRTL={isRTL}
            />
            <StandardText text={question + '\n'} font={font} isRTL={isRTL} />
          </View>
        )
      )}
    </ScrollView>
  )
}
const styles = StyleSheet.create({})

export default connect(mapStateToProps)(LessonTextContent)
