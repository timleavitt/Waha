// import SvgUri from 'expo-svg-uri'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { connect } from 'react-redux'
import SwipeBar from '../components/SwipeBar'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
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
  albumArtSwiperRef,
  iconName,
  thisLesson,
  playHandler,
  playFeedbackOpacity,
  playFeedbackZIndex,
  isMediaPlaying,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  translations,
  isRTL
}) => {
  /** Keeps track of whether the current carousel pane is the middle one or not. */
  const [isMiddle, setIsMiddle] = useState(true)

  /** Keeps track of the layout and margin width of the album art swiper. Only changed if we're on a tablet to help with scaling. */
  const [layoutWidth, setLayoutWidth] = useState(60)
  const [marginWidth, setMarginWidth] = useState(80)

  /** Keeps track of the opacities for the middle and side swipe bars. */
  const [middleSwipeBarOpacity, setMiddleSwipeBarOpacity] = useState(
    new Animated.Value(0)
  )
  const [sideSwipeBarOpacity, setSideSwipeBarOpacity] = useState(
    new Animated.Value(0.8)
  )

  /** useEffect function that sets the layout and margin width if we're on a tablet. */
  useEffect(() => {
    if (Dimensions.get('window').width >= 600) {
      setLayoutWidth(240)
      setMarginWidth(200)
    }
  }, [])

  /**
   * Gets the text data for the left or right carousel pane.
   * @param {number} key - The pane to get the text data for. 0 for the Fellowship/Application questions or 2 for the Scripture.
   * @return {Object[]} - An array of objects containing the text data.
   */
  function getTextData (key) {
    if (key === '2') {
      if (thisLesson.scripture) return thisLesson.scripture
      else return null
    } else {
      if (thisLesson.fellowshipType) {
        var combinedQuestionList = activeDatabase.questions[
          thisLesson.fellowshipType
        ]
          // Combine Fellowship and Application questions into one.
          .concat(activeDatabase.questions[thisLesson.applicationType])
        var updatedQuestionArray = []
        combinedQuestionList.forEach((question, index) => {
          var temp = {}
          temp['header'] =
            translations.play.question_header + ' ' + (index + 1).toString()
          temp['text'] = question + '\n'
          updatedQuestionArray.push(temp)
        })
        return updatedQuestionArray
      } else return null
    }
  }

  /** useEffect function that updates the swipe bar opacities whenever the active pane of the carousel changes. If we're on the middle pane (which has the album art), we want to see the swipe bars on the side panes indicating that they can be swiped to. Otherwise, we want to chose them on the middle pane. */
  useEffect(() => {
    if (isMiddle)
      Animated.sequence([
        Animated.timing(middleSwipeBarOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(sideSwipeBarOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ]).start()
    else
      Animated.sequence([
        Animated.timing(sideSwipeBarOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(middleSwipeBarOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ]).start()
  }, [isMiddle])

  /**
   * Renders one of the panes of the album art.
   * @param {Object} item - The data for the pane to render.
   */
  const renderAlbumArtItem = ({ item }) => {
    if (item.type === 'text') {
      return (
        <View
          style={[
            styles.albumArtContainer,
            {
              width: Dimensions.get('window').width - marginWidth,
              height: Dimensions.get('window').width - marginWidth
            }
          ]}
        >
          <SwipeBar
            isMiddle={false}
            side='left'
            opacity={sideSwipeBarOpacity}
          />
          <SwipeBar
            isMiddle={false}
            side='right'
            opacity={sideSwipeBarOpacity}
          />
          <FlatList
            data={getTextData(item.key)}
            renderItem={renderTextContent}
            initialNumToRender={3}
            keyExtractor={item => item.header}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={
              item.key === '2'
                ? () => (
                    <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                      <Text
                        style={StandardTypography(
                          { font, isRTL },
                          'd',
                          'Regular',
                          'center',
                          colors.chateau
                        )}
                      >
                        {translations.play.copyright_for_text + '\n'}
                      </Text>
                      <Text
                        style={StandardTypography(
                          { font, isRTL },
                          'd',
                          'Regular',
                          'center',
                          colors.chateau
                        )}
                      >
                        {translations.play.copyright_for_audio}
                      </Text>
                    </View>
                  )
                : null
            }
          />
        </View>
      )
    } else {
      return (
        <View
          style={[
            styles.albumArtContainer,
            {
              width: Dimensions.get('window').width - marginWidth,
              height: Dimensions.get('window').width - marginWidth
            }
          ]}
        >
          <SwipeBar
            isMiddle={true}
            side='left'
            opacity={middleSwipeBarOpacity}
          />
          <SwipeBar
            isMiddle={true}
            side='right'
            opacity={middleSwipeBarOpacity}
          />
          <View
            style={{
              zIndex: 1,
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TouchableHighlight
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={playHandler}
              underlayColor={colors.white + '00'}
              activeOpacity={1}
            >
              <SVG
                name={item.svgName}
                width={Dimensions.get('window').width - marginWidth}
                height={Dimensions.get('window').width - marginWidth}
                color='#1D1E20'
              />
              {/* <SvgUri
                source={{
                  uri:
                    ''
                }}
                width={Dimensions.get('window').width - marginWidth}
                height={Dimensions.get('window').width - marginWidth}
                // fill={fullyCompleted ? colors.chateau : colors.shark}
                fill='#1D1E20'
                fillAll
              /> */}
            </TouchableHighlight>
          </View>
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
      )
    }
  }

  /**
   * Renders a piece of text content for the text panes.
   * @param {Object[]} item - The piece of text to render.
   */
  const renderTextContent = ({ item }) => (
    <View style={{ paddingHorizontal: 20 }}>
      <Text
        style={StandardTypography(
          { font, isRTL },
          'h3',
          'Bold',
          'left',
          colors.shark
        )}
      >
        {item.header}
      </Text>
      <Text
        style={StandardTypography(
          { font, isRTL },
          'h3',
          'Regular',
          'left',
          colors.shark
        )}
      >
        {item.text}
      </Text>
    </View>
  )

  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Carousel
        data={[
          {
            key: '0',
            type: 'text'
          },
          {
            key: '1',
            type: 'image',
            svgName: iconName
          },
          {
            key: '2',
            type: 'text'
          }
        ]}
        renderItem={renderAlbumArtItem}
        ref={albumArtSwiperRef}
        itemWidth={Dimensions.get('window').width - marginWidth}
        sliderWidth={Dimensions.get('window').width}
        itemHeight={Dimensions.get('window').width - marginWidth}
        sliderHeight={Dimensions.get('window').width}
        firstItem={1}
        removeClippedSubviews={false}
        lockScrollWhileSnapping
        onBeforeSnapToItem={slideIndex => {
          if (slideIndex === 1) setIsMiddle(true)
          else setIsMiddle(false)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  albumArtContainer: {
    borderRadius: 20,
    backgroundColor: colors.porcelain,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.chateau,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(mapStateToProps)(AlbumArtSwiper)
