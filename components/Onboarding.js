import ViewPager from '@react-native-community/viewpager'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { colors, scaleMultiplier } from '../constants'

function Onboarding (props) {
  const [onboardingPage, setOnboardingPage] = useState(1)
  const [checkmarkOpacity, setCheckmarkOpacity] = useState(
    new Animated.Value(0)
  )
  const [pagerRef, setPagerRef] = useState()

  useEffect(() => {
    if (onboardingPage === props.titles.length - 1) {
      Animated.timing(checkmarkOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start()
    } else {
      Animated.timing(checkmarkOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start()
    }
  }, [onboardingPage])

  var dots = []
  props.titles.forEach((title, index) => {
    dots.push(
      <View
        style={[
          styles.dot,
          {
            backgroundColor:
              index === onboardingPage ? colors.tuna : colors.chateau,
            width:
              index === onboardingPage
                ? 10 * scaleMultiplier
                : 8 * scaleMultiplier,
            height:
              index === onboardingPage
                ? 10 * scaleMultiplier
                : 8 * scaleMultiplier,
            borderRadius:
              index === onboardingPage
                ? 5 * scaleMultiplier
                : 4 * scaleMultiplier
          }
        ]}
        key={index}
      />
    )
  })

  var pages = []
  props.titles.forEach((title, index) => {
    pages.push(
      <View style={{ flexDirection: 'row', flex: 1 }} key={index}>
        <View style={styles.page}>
          <Image style={styles.image} source={props.sources[index]} />
          <Text
            style={[
              {
                fontFamily: props.font ? props.font + '-medium' : null,
                fontWeight: props.font ? null : 'bold'
              },
              styles.title
            ]}
          >
            {props.titles[index]}
          </Text>
          <Text
            style={[
              { fontFamily: props.font ? props.font + '-regular' : null },
              styles.message
            ]}
          >
            {props.messages[index]}
          </Text>
        </View>

        {/* <View style={{}}>
          {index === props.titles.length - 1 ? (
            <TouchableOpacity onPress={props.onFinish}>
              <Icon name='check' size={50} color={colors.tuna} />
            </TouchableOpacity>
          ) : null}
        </View> */}
      </View>
    )
  })

  return (
    <View style={{ flex: 1 }}>
      <ViewPager
        ref={ref => (ref ? setPagerRef(ref) : null)}
        // showPageIndicator
        style={styles.pager}
        initialPage={0}
        onPageSelected={stuff => setOnboardingPage(stuff.nativeEvent.position)}
      >
        {pages}
      </ViewPager>
      <View
        style={{
          width: '100%',
          height: 80 * scaleMultiplier,
          flexDirection: 'column',
          alignSelf: 'flex-end',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {dots}
        </View>
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            alignItems: 'flex-end',
            opacity: checkmarkOpacity
          }}
        >
          {/* <TouchableOpacity onPress={props.onFinish}> */}
          <TouchableOpacity onPress={props.onFinish}>
            <Icon name='check' size={50} color={colors.tuna} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      {/* <ViewPager ref={ref => (ref ? console.log(ref.setPage) : null)} /> */}
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
    width: Dimensions.get('window').width - 100 * scaleMultiplier,
    height: Dimensions.get('window').width - 100 * scaleMultiplier
  },
  pager: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  page: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20 * scaleMultiplier
  },
  dot: {
    marginHorizontal: 10
  }
})

export default Onboarding
