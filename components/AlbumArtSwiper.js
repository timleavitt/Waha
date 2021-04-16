// import SvgUri from 'expo-svg-uri'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import PagerView from 'react-native-pager-view'
import TextTicker from 'react-native-text-ticker'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
import SVG from './SVG'

const HeaderBig = ({ text, font, isRTL, onLayout }) => (
  <View
    style={{
      paddingVertical: 10 * scaleMultiplier,
      marginBottom: 10 * scaleMultiplier,
      // marginTop: 5 * scaleMultiplier,
      // marginHorizontal: 10,
      backgroundColor: colors.white,
      paddingHorizontal: 20
      // borderRadius: 20
      // borderBottomLeftRadius: 20,
      // borderBottomRightRadius: 20
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
    {/* <View
      style={{
        width: '100%',
        height: 2,
        backgroundColor: colors.chateau + '50'
      }}
    /> */}
  </View>
)

const HeaderSmall = ({ text, font, isRTL }) => (
  <Text
    style={[
      StandardTypography({ font, isRTL }, 'h3', 'Bold', 'left', colors.shark),
      {
        paddingHorizontal: 20
      }
    ]}
  >
    {text}
  </Text>
)

const StandardText = ({ text, font, isRTL }) => (
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
        paddingHorizontal: 20
      }
    ]}
  >
    {text}
  </Text>
)

const scrollBarSize = 35 * scaleMultiplier

function mapStateToProps (state) {
  return {
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    font: getLanguageFont(activeGroupSelector(state).language),
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

const AlbumArtSwiper = ({
  // Props passed from a parent component.
  textAreaRef,
  iconName,
  thisLesson,
  playHandler,
  playOpacity,
  animationZIndex,
  isMediaPlaying,
  setSectionOffsets,
  sectionOffsets,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  translations,
  isRTL
}) => {
  const [layoutWidth, setLayoutWidth] = useState(60)
  const [marginWidth, setMarginWidth] = useState(80)

  const [titleBackgroundColor, setTitleBackgroundColor] = useState(colors.white)

  const [shouldShowScrollBar, setShouldShowScrollBar] = useState(false)
  const [totalTextContentHeight, setTotalTextContentHeight] = useState(0)
  const [textAreaHeight, setTextAreaHeight] = useState(0)
  const [shouldUpdateScrollBar, setShouldUpdateScrollBar] = useState(true)

  const [scrollBarPosition, setScrollBarPosition] = useState(0)

  const scrollBarYPosition = useRef(new Animated.Value(0)).current

  const [activePage, setActivePage] = useState(0)

  // const [sectionOffsets, setSectionOffsets] = useState([])

  const scrollBarXPosition = useRef(new Animated.Value(scrollBarSize)).current

  const [isScrolling, setIsScrolling] = useState(false)

  const lastScrollPosition = useRef(0)

  const timeoutScrollBar = useRef(null)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        scrollBarYPosition.setValue(gesture.dy)
      },
      onPanResponderGrant: (event, gesture) => {
        setIsScrolling(true)
        setShouldUpdateScrollBar(false)
        scrollBarYPosition.extractOffset()
        scrollBarYPosition.setValue(0)
      },
      onPanResponderRelease: () => {
        setShouldUpdateScrollBar(true)
        setTimeout(() => setIsScrolling(false), 50)
        scrollBarYPosition.flattenOffset()
      }
    })
  ).current

  useEffect(() => {
    if (isScrolling) {
      clearTimeout(timeoutScrollBar.current)
      Animated.spring(scrollBarXPosition, {
        toValue: scrollBarSize / 2,
        duration: 400,
        useNativeDriver: true
      }).start()
    } else if (!isScrolling) {
      timeoutScrollBar.current = setTimeout(
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

  useEffect(() => {
    console.log(shouldShowScrollBar)
  }, [shouldShowScrollBar])

  /** useEffect function that triggers on every scroll bar position change only if the user is actively draggin the scroll bar. It scrolls the text area to the proportional location. */
  useEffect(() => {
    if (!shouldUpdateScrollBar) {
      // scrollBarPosition is the position of the scroll bar from 0 to the height of the text area - 50. The 50 is to account for the scroll bar not going out-of-bounds. We want to convert that to a number between 0 and the total height of the text content minus the text area height, since we never scroll past the bottom of the content. This is the offset we want to scroll the text area to whenever we drag the scroll bar.
      var offsetToScrollTo =
        (scrollBarPosition * (totalTextContentHeight - textAreaHeight)) /
        (textAreaHeight - scrollBarSize)
      textAreaRef.current.scrollTo({ y: offsetToScrollTo, animated: false })
    }
  }, [scrollBarPosition])

  /** Gets fired whenever the user scrolls the text area content. */
  const onScroll = ({ nativeEvent }) => {
    if (!isScrolling) setIsScrolling(true)

    // console.log(`${Date.now()} Calling onScroll.`)

    // If we're not currently dragging the scroll bar, we want to update its position as we scroll the text content.
    if (shouldUpdateScrollBar) {
      // We want to adjust the position of the scroll bar based on the current scroll position of the text area. currentScrollPosition goes from 0 to totalTextContentHeight. We want to convert that to a number between 0 and the text area height - 50. Again, the 50 is to account for the scroll bar not going out-of-bounds. This will be the position of the scroll bar.

      const currentScrollPosition = nativeEvent.contentOffset.y
      const textAreaHeight = nativeEvent.layoutMeasurement.height
      const totalTextContentHeight = nativeEvent.contentSize.height

      scrollBarYPosition.setValue(
        (currentScrollPosition * (textAreaHeight - scrollBarSize)) /
          (totalTextContentHeight - textAreaHeight)
      )
    }
  }

  /** Start listener for the position of the scroll bar position. */
  useEffect(() => {
    // Since we need the height of the text area for the listener, we don't want to start it until that value has been set.
    if (textAreaHeight > 0)
      // As we update the position of the scroll bar on screen, we want to update its state value as well. The state value is used for  The only change is that we don't want to update it if it goes out-of-bounds. This way, the user can't scroll before beginning of the content or passed the end of the content.
      scrollBarYPosition.addListener(({ value }) => {
        // console.log(value)
        if (value >= 0 && value <= textAreaHeight)
          setScrollBarPosition(value | 0)
      })
  }, [textAreaHeight])

  const getScriptureSection = () => {
    var scriptureSection = []
    thisLesson.scripture.forEach((scriptureChunk, index) => {
      scriptureSection.push(
        <HeaderBig
          key={index}
          onLayout={({ nativeEvent }) => {
            if (nativeEvent)
              setSectionOffsets(current => [
                ...current,
                {
                  name: scriptureChunk.header,
                  offset: nativeEvent.layout.y
                }
              ])
          }}
          text={scriptureChunk.header}
          font={font}
          isRTL={isRTL}
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
    return indices
  }

  const sectionIndices = useMemo(() => getIndices(), [])

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        style={{ flex: 1 }}
        scrollEnabled={shouldUpdateScrollBar}
        onPageSelected={({ nativeEvent }) =>
          setActivePage(nativeEvent.position)
        }
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
          <View style={styles.titleContainer}>
            <TextTicker
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Black',
                  'center',
                  colors.shark
                ),
                { paddingHorizontal: 20 }
              ]}
              marqueeDelay={2000}
              bounceSpeed={300}
              isRTL={isRTL}
            >
              {thisLesson.title}
            </TextTicker>
            <LinearGradient
              colors={[titleBackgroundColor, titleBackgroundColor + '00']}
              start={[0, 1]}
              end={[1, 1]}
              style={styles.leftGradient}
            />
            <View
              style={[
                styles.leftGradientFiller,
                {
                  backgroundColor: titleBackgroundColor
                }
              ]}
            />
            <LinearGradient
              colors={[titleBackgroundColor, titleBackgroundColor + '00']}
              start={[1, 0]}
              end={[0, 0]}
              style={styles.rightGradient}
            />
            <View
              style={[
                styles.rightGradientFiller,
                {
                  backgroundColor: titleBackgroundColor
                }
              ]}
            />
          </View>
          {/* Album Art */}
          <View
            style={{
              borderRadius: 20,
              backgroundColor: colors.geyser,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              aspectRatio: 1,
              // marginHorizontal: 40,
              maxWidth: Dimensions.get('window').width - 60,
              maxHeight: Dimensions.get('window').width - 60
            }}
          >
            <SVG name={iconName} width='100%' height='100%' color='#1D1E20' />
          </View>
        </View>
        <View key='2' style={{ flex: 1, backgroundColor: colors.white }}>
          <ScrollView
            style={{ backgroundColor: colors.white }}
            ref={textAreaRef}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            onContentSizeChange={(width, height) =>
              setTotalTextContentHeight(height)
            }
            onLayout={({ nativeEvent }) => {
              if (nativeEvent) setTextAreaHeight(nativeEvent.layout.height)
            }}
            scrollEventThrottle={64}
            stickyHeaderIndices={sectionIndices}
            onMomentumScrollEnd={() => setIsScrolling(false)}
            onScrollEndDrag={() => setIsScrolling(false)}
            // onMomentumScrollBegin={() => setShouldShowScrollBar(true)}
          >
            {/* <TouchableWithoutFeedback
            onPress={() => setShouldShowScrollBar(current => !current)}
          > */}
            {/* Fellowship header. */}
            <HeaderBig
              text={translations.play.fellowship}
              font={font}
              isRTL={isRTL}
              onLayout={({ nativeEvent }) => {
                if (nativeEvent)
                  setSectionOffsets(current => [
                    ...current,
                    {
                      name: translations.play.fellowship,
                      offset: nativeEvent.layout.y
                    }
                  ])
              }}
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
            {/* Scripture headers/text. */}
            {scriptureSection}
            {/* Application header. */}
            <HeaderBig
              text={translations.play.application}
              font={font}
              isRTL={isRTL}
              onLayout={({ nativeEvent }) => {
                if (nativeEvent)
                  setSectionOffsets(current => [
                    ...current,
                    {
                      name: translations.play.application,
                      offset: nativeEvent.layout.y
                    }
                  ])
              }}
            />
            {/* Application questions. */}
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
            {/* </TouchableWithoutFeedback> */}
          </ScrollView>
          {/* {shouldShowScrollBar && ( */}
          <View
            style={{
              position: 'absolute',
              right: 0,
              height: '100%',
              width: scrollBarSize / 2,
              // marginRight: scrollBarSize / -2.5,
              // marginTop: -15 * scaleMultiplier,
              alignItems: 'flex-end'
            }}
          >
            <Animated.View
              style={{
                transform: [
                  { translateY: scrollBarYPosition },
                  { translateX: scrollBarXPosition }
                ]
              }}
              {...panResponder.panHandlers}
            >
              <View
                style={{
                  height: scrollBarSize,
                  width: scrollBarSize,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.tuna,
                  shadowColor: '#000',
                  borderRadius: scrollBarSize / 2,
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  marginLeft: 20,
                  marginBottom: 20
                }}
              >
                <View
                  style={{
                    flex: 1,
                    position: 'absolute',
                    top: scrollBarSize / 6,
                    left: scrollBarSize / 6,
                    transform: [{ rotateZ: '270deg' }]
                  }}
                >
                  <Icon
                    size={scrollBarSize / 2.5}
                    name='triangle-right'
                    color={colors.white}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    position: 'absolute',
                    bottom: scrollBarSize / 6,
                    left: scrollBarSize / 6,
                    transform: [{ rotateZ: '90deg' }]
                  }}
                >
                  <Icon
                    size={scrollBarSize / 2.5}
                    name='triangle-right'
                    color={colors.white}
                  />
                </View>
              </View>
            </Animated.View>
          </View>
          {/* )} */}
          {!shouldUpdateScrollBar && (
            <LinearGradient
              style={{
                position: 'absolute',
                flexDirection: 'row-reverse',
                right: 0,
                // marginHorizontal: 30 * scaleMultiplier,
                height: '100%',
                alignItems: 'center',
                width: 100,
                overflow: 'visible'
                // marginBottom: 30 * scaleMultiplier
              }}
              colors={[colors.shark + '30', colors.shark + '00']}
              start={[1, 1]}
              end={[0, 1]}
            >
              {sectionOffsets.map((section, index) => (
                <View
                  key={index}
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginRight: scrollBarSize / 2,
                    top:
                      totalTextContentHeight !== 0
                        ? (section.offset * (textAreaHeight - scrollBarSize)) /
                          (totalTextContentHeight - textAreaHeight)
                        : 0
                  }}
                >
                  <View
                    style={{
                      // position: 'absolute',
                      // marginHorizontal: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.tuna,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      borderRadius: 3,
                      marginRight: -10
                    }}
                  >
                    <Text
                      style={StandardTypography(
                        { font, isRTL },
                        'h4',
                        'Bold',
                        'center',
                        colors.white
                      )}
                    >
                      {section.name}
                    </Text>
                  </View>
                  <Icon
                    name='triangle-right'
                    size={25 * scaleMultiplier}
                    color={colors.tuna}
                  />
                </View>
              ))}
              {/* <View
                style={{
                  position: 'absolute',
                  height: '100%',
                  right: 0,
                  width: 50
                }}
                // colors={[titleBackgroundColor, titleBackgroundColor + '00']}
                // start={[1, 0]}
                // end={[0, 0]}
              /> */}
            </LinearGradient>
          )}
          <LinearGradient
            colors={[titleBackgroundColor, titleBackgroundColor + '00']}
            start={[1, 1]}
            end={[1, 0]}
            style={{
              position: 'absolute',
              bottom: 0,
              height: 20 * scaleMultiplier,
              width: '100%'
            }}
          />
        </View>
      </PagerView>
      <View
        style={{
          width: '100%',
          height: 30 * scaleMultiplier,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row'
        }}
      >
        <View
          style={{
            backgroundColor: activePage === 0 ? colors.tuna : colors.chateau,
            width:
              activePage === 0 ? 10 * scaleMultiplier : 8 * scaleMultiplier,
            height:
              activePage === 0 ? 10 * scaleMultiplier : 8 * scaleMultiplier,
            borderRadius:
              activePage === 0 ? 5 * scaleMultiplier : 4 * scaleMultiplier,
            marginHorizontal: 7
          }}
        />
        <View
          style={{
            backgroundColor: activePage === 1 ? colors.tuna : colors.chateau,
            width:
              activePage === 1 ? 10 * scaleMultiplier : 8 * scaleMultiplier,
            height:
              activePage === 1 ? 10 * scaleMultiplier : 8 * scaleMultiplier,
            borderRadius:
              activePage === 1 ? 5 * scaleMultiplier : 4 * scaleMultiplier,
            marginHorizontal: 7
          }}
        />
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
  rightGradient: {
    position: 'absolute',
    right: 0,
    width: 15,
    height: '100%',
    marginHorizontal: 10
  },
  leftGradient: {
    position: 'absolute',
    left: 0,
    width: 15,
    height: '100%',
    marginHorizontal: 10
  },
  rightGradientFiller: {
    position: 'absolute',
    right: 0,
    width: 10,
    height: '100%',
    backgroundColor: colors.white
  },
  leftGradientFiller: {
    position: 'absolute',
    left: 0,
    width: 10,
    height: '100%',
    backgroundColor: colors.white
  }
})

export default connect(mapStateToProps)(AlbumArtSwiper)
