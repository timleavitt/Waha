// import SvgUri from 'expo-svg-uri'
import React, { useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import PagerView from 'react-native-pager-view'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
import LessonTextViewer from './LessonTextViewer'
import PageDots from './PageDots'
import PlayScreenTitle from './PlayScreenTitle'
import SVG from './SVG'

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
const AlbumArtSwiper = ({
  // Props passed from a parent component.
  lessonTextContentRef,
  iconName,
  thisLesson,
  playHandler,
  playFeedbackOpacity,
  playFeedbackZIndex,
  isMediaPlaying,
  // setSectionOffsets,
  sectionOffsets,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  translations,
  isRTL
}) => {
  /** Keeps track of whether or not the user is actively dragging the scroll bar or not. */
  const [isScrollBarDragging, setIsScrollBarDragging] = useState(false)

  /** Keeps track of whether the lesson text is being scrolled or not. This could be via scrolling normally or by dragging the scroll bar. */
  const [isScrolling, setIsScrolling] = useState(false)

  /** Keeps track of the active page of the album art swiper. */
  const [activePage, setActivePage] = useState(-1)

  const sectionTitle = useRef(translations.play.fellowship)

  const [sectionTitleText, setSectionTitleText] = useState(
    translations.play.fellowship
  )

  const [sectionSubtitleText, setSectionSubtitleText] = useState('')

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <PagerView
        style={{ flex: 1 }}
        scrollEnabled={!isScrollBarDragging && !isScrolling}
        onPageSelected={({ nativeEvent }) => {
          // if (activePage >= 0) Haptics.impactAsync()
          setActivePage(nativeEvent.position)
        }}
      >
        <View
          key='1'
          style={{
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flex: 1
          }}
        >
          {/* Title Area */}
          <PlayScreenTitle
            text={thisLesson.title}
            backgroundColor={colors.white}
          />
          {/* Album Art */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.porcelain,
              borderRadius: 20,
              overflow: 'hidden',
              flex: 1,
              aspectRatio: 1,
              maxWidth: Dimensions.get('window').width - 20,
              maxHeight: Dimensions.get('window').width - 20
            }}
          >
            <TouchableHighlight
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
                width: '100%',
                height: '100%'
              }}
              onPress={playHandler}
              underlayColor={colors.white + '00'}
              activeOpacity={1}
            >
              <SVG name={iconName} width='100%' height='100%' color='#1D1E20' />
            </TouchableHighlight>
            <Animated.View
              style={{
                position: 'absolute',
                opacity: playFeedbackOpacity,
                transform: [
                  {
                    scale: playFeedbackOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2, 1]
                    })
                  }
                ],
                zIndex: playFeedbackZIndex
              }}
            >
              <Icon
                name={isMediaPlaying ? 'play' : 'pause'}
                size={100 * scaleMultiplier}
                color={colors.white}
              />
            </Animated.View>
          </View>
        </View>
        <View key='2'>
          <View
            style={{
              width: '100%',
              backgroundColor: colors.white,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              // height: 50 * scaleMultiplier,
              paddingHorizontal: 10,
              paddingVertical: 10,
              // position: 'absolute',
              flexDirection: 'row',
              // top: 0,
              zIndex: 1
            }}
          >
            <Text
              style={StandardTypography(
                { font, isRTL },
                'h2',
                'Black',
                'left',
                colors.shark
              )}
            >
              {sectionTitleText}
            </Text>
            {sectionSubtitleText !== '' && (
              <Text
                style={[
                  StandardTypography(
                    { font, isRTL },
                    'h3',
                    'Regular',
                    'left',
                    colors.oslo
                  ),
                  { marginTop: 5 }
                ]}
              >
                {' / ' + sectionSubtitleText}
              </Text>
            )}
          </View>
          {/* <View style={{ height: 50 * scaleMultiplier }} /> */}
          <LessonTextViewer
            key='2'
            lessonTextContentRef={lessonTextContentRef}
            thisLesson={thisLesson}
            // setSectionOffsets={setSectionOffsets}
            sectionOffsets={sectionOffsets}
            isScrolling={isScrolling}
            setIsScrolling={setIsScrolling}
            isScrollBarDragging={isScrollBarDragging}
            setIsScrollBarDragging={setIsScrollBarDragging}
            sectionTitle={sectionTitle}
            setSectionTitleText={setSectionTitleText}
            setSectionSubtitleText={setSectionSubtitleText}
          />
        </View>
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

export default connect(mapStateToProps)(AlbumArtSwiper)
