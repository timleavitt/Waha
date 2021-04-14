// import SvgUri from 'expo-svg-uri'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  SectionList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
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
import Separator from './standard/Separator'
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

const scrollElementHeightPercent = 45

const AlbumArtSwiper = ({
  // Props passed from a parent component.
  setAlbumArtSwiperRef,
  iconName,
  thisLesson,
  playHandler,
  playOpacity,
  animationZIndex,
  isMediaPlaying,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,
  translations,
  isRTL
}) => {
  // keeps track of whether we're in the middle pane or not
  const [isMiddle, setIsMiddle] = useState(true)

  const [layoutWidth, setLayoutWidth] = useState(60)
  const [marginWidth, setMarginWidth] = useState(80)

  const [titleBackgroundColor, setTitleBackgroundColor] = useState(colors.white)

  const [shouldShowScrollBar, setShouldShowScrollBar] = useState(false)
  // const [scrollOffset, setScrollOffset] = useState(0)
  const [contentSize, setContentSize] = useState(0)
  const [sectionListHeight, setSectionListHeight] = useState(0)

  // const scrollPercentage = (scrollOffset.y / contentSize) * 100

  // const translateY = useRef(new Animated.Value(0)).current
  const sectionListRef = useRef()

  const [shouldUpdateScroll, setShouldUpdateScroll] = useState(true)

  const [indexList, setIndexList] = useState([])

  const [contentCount, setContentCount] = useState(
    activeDatabase.questions[thisLesson.fellowshipType].length +
      thisLesson.scripture.length +
      activeDatabase.questions[thisLesson.applicationType].length
  )

  const [scroll, setScroll] = useState(0)

  const translateY = useRef(new Animated.Value(0)).current

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        translateY.setValue(gesture.dy)
        // console.log(gesture.moveY)
      },
      onPanResponderGrant: (event, gesture) => {
        setShouldUpdateScroll(false)
        translateY.extractOffset()
        translateY.setValue(0)
      },
      // onPanResponderMove: (event, gesture) => {
      //   console.log(gesture)
      // },
      onPanResponderRelease: () => {
        setShouldUpdateScroll(true)
        translateY.flattenOffset()
      }
    })
  ).current

  // useEffect(() => {
  //   sectionListRef.current.scrollTo({
  //     x: 0,
  //     y: translateY,
  //     animated: false
  //   })
  // }, [translateY])

  // useEffect(() => {
  //   Animated.event(
  //     [
  //       {
  //         nativeEvent: {
  //           translationY: translateY
  //         }
  //       }
  //     ],
  //     { useNativeDriver: true }
  //   )
  // }, [translateY])

  // refs for determining when we're in the middle
  // todo: is extremely jank and inconsistent but functional
  // const onViewRef = useRef(info => {
  //   if (info.viewableItems.some(item => item.index === 0)) setIsMiddle(true)
  //   else setIsMiddle(false)
  // })
  // const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

  // data for album art flatlist
  const albumArtData = [
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
  ]

  useEffect(() => {
    if (Dimensions.get('window').width >= 600) {
      setLayoutWidth(240)
      setMarginWidth(200)
    }
  }, [])

  // useEffect(() => {
  //   var indexList = []
  //   indexList.push(activeDatabase.questions[thisLesson.fellowshipType].length)
  //   thisLesson.scripture.forEach(() => indexList.push(1))
  //   indexList.push(activeDatabase.questions[thisLesson.applicationType].length)
  //   setIndexList(indexList)
  // }, [])

  useEffect(() => {
    var scrollPosition = ((scroll * contentCount) / sectionListHeight) | 0
    // var indices = getIndices(scrollPosition)
    // console.log(getIndices(scrollPosition))
    // sectionListRef.current.scrollToLocation({
    //   animated: false,
    //   itemIndex: indices.itemIndex,
    //   sectionIndex: indices.sectionIndex
    // })
  }, [scroll])
  // useEffect(() => {
  //   console.log(scrollOffset)
  // }, [scrollOffset])

  useEffect(() => {
    if (sectionListHeight > 0)
      translateY.addListener(({ value }) => {
        if (value >= 0 && value <= sectionListHeight) setScroll(value | 0)
        // sectionListRef.current.scrollToLocation({
        //   animated: false,
        //   itemIndex: getIndecies((value / contentCount) | 0).itemIndex,
        //   sectionIndex: getIndecies((value / contentCount) | 0).sectionIndex
        // })
      })
  }, [sectionListHeight])

  const getIndices = scrollPosition => {
    // var itemIndex = 0
    // var indexCounter = 0
    // var jackpot = {}
    // for (sectionIndex = 0; sectionIndex < indexList.length; sectionIndex++) {
    //   if (indexList[sectionIndex] + indexCounter < scrollPosition) {
    //     indexCounter += indexList[sectionIndex]
    //   } else {
    //     return {
    //       sectionIndex: sectionIndex,
    //       itemIndex: scrollPosition - indexCounter
    //     }
    //   }
    // }

    var lowerBound = 0
    var upperBound = indexList[0]

    var sectionIndex = 0
    var itemIndex = 0

    while (!(scrollPosition >= lowerBound && scrollPosition <= upperBound)) {
      sectionIndex++
      lowerBound = upperBound
      upperBound = indexList[sectionIndex]
    }

    sectionIndex = sectionIndex
    itemIndex = scrollPosition - lowerBound

    // console.log(`sectionIndex: ${sectionIndex}, itemIndex: ${itemIndex}`)
    return {
      sectionIndex: sectionIndex,
      itemIndex: itemIndex
    }
  }

  const getTextData = () => {
    var sections = []
    var fellowshipCount = 0
    var storyCount = 0
    var applicationCount = 0
    var totalContentCount = 0
    var contentCounts = []

    // Add Fellowship section.
    sections.push({
      name: 'Fellowship',
      data: activeDatabase.questions[thisLesson.fellowshipType].map(
        (question, index) => {
          fellowshipCount += 1
          totalContentCount += 1
          return {
            header:
              translations.play.question_header + ' ' + (index + 1).toString(),
            text: question + '\n'
          }
        }
      )
    })

    contentCounts.push(fellowshipCount)

    // Add Story sections.
    thisLesson.scripture.forEach(scriptureChunk => {
      sections.push({
        name: scriptureChunk.header,
        data: scriptureChunk.text
          .split('\n')
          .filter(paragraph => paragraph.replace(/\s/g, '').length)
          .map(paragraph => {
            storyCount += 1
            totalContentCount += 1
            return { text: paragraph }
          })
      })
      contentCounts.push(fellowshipCount + storyCount)
      storyCount = 0
    })

    // Add Application section.
    sections.push({
      name: 'Application',
      data: activeDatabase.questions[thisLesson.applicationType].map(
        (question, index) => {
          applicationCount += 1
          totalContentCount += 1
          return {
            header:
              translations.play.question_header + ' ' + (index + 1).toString(),
            text: question + '\n'
          }
        }
      )
    })

    contentCounts.push(fellowshipCount + storyCount + applicationCount)

    setContentCount(totalContentCount)
    setIndexList(contentCounts)
    return sections
  }

  const textData = useMemo(() => getTextData(), [])

  // function getTextData (key) {
  //   if (key === '2') {
  //     if (thisLesson.scripture) return thisLesson.scripture
  //     else return null
  //   } else {
  //     if (thisLesson.fellowshipType) {
  //       var combinedQuestionList = activeDatabase.questions[
  //         thisLesson.fellowshipType
  //       ]
  //         // combine fellowship and application questions
  //         .concat(activeDatabase.questions[thisLesson.applicationType])
  //       var updatedQuestionArray = []
  //       combinedQuestionList.forEach((question, index) => {
  //         var temp = {}
  //         temp['header'] =
  //           translations.play.question_header + ' ' + (index + 1).toString()
  //         temp['text'] = question + '\n'
  //         updatedQuestionArray.push(temp)
  //       })
  //       return updatedQuestionArray
  //     } else return null
  //   }

  //   return thisLesson.fellowshipType
  //     ? // render questions on the first pane and scripture on the last
  //       item.key === '0'
  //       ? activeDatabase.questions[thisLesson.fellowshipType]
  //           // combine fellowship and application questions
  //           .concat(activeDatabase.questions[thisLesson.applicationType])
  //           // add newline after each question for spacing
  //           .map(question => {
  //             return { ...question, text: question.text + '\n' }
  //           })
  //       : thisLesson.scripture
  //     : []
  // }

  //+ ANIMATION STUFF

  // opacities for the scroll bar opacities
  // const [middleScrollBarOpacity, setMiddleScrollBarOpacity] = useState(
  //   new Animated.Value(0)
  // )
  // const [sideScrollBarOpacity, setSideScrollBarOpacity] = useState(
  //   new Animated.Value(0.8)
  // )

  //- whenever we switch to and from the middle pane, change which scroll bars
  //-   are visible
  // useEffect(() => {
  //   if (isMiddle)
  //     Animated.sequence([
  //       Animated.timing(middleScrollBarOpacity, {
  //         toValue: 0,
  //         duration: 250,
  //         useNativeDriver: true
  //       }),
  //       Animated.timing(sideScrollBarOpacity, {
  //         toValue: 1,
  //         duration: 1000,
  //         useNativeDriver: true
  //       })
  //     ]).start()
  //   else {
  //     Animated.sequence([
  //       Animated.timing(sideScrollBarOpacity, {
  //         toValue: 0,
  //         duration: 250,
  //         useNativeDriver: true
  //       }),
  //       Animated.timing(middleScrollBarOpacity, {
  //         toValue: 1,
  //         duration: 1000,
  //         useNativeDriver: true
  //       })
  //     ]).start()
  //   }
  // }, [isMiddle])

  const renderTextContent = item => {
    return (
      <TouchableWithoutFeedback
        onPress={() => setShouldShowScrollBar(current => !current)}
        style={{ paddingHorizontal: 20 }}
      >
        {item.header && (
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
        )}
        {item.text && (
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
        )}
      </TouchableWithoutFeedback>
    )
  }

  const renderSectionHeader = section => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10 * scaleMultiplier,
          marginBottom: 10 * scaleMultiplier,
          backgroundColor: colors.white,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5
        }}
      >
        <Text
          style={[
            StandardTypography(
              { font, isRTL },
              'h2',
              'Black',
              'left',
              colors.shark
            ),
            {
              fontSize: 22 * scaleMultiplier
            }
          ]}
        >
          {section.name}
        </Text>
        <Separator />
      </View>
    )
  }

  return (
    // <View
    //   style={{
    //     width: '100%',
    //     justifyContent: 'center',
    //     alignItems: 'center'
    //   }}
    // >
    //   <Carousel
    //     data={albumArtData}
    //     renderItem={renderAlbumArtItem}
    //     ref={ref => setAlbumArtSwiperRef(ref)}
    //     itemWidth={Dimensions.get('window').width - marginWidth}
    //     sliderWidth={Dimensions.get('window').width}
    //     itemHeight={Dimensions.get('window').width - marginWidth}
    //     sliderHeight={Dimensions.get('window').width}
    //     firstItem={1}
    //     removeClippedSubviews={false}
    //     lockScrollWhileSnapping
    //     onBeforeSnapToItem={slideIndex => {
    //       if (slideIndex === 1) setIsMiddle(true)
    //       else setIsMiddle(false)
    //     }}
    //   />
    // </View>
    <PagerView style={{ flex: 1 }} scrollEnabled={shouldUpdateScroll}>
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
          style={[
            styles.albumArtContainer,
            {
              width: Dimensions.get('window').width - marginWidth,
              height: Dimensions.get('window').width - marginWidth
            }
          ]}
        >
          {/* <View
              style={{
                zIndex: 1,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            > */}
          {/* <TouchableHighlight
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={playHandler}
                underlayColor={colors.white + '00'}
                activeOpacity={1}
              > */}
          <SVG
            name={iconName}
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
          {/* </TouchableHighlight>
            </View>
            <Animated.View
              style={{
                position: 'absolute',
                opacity: playOpacity,
                transform: [
                  {
                    scale: playOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2, 1]
                    })
                  }
                ],
                zIndex: animationZIndex
              }}
            >
              <Icon
                name={isMediaPlaying ? 'play' : 'pause'}
                size={100 * scaleMultiplier}
                color={colors.white}
              />
            </Animated.View>*/}
          {/* </View> */}
        </View>
      </View>
      <View key='2' style={{ flex: 1 }}>
        {/* <ScrollView
          ref={scrollViewRef}
          onScroll={({ nativeEvent }) =>
            setScrollOffset(nativeEvent.contentOffset)
          }
          onContentSizeChange={(width, height) => setContentSize(height)}
          onLayout={({ nativeEvent }) =>
            setSectionListHeight(nativeEvent.layout.height)
          }
          scrollEventThrottle={16}
        >
          {getTextData()}
        </ScrollView> */}
        <SectionList
          sections={textData}
          renderItem={({ item }) => renderTextContent(item)}
          renderSectionHeader={({ section }) => renderSectionHeader(section)}
          keyExtractor={item => item.text}
          ref={sectionListRef}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (shouldUpdateScroll) {
              // setScrollOffset(nativeEvent.contentOffset)
              translateY.setValue(
                (nativeEvent.contentOffset.y *
                  nativeEvent.layoutMeasurement.height) /
                  nativeEvent.contentSize.height
              )
            }
          }}
          onContentSizeChange={(width, height) => setContentSize(height)}
          onLayout={({ nativeEvent }) =>
            setSectionListHeight(nativeEvent.layout.height)
          }
          onScrollToIndexFailed={info => {
            console.log(info)
          }}
        />
        {/* <VirtualizedList
          data={getTextData()}
          renderItem={({ item }) => renderTextContent(item)}
          getItem={data => data}
          getItemCount={data => 5}
          // keyExtractor={item => item.key}
        /> */}
        {shouldShowScrollBar && (
          <View
            style={{
              position: 'absolute',
              right: 0,
              height: '100%',
              width: 30
              // backgroundColor: 'green'
              // paddingBottom: 30 * scaleMultiplier
            }}
          >
            {/* <PanGestureHandler
              onGestureEvent={Animated.event(
                [{ nativeEvent: { translationY: translateY } }],
                {
                  useNativeDriver: true
                }
              )}
              onHandlerStateChange={() => translateY.extractOffset()}
              a
            > */}
            <Animated.View
              style={{
                // top: shouldUpdateScroll
                //   ? `${Number(scrollPercentage || 0).toFixed(0)}%`
                //   : null,
                height: 30 * scaleMultiplier,
                width: '100%',
                backgroundColor: colors.tuna,
                shadowColor: '#000',
                borderRadius: 15,
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                transform: [
                  {
                    translateY: translateY.interpolate({
                      inputRange: [0, sectionListHeight - 30],
                      outputRange: [0, sectionListHeight - 30],
                      extrapolate: 'clamp'
                    })
                  }
                ]
              }}
              {...panResponder.panHandlers}
            />
            {/* </PanGestureHandler> */}
          </View>
        )}
      </View>
    </PagerView>
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
