// import SvgUri from 'expo-svg-uri'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View
} from 'react-native'
import {
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native-gesture-handler'
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

const HeaderBig = ({ text, font, isRTL, onLayout }) => (
  <View
    style={{
      paddingVertical: 10 * scaleMultiplier,
      marginBottom: 10 * scaleMultiplier,
      backgroundColor: colors.white
    }}
    onLayout={onLayout}
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
      {text}
    </Text>
    <Separator />
  </View>
)

const HeaderSmall = ({ text, font, isRTL }) => (
  <Text
    style={StandardTypography(
      { font, isRTL },
      'h3',
      'Bold',
      'left',
      colors.shark
    )}
  >
    {text}
  </Text>
)

const StandardText = ({ text, font, isRTL }) => (
  <Text
    style={StandardTypography(
      { font, isRTL },
      'h3',
      'Regular',
      'left',
      colors.shark
    )}
  >
    {text}
  </Text>
)

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
  const [layoutWidth, setLayoutWidth] = useState(60)
  const [marginWidth, setMarginWidth] = useState(80)

  const [titleBackgroundColor, setTitleBackgroundColor] = useState(colors.white)

  const [shouldShowScrollBar, setShouldShowScrollBar] = useState(false)
  const [contentSize, setContentSize] = useState(0)
  const [sectionListHeight, setSectionListHeight] = useState(0)
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

  const [sectionOffsets, setSectionOffsets] = useState([])

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
      onPanResponderRelease: () => {
        setShouldUpdateScroll(true)
        translateY.flattenOffset()
      }
    })
  ).current

  /** useEffect function that triggers on every scroll bar position change. */
  useEffect(() => {
    if (!shouldUpdateScroll) {
      var scrollOffset =
        (scroll * (contentSize - sectionListHeight)) / sectionListHeight
      sectionListRef.current.scrollTo({ y: scrollOffset, animated: false })
    }
  }, [scroll])

  useEffect(() => {
    console.log(sectionOffsets)
  }, [sectionOffsets])

  const onScroll = ({ nativeEvent }) => {
    // console.log(`${Date.now()} Calling onScroll.`)
    if (shouldUpdateScroll) {
      translateY.setValue(
        (nativeEvent.contentOffset.y * nativeEvent.layoutMeasurement.height) /
          (nativeEvent.contentSize.height -
            nativeEvent.layoutMeasurement.height)
      )
    }
  }

  /** Start listener for the position of the scroll bar position. */
  useEffect(() => {
    if (sectionListHeight > 0)
      translateY.addListener(({ value }) => {
        // console.log(value)
        if (value >= 0 && value <= sectionListHeight) setScroll(value | 0)
      })
  }, [sectionListHeight])

  const getIndices = scrollPosition => {
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

  // Use with SectionList.
  /*const getTextData = () => {
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
  }*/

  // const textData = useMemo(() => getTextData(), [])

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
          <SVG
            name={iconName}
            width={Dimensions.get('window').width - marginWidth}
            height={Dimensions.get('window').width - marginWidth}
            color='#1D1E20'
          />
        </View>
      </View>
      <View key='2' style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* SectionList. */}
        {/* <SectionList
          sections={textData}
          renderItem={({ item }) => renderTextContent(item)}
          renderSectionHeader={({ section }) => renderSectionHeader(section)}
          keyExtractor={item => item.text}
          ref={sectionListRef}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          onContentSizeChange={(width, height) => setContentSize(height)}
          onLayout={({ nativeEvent }) =>
            setSectionListHeight(nativeEvent.layout.height)
          }
          onScrollToIndexFailed={info => {
            console.log(info)
          }}
          scrollEventThrottle={5000}
        /> */}
        {/* ScrollView. */}
        <ScrollView
          ref={sectionListRef}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          onContentSizeChange={(width, height) => setContentSize(height)}
          onLayout={({ nativeEvent }) =>
            setSectionListHeight(nativeEvent.layout.height)
          }
          scrollEventThrottle={64}
        >
          <TouchableWithoutFeedback
            onPress={() => setShouldShowScrollBar(current => !current)}
          >
            {/* Fellowship header. */}
            <HeaderBig
              text='Fellowship'
              font={font}
              isRTL={isRTL}
              onLayout={({ nativeEvent }) =>
                setSectionOffsets(current => [
                  ...current,
                  { name: 'Fellowship', offset: nativeEvent.layout.y }
                ])
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
            {/* Scripture headers/text. */}
            {thisLesson.scripture.map((scriptureChunk, index) => (
              <View
                key={index}
                onLayout={({ nativeEvent }) =>
                  setSectionOffsets(current => [
                    ...current,
                    {
                      name: scriptureChunk.header,
                      offset: nativeEvent.layout.y
                    }
                  ])
                }
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
            {/* Application header. */}
            <HeaderBig
              text='Application'
              font={font}
              isRTL={isRTL}
              onLayout={({ nativeEvent }) =>
                setSectionOffsets(current => [
                  ...current,
                  { name: 'Application', offset: nativeEvent.layout.y }
                ])
              }
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
          </TouchableWithoutFeedback>
        </ScrollView>
        {shouldShowScrollBar && (
          <View
            style={{
              position: 'absolute',
              right: 0,
              height: '100%',
              width: 30 * scaleMultiplier,
              marginTop: -15 * scaleMultiplier,
              alignItems: 'center'
            }}
          >
            <Animated.View
              style={{
                // top: shouldUpdateScroll
                //   ? `${Number(scrollPercentage || 0).toFixed(0)}%`
                //   : null,
                height: 30 * scaleMultiplier,
                width: 30 * scaleMultiplier,
                justifyContent: 'center',
                alignItems: 'center',
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
                    translateY: translateY
                    // .interpolate({
                    //   inputRange: [0, sectionListHeight],
                    //   outputRange: [0, sectionListHeight],
                    //   extrapolate: 'clamp'
                    // })
                  }
                ]
              }}
              {...panResponder.panHandlers}
            >
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  top: 1,
                  transform: [{ rotateZ: '270deg' }]
                }}
              >
                <Icon
                  size={18 * scaleMultiplier}
                  name='triangle-right'
                  color={colors.white}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  bottom: 1,
                  transform: [{ rotateZ: '90deg' }]
                }}
              >
                <Icon
                  size={18 * scaleMultiplier}
                  name='triangle-right'
                  color={colors.white}
                />
              </View>
            </Animated.View>
          </View>
        )}
        {!shouldUpdateScroll && (
          <View
            style={{
              position: 'absolute',
              right: 30 * scaleMultiplier,
              height: '100%',
              alignItems: 'center',
              backgroundColor: 'green'
              // marginBottom: 30 * scaleMultiplier
            }}
          >
            {sectionOffsets.map((section, index) => (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  backgroundColor: 'green',
                  top: (section.offset * sectionListHeight) / contentSize
                }}
              >
                <Text>{section.name}</Text>
              </View>
            ))}
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
