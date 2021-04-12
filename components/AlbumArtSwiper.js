// import SvgUri from 'expo-svg-uri'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  Dimensions,
  SectionList,
  StyleSheet,
  Text,
  View
} from 'react-native'
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
  // keeps track of whether we're in the middle pane or not
  const [isMiddle, setIsMiddle] = useState(true)

  const [layoutWidth, setLayoutWidth] = useState(60)
  const [marginWidth, setMarginWidth] = useState(80)

  const [titleBackgroundColor, setTitleBackgroundColor] = useState(colors.white)

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

  const getTextData = () => {
    var sections = []

    // Add all Fellowship questions to sections.
    sections.push({
      name: 'Fellowship',
      data: activeDatabase.questions[thisLesson.fellowshipType]
    })

    // Add each Scripture passage as a separate section.
    thisLesson.scripture.forEach(scripture => {
      sections.push({
        name: scripture.header,
        data: [scripture.text]
      })
    })

    // Add all Application questions to sections.
    sections.push({
      name: 'Application',
      data: activeDatabase.questions[thisLesson.applicationType]
    })

    return sections
  }

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
  const [middleScrollBarOpacity, setMiddleScrollBarOpacity] = useState(
    new Animated.Value(0)
  )
  const [sideScrollBarOpacity, setSideScrollBarOpacity] = useState(
    new Animated.Value(0.8)
  )

  //- whenever we switch to and from the middle pane, change which scroll bars
  //-   are visible
  useEffect(() => {
    if (isMiddle)
      Animated.sequence([
        Animated.timing(middleScrollBarOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(sideScrollBarOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ]).start()
    else {
      Animated.sequence([
        Animated.timing(sideScrollBarOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(middleScrollBarOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [isMiddle])

  //- render either text or album art
  // function renderAlbumArtItem ({ item }) {
  //   // for text panes
  //   if (item.type === 'text') {
  //     return (
  //       <View
  //         style={[
  //           styles.albumArtContainer,
  //           {
  //             width: Dimensions.get('window').width - marginWidth,
  //             height: Dimensions.get('window').width - marginWidth
  //           }
  //         ]}
  //       >
  //         <SwipeBar
  //           isMiddle={false}
  //           side='left'
  //           opacity={sideScrollBarOpacity}
  //         />
  //         <SwipeBar
  //           isMiddle={false}
  //           side='right'
  //           opacity={sideScrollBarOpacity}
  //         />
  //         <FlatList
  //           data={getTextData(item.key)}
  //           renderItem={renderTextContent}
  //           initialNumToRender={3}
  //           keyExtractor={item => item.header}
  //           showsVerticalScrollIndicator={false}
  //           ListHeaderComponent={() => <View style={{ height: 10 }} />}
  //           ListFooterComponent={
  //             item.key === '2'
  //               ? () => (
  //                   <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
  //                     <Text
  //                       style={StandardTypography(
  //                         { font, isRTL },
  //                         'd',
  //                         'Regular',
  //                         'center',
  //                         colors.chateau
  //                       )}
  //                     >
  //                       {translations.play.copyright_for_text + '\n'}
  //                     </Text>
  //                     <Text
  //                       style={StandardTypography(
  //                         { font, isRTL },
  //                         'd',
  //                         'Regular',
  //                         'center',
  //                         colors.chateau
  //                       )}
  //                     >
  //                       {translations.play.copyright_for_audio}
  //                     </Text>
  //                   </View>
  //                 )
  //               : null
  //           }
  //         />
  //       </View>
  //     )
  //   } else {
  //     return (
  //       <View
  //         style={[
  //           styles.albumArtContainer,
  //           {
  //             width: Dimensions.get('window').width - marginWidth,
  //             height: Dimensions.get('window').width - marginWidth
  //           }
  //         ]}
  //       >
  //         <SwipeBar
  //           isMiddle={true}
  //           side='left'
  //           opacity={middleScrollBarOpacity}
  //         />
  //         <SwipeBar
  //           isMiddle={true}
  //           side='right'
  //           opacity={middleScrollBarOpacity}
  //         />
  //         <View
  //           style={{
  //             zIndex: 1,
  //             width: '100%',
  //             height: '100%',
  //             justifyContent: 'center',
  //             alignItems: 'center'
  //           }}
  //         >
  //           <TouchableHighlight
  //             style={{
  //               width: '100%',
  //               height: '100%',
  //               justifyContent: 'center',
  //               alignItems: 'center'
  //             }}
  //             onPress={playHandler}
  //             underlayColor={colors.white + '00'}
  //             activeOpacity={1}
  //           >
  //             <SVG
  //               name={item.svgName}
  //               width={Dimensions.get('window').width - marginWidth}
  //               height={Dimensions.get('window').width - marginWidth}
  //               color='#1D1E20'
  //             />
  //             {/* <SvgUri
  //               source={{
  //                 uri:
  //                   ''
  //               }}
  //               width={Dimensions.get('window').width - marginWidth}
  //               height={Dimensions.get('window').width - marginWidth}
  //               // fill={fullyCompleted ? colors.chateau : colors.shark}
  //               fill='#1D1E20'
  //               fillAll
  //             /> */}
  //           </TouchableHighlight>
  //         </View>
  //         <Animated.View
  //           style={{
  //             position: 'absolute',
  //             opacity: playOpacity,
  //             transform: [
  //               {
  //                 scale: playOpacity.interpolate({
  //                   inputRange: [0, 1],
  //                   outputRange: [2, 1]
  //                 })
  //               }
  //             ],
  //             zIndex: animationZIndex
  //           }}
  //         >
  //           <Icon
  //             name={isMediaPlaying ? 'play' : 'pause'}
  //             size={100 * scaleMultiplier}
  //             color={colors.white}
  //           />
  //         </Animated.View>
  //       </View>
  //     )
  //   }
  // }
  // renders the questions/scripture text content
  // function renderTextContent (textList) {
  //   return (
  //     <View style={{ paddingHorizontal: 20 }}>
  //       <Text
  //         style={StandardTypography(
  //           { font, isRTL },
  //           'h3',
  //           'Bold',
  //           'left',
  //           colors.shark
  //         )}
  //       >
  //         {textList.item.header}
  //       </Text>
  //       <Text
  //         style={StandardTypography(
  //           { font, isRTL },
  //           'h3',
  //           'Regular',
  //           'left',
  //           colors.shark
  //         )}
  //       >
  //         {textList.item.text}
  //       </Text>
  //     </View>
  //   )
  // }

  const renderTextContent = item => {
    return (
      <View>
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h3',
            'Regular',
            'left',
            colors.shark
          )}
        >
          {item}
        </Text>
      </View>
    )
  }

  const renderSectionHeader = section => {
    return (
      <View style={{ paddingHorizontal: 20, backgroundColor: colors.geyser }}>
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h2',
            'Black',
            'left',
            colors.shark
          )}
        >
          {section.name}
        </Text>
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
    <PagerView style={{ flex: 1 }}>
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
        <SectionList
          sections={getTextData()}
          renderItem={({ item }) => renderTextContent(item)}
          renderSectionHeader={({ section }) => renderSectionHeader(section)}
          keyExtractor={item => item}
          stickySectionHeadersEnabled
        />
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
