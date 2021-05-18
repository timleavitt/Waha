// import SvgUri from 'expo-svg-uri'
import React, { useRef, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import PagerView from 'react-native-pager-view'
import { connect } from 'react-redux'
import { lessonTypes, scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'
import AlbumArt from './AlbumArt'
import LessonTextSectionHeader from './LessonTextSectionHeader'
import LessonTextViewer from './LessonTextViewer'
import PageDots from './PageDots'
import PlayScreenTitle from './PlayScreenTitle'

function mapStateToProps (state) {
  return {
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    font: getLanguageFont(activeGroupSelector(state).language),
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

/**
 * A component that shows the album art for a lesson as well as the text on either side of it in a swipable carousel.
 * @param {ref} albumArtSwiperRef - The ref for the carousel component of the AlbumArtSwiper. Used to manually jump to specific pages.
 * @param {string} iconName - The name of the icon associated with the set this lesson is a part of.
 * @param {Function} playHandler - Plays/pauses a lesson. Needed because the user can tap on the album art pane to play/pause the lesson.
 * @param {number} playFeedbackOpacity - Opacity for the play/pause animation feedback that appears whenever the lesson is played or paused.
 * @param {number} playFeedbackZIndex - Z-index for the play/pause animation feedback that appears whenever the lesson is played or paused.
 * @param {boolean} isMediaPlaying - Whether the current media (audio or video) is currently playing.
 */
const PlayScreenSwiper = ({
  // Props passed from a parent component.
  lessonTextContentRef,
  iconName,
  thisLesson,
  lessonType,
  playHandler,
  playFeedbackOpacity,
  playFeedbackZIndex,
  isMediaPlaying,
  sectionOffsets,
  markLessonAsComplete,
  isThisLessonComplete,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  translations,
  isRTL
}) => {
  /** Keeps track of whether or not the user is actively dragging the scroll bar or not. */
  // const isScrollBarDragging = useRef(false)
  const [isScrollBarDragging, setIsScrollBarDragging] = useState(false)

  /** Keeps track of whether the lesson text is being scrolled or not. This could be via scrolling normally or by dragging the scroll bar. */
  // const isScrolling = useRef(false)
  const [isScrolling, setIsScrolling] = useState(false)

  /** Keeps track of the active page of the album art swiper. */
  const [activePage, setActivePage] = useState(0)

  const sectionTitle = useRef('')

  const [sectionTitleText, setSectionTitleText] = useState(
    translations.play.fellowship
  )

  const [sectionSubtitleText, setSectionSubtitleText] = useState('')

  const sectionHeaderOpacity = useRef(new Animated.Value(1)).current
  const sectionHeaderYTransform = useRef(new Animated.Value(0)).current

  const pages = [
    <View
      key='1'
      style={{
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      {/* Title Area */}
      <PlayScreenTitle text={thisLesson.title} backgroundColor={colors.white} />
      {/* Album Art */}
      <AlbumArt
        iconName={iconName}
        playHandler={playHandler}
        playFeedbackOpacity={playFeedbackOpacity}
        playFeedbackZIndex={playFeedbackZIndex}
        isMediaPlaying={isMediaPlaying}
      />
    </View>,
    <View key='2' style={{ width: '100%', height: '100%' }}>
      {!lessonType.includes('BookText') ? (
        // Standard Page used for most lessons.
        <View style={{ flex: 1 }}>
          <LessonTextSectionHeader
            sectionHeaderOpacity={sectionHeaderOpacity}
            sectionHeaderYTransform={sectionHeaderYTransform}
            sectionTitleText={sectionTitleText}
            sectionSubtitleText={sectionSubtitleText}
          />
          <LessonTextViewer
            lessonTextContentRef={lessonTextContentRef}
            thisLesson={thisLesson}
            lessonType={lessonType}
            sectionOffsets={sectionOffsets}
            isScrolling={isScrolling}
            setIsScrolling={setIsScrolling}
            isScrollBarDragging={isScrollBarDragging}
            setIsScrollBarDragging={setIsScrollBarDragging}
            sectionTitleText={sectionTitleText}
            sectionSubtitleText={sectionSubtitleText}
            setSectionTitleText={setSectionTitleText}
            setSectionSubtitleText={setSectionSubtitleText}
            sectionTitleOpacity={sectionHeaderOpacity}
            sectionTitleYTransform={sectionHeaderYTransform}
            markLessonAsComplete={markLessonAsComplete}
            isThisLessonComplete={isThisLessonComplete}
          />
        </View>
      ) : (
        // Altered page used only for book/audiobook lessons.
        <LessonTextViewer
          key='2'
          lessonTextContentRef={lessonTextContentRef}
          thisLesson={thisLesson}
          lessonType={lessonType}
          sectionOffsets={sectionOffsets}
          isScrolling={isScrolling}
          setIsScrolling={setIsScrolling}
          isScrollBarDragging={isScrollBarDragging}
          setIsScrollBarDragging={setIsScrollBarDragging}
        />
      )}
    </View>
  ]

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <PagerView
        style={{ flex: 1 }}
        initialPage={
          // The page order is reversed for RTL languages, so we need to start on the second page instead of the first page. Also, we want to start on the text page for book lessons since the user's only option is to read the text.
          lessonType === lessonTypes.BOOK ? (isRTL ? 0 : 1) : isRTL ? 1 : 0
        }
        scrollEnabled={!isScrollBarDragging.current && !isScrolling.current}
        onPageSelected={({ nativeEvent }) => {
          setActivePage(nativeEvent.position)
        }}
      >
        {isRTL ? pages.reverse() : pages}
      </PagerView>
      <View style={styles.pageDotsContainer}>
        <PageDots numDots={2} activeDot={activePage} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  albumArtContainer: {
    borderRadius: 20,
    backgroundColor: colors.geyser,
    overflow: 'hidden',
    // borderWidth: 4,
    // borderColor: colors.chateau,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10 * scaleMultiplier
  },
  pageDotsContainer: {
    width: '100%',
    height: 40 * scaleMultiplier,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
})

export default connect(mapStateToProps)(PlayScreenSwiper)
