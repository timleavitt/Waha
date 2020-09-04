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
import { colors, scaleMultiplier } from '../constants'

function AlbumArtSwiper (props) {
  //+ STATE
  const [albumArtRef, setAlbumArtRef] = useState()
  const [isMiddle, setIsMiddle] = useState(true)
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

  //+ ANIMATION STUFF

  const [middleScrollBarOpacity, setMiddleScrollBarOpacity] = useState(
    new Animated.Value(0)
  )
  const [sideScrollBarOpacity, setSideScrollBarOpacity] = useState(
    new Animated.Value(0.8)
  )

  // animation state
  const [animationZIndex, setAnimationZIndex] = useState(0)

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

  // render either text or album art
  function renderAlbumArtItem ({ item }) {
    if (item.type === 'text') {
      return (
        <View style={styles.albumArtContainer}>
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
            data={
              props.thisLesson.fellowshipType
                ? // render questions on the first pane and scripture on the last
                  item.key === '0'
                  ? props.activeDatabase.questions[
                      props.thisLesson.fellowshipType
                    ].concat(
                      props.activeDatabase.questions[
                        props.thisLesson.applicationType
                      ]
                    )
                  : props.thisLesson.scripture
                : []
            }
            renderItem={renderTextContent}
            keyExtractor={item => item.header}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <View style={{ height: 10 }} />}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.albumArtContainer}>
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
                width={Dimensions.get('window').width - 80}
                height={Dimensions.get('window').width - 80}
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
        <Text style={Typography(props, 'h3', 'medium', 'left', colors.shark)}>
          {textList.item.header}
        </Text>
        <Text style={Typography(props, 'h3', 'regular', 'left', colors.shark)}>
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
        snapToInterval={Dimensions.get('window').width - 60}
        decelerationRate={'fast'}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={{ width: 20, height: '100%' }} />
        )}
        ListHeaderComponent={() => <View style={{ width: 40 }} />}
        ListFooterComponent={() => <View style={{ width: 40 }} />}
        getItemLayout={(data, index) => ({
          length: Dimensions.get('window').width - 60,
          offset: Dimensions.get('window').width - 60 * index,
          index
        })}
        initialScrollIndex={1}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewRef.current}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  albumArtContainer: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width - 80,
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
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(AlbumArtSwiper)
