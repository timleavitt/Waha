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
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

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
 *
 */
const LessonTextContent = ({
  // Props passed from a parent component.
  thisLesson,
  lessonType,
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
  const setOffsets = (
    sectionTitle,
    sectionSubtitle,
    isBigSection,
    nativeEvent
  ) => {
    if (
      nativeEvent &&
      !sectionOffsets.current.some(
        section =>
          section.title === sectionTitle && section.subtitle === sectionSubtitle
      )
    ) {
      sectionOffsets.current = [
        ...sectionOffsets.current,
        {
          title: sectionTitle,
          subtitle: sectionSubtitle,
          isBigSection: isBigSection,
          globalOffset: nativeEvent.layout.y
          // localOffset is set later.
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
      scrollEventThrottle={32}
      onMomentumScrollEnd={() => setIsScrolling(false)}
      onScrollEndDrag={() => setIsScrolling(false)}
      // style={{ marginTop: 50 * scaleMultiplier }}
    >
      {!lessonType.includes('BookText') ? (
        <View>
          {/* Fellowship header. */}
          <View
            onLayout={({ nativeEvent }) =>
              setOffsets(translations.play.fellowship, '', true, nativeEvent)
            }
          />
          {/* Fellowship questions. */}
          {activeDatabase.questions[thisLesson.fellowshipType].map(
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
                <StandardText
                  text={question + '\n'}
                  font={font}
                  isRTL={isRTL}
                />
              </View>
            )
          )}
          <HeaderBig
            onLayout={() => {}}
            font={font}
            isRTL={isRTL}
            text={translations.play.story}
          />
          {thisLesson.scripture.map((scriptureChunk, index) => (
            <View
              key={index}
              onLayout={({ nativeEvent }) => {
                var isBig = index === 0 ? true : false
                setOffsets(
                  translations.play.story,
                  scriptureChunk.header,
                  isBig,
                  nativeEvent
                )
              }}
            >
              <HeaderSmall
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
          <HeaderBig
            font={font}
            isRTL={isRTL}
            text={translations.play.application}
          />
          {/* Application questions. */}
          <View
            onLayout={({ nativeEvent }) =>
              setOffsets(translations.play.application, '', true, nativeEvent)
            }
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
                  <StandardText
                    text={question + '\n'}
                    font={font}
                    isRTL={isRTL}
                  />
                </View>
              )
            )}
          </View>
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
const styles = StyleSheet.create({
  sectionContainer: {
    // paddingTop: 20 * scaleMultiplier
  }
})

export default connect(mapStateToProps)(LessonTextContent)
