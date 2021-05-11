// import SvgUri from 'expo-svg-uri'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { chapters } from '../constants'
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

const HeaderBig = ({ text, font, isRTL }) => (
  <View
    style={{
      // paddingVertical: 10 * scaleMultiplier,
      // marginBottom: 10 * scaleMultiplier,
      // backgroundColor: colors.white,
      paddingHorizontal: gutterSize
      // height: 50
      // backgroundColor: 'green',
      // overflow: 'hidden'
    }}
    // onLayout={onLayout}
  >
    <Text
      style={[
        StandardTypography({ font, isRTL }, 'h2', 'Black', 'left', colors.tuna)
        // { fontSize: 22 * scaleMultiplier }
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
        { paddingHorizontal: gutterSize, marginBottom: 5 }
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

const gutterSize = 10

/**
 *
 */
const LessonTextContent = ({
  // Props passed from a parent component.
  thisLesson,
  lessonTextContentRef,
  setLessonTextContentHeight,
  onScroll,
  setTextAreaHeight,
  setIsScrolling,
  sectionOffsets,
  // setSectionOffsets,
  isFullyRendered,
  convertGlobalScrollPosToLocal,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  translations,
  isRTL
}) => {
  const setOffsets = (sectionName, chapter, nativeEvent) => {
    if (
      nativeEvent &&
      !sectionOffsets.current.some(section => section.name === sectionName)
    ) {
      sectionOffsets.current = [
        ...sectionOffsets.current,
        {
          name: sectionName,
          globalOffset: nativeEvent.layout.y,
          chapter: chapter
        }
      ].sort((a, b) => a.globalOffset - b.globalOffset)
    }
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
      onMomentumScrollEnd={() => setIsScrolling(false)}
      onScrollEndDrag={() => setIsScrolling(false)}
      // style={{ marginTop: 50 * scaleMultiplier }}
    >
      {/* Fellowship header. */}
      <View
        onLayout={({ nativeEvent }) =>
          setOffsets(
            translations.play.fellowship,
            chapters.FELLOWSHIP,
            nativeEvent
          )
        }
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
      {/* <View style={{ marginVertical: 5 }}>
        <WahaSeparator />
      </View> */}
      <HeaderBig font={font} isRTL={isRTL} text={translations.play.story} />
      {/* Scripture passages. */}
      <View
        onLayout={({ nativeEvent }) =>
          setOffsets(translations.play.story, chapters.STORY, nativeEvent)
        }
        style={styles.sectionContainer}
      />
      <View style={{ height: 5 }} />
      {thisLesson.scripture.map((scriptureChunk, index) => (
        <View
          key={index}
          onLayout={({ nativeEvent }) =>
            setOffsets(scriptureChunk.header, 0, nativeEvent)
          }
        >
          <HeaderSmall text={scriptureChunk.header} font={font} isRTL={isRTL} />
          <StandardText text={scriptureChunk.text} font={font} isRTL={isRTL} />
        </View>
      ))}
      {/* Scripture headers/text. */}
      {/* <View
        onLayout={({ nativeEvent }) =>
          setOffsets(translations.play.story, nativeEvent)
        }
      >
        {scriptureSection}
      </View> */}
      {/* Application header. */}
      <HeaderBig
        font={font}
        isRTL={isRTL}
        text={translations.play.application}
      />
      {/* Application questions. */}
      <View
        onLayout={({ nativeEvent }) =>
          setOffsets(
            translations.play.application,
            chapters.APPLICATION,
            nativeEvent
          )
        }
        style={{ paddingTop: 5 }}
      >
        {activeDatabase.questions[thisLesson.applicationType].map(
          (question, index) => (
            <View key={index}>
              <HeaderSmall
                text={
                  translations.play.question_header +
                  ' ' +
                  (index + 1).toString()
                }
                font={font}
                isRTL={isRTL}
              />
              <StandardText text={question + '\n'} font={font} isRTL={isRTL} />
            </View>
          )
        )}
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  sectionContainer: {
    // paddingTop: 20 * scaleMultiplier
  }
})

export default connect(mapStateToProps)(LessonTextContent)
