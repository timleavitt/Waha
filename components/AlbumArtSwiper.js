import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import { connect } from 'react-redux'
import SVG from '../assets/svg'
import SwipeBar from '../components/SwipeBar'
import { colors, getLanguageFont, scaleMultiplier } from '../constants'
import { StandardTypography } from '../styles/typography'

function AlbumArtSwiper (props) {
  //+ STATE

  // keeps track of whether we're in the middle pane or not
  const [isMiddle, setIsMiddle] = useState(true)

  const [layoutWidth, setLayoutWidth] = useState(60)
  const [marginWidth, setMarginWidth] = useState(80)

  // refs for determining when we're in the middle
  // todo: is extremely jank and inconsistent but functional
  const onViewRef = useRef(info => {
    if (info.viewableItems.some(item => item.index === 0)) setIsMiddle(true)
    else setIsMiddle(false)
  })
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

  // data for album art flatlist
  const albumArtData = [
    {
      key: '0',
      type: 'text'
    },
    {
      key: '1',
      type: 'image',
      svgName: props.iconName
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

  function getTextData (key) {
    if (key === '2') {
      if (props.thisLesson.scripture) return props.thisLesson.scripture
      else return null
    } else {
      if (props.thisLesson.fellowshipType) {
        var combinedQuestionList = props.activeDatabase.questions[
          props.thisLesson.fellowshipType
        ]
          // combine fellowship and application questions
          .concat(
            props.activeDatabase.questions[props.thisLesson.applicationType]
          )
        var updatedQuestionArray = []
        combinedQuestionList.forEach((question, index) => {
          var temp = {}
          temp['header'] =
            props.translations.play.question_header +
            ' ' +
            (index + 1).toString()
          temp['text'] = question + '\n'
          updatedQuestionArray.push(temp)
        })
        return updatedQuestionArray
      } else return null
    }

    return props.thisLesson.fellowshipType
      ? // render questions on the first pane and scripture on the last
        item.key === '0'
        ? props.activeDatabase.questions[props.thisLesson.fellowshipType]
            // combine fellowship and application questions
            .concat(
              props.activeDatabase.questions[props.thisLesson.applicationType]
            )
            // add newline after each question for spacing
            .map(question => {
              return { ...question, text: question.text + '\n' }
            })
        : props.thisLesson.scripture
      : []
  }

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
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(sideScrollBarOpacity, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true
        })
      ]).start()
    else {
      Animated.sequence([
        Animated.timing(sideScrollBarOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(middleScrollBarOpacity, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [isMiddle])

  //- render either text or album art
  function renderAlbumArtItem ({ item }) {
    // for text panes
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
            opacity={sideScrollBarOpacity}
          />
          <SwipeBar
            isMiddle={false}
            side='right'
            opacity={sideScrollBarOpacity}
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
                          props,
                          'd',
                          'Regular',
                          'center',
                          colors.chateau
                        )}
                      >
                        {props.translations.play.copyright_for_text + '\n'}
                      </Text>
                      <Text
                        style={StandardTypography(
                          props,
                          'd',
                          'Regular',
                          'center',
                          colors.chateau
                        )}
                      >
                        {props.translations.play.copyright_for_audio}
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
            opacity={middleScrollBarOpacity}
          />
          <SwipeBar
            isMiddle={true}
            side='right'
            opacity={middleScrollBarOpacity}
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
              onPress={props.playHandler}
              underlayColor={colors.white + '00'}
              activeOpacity={1}
            >
              <SVG
                name={item.svgName}
                width={Dimensions.get('window').width - marginWidth}
                height={Dimensions.get('window').width - marginWidth}
                fill='#1D1E20'
              />
            </TouchableHighlight>
          </View>
          <Animated.View
            style={{
              position: 'absolute',
              opacity: props.playOpacity,
              transform: [
                {
                  scale: props.playOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, 1]
                  })
                }
              ],
              zIndex: props.animationZIndex
            }}
          >
            <Icon
              name={props.isMediaPlaying ? 'play' : 'pause'}
              size={100 * scaleMultiplier}
              color={colors.white}
            />
          </Animated.View>
        </View>
      )
    }
  }
  // renders the questions/scripture text content
  function renderTextContent (textList) {
    return (
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={StandardTypography(props, 'h3', 'Bold', 'left', colors.shark)}
        >
          {textList.item.header}
        </Text>
        <Text
          style={StandardTypography(
            props,
            'h3',
            'Regular',
            'left',
            colors.shark
          )}
        >
          {textList.item.text}
        </Text>
      </View>
    )
  }
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <FlatList
        data={albumArtData}
        renderItem={renderAlbumArtItem}
        ref={ref => props.setAlbumArtSwiperRef(ref)}
        horizontal={true}
        pagingEnabled={true}
        snapToAlignment={'start'}
        snapToInterval={Dimensions.get('window').width - layoutWidth}
        decelerationRate={'fast'}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={{ width: 20, height: '100%' }} />
        )}
        ListHeaderComponent={() => <View style={{ width: 40 }} />}
        ListFooterComponent={() => <View style={{ width: 40 }} />}
        getItemLayout={(data, index) => ({
          length: Dimensions.get('window').width - layoutWidth,
          offset: Dimensions.get('window').width - layoutWidth * index,
          index
        })}
        initialScrollIndex={1}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewRef.current}
        disableIntervalMomentum={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  albumArtContainer: {
    borderRadius: 10,
    backgroundColor: colors.porcelain,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.chateau,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeGroup: activeGroup,
    activeDatabase: state.database[activeGroup.language],
    font: getLanguageFont(activeGroup.language),
    translations: state.database[activeGroup.language].translations,
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(AlbumArtSwiper)
