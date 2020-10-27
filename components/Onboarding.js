import ViewPager from '@react-native-community/viewpager'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import WahaButton from '../components/WahaButton'
import { colors, scaleMultiplier } from '../constants'

function Onboarding (props) {
  const [onboardingPage, setOnboardingPage] = useState(1)
  const [checkmarkOpacity, setCheckmarkOpacity] = useState(
    new Animated.Value(0)
  )
  const [pagerRef, setPagerRef] = useState()

  useEffect(() => {
    if (
      (props.isRTL && onboardingPage === 0) ||
      (!props.isRTL && onboardingPage === props.titles.length - 1)
    ) {
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
              Typography(props, 'h2', 'medium', 'center', colors.shark),
              { fontWeight: props.font ? null : 'bold', marginVertical: 10 }
            ]}
          >
            {props.titles[index]}
          </Text>
          <Text
            style={Typography(props, 'h3', 'regular', 'center', colors.chateau)}
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
    <SafeAreaView style={{ flex: 1 }}>
      {/* <TouchableOpacity
        style={{ position: 'absolute', marginTop: 20, marginLeft: 10 }}
        onPress={props.onFinish}
      >
        <Icon name='cancel' color={colors.oslo} size={40 * scaleMultiplier} />
      </TouchableOpacity> */}
      <ViewPager
        ref={ref => (ref ? setPagerRef(ref) : null)}
        // showPageIndicator
        style={styles.pager}
        initialPage={props.isRTL ? pages.length - 1 : 0}
        onPageSelected={stuff => setOnboardingPage(stuff.nativeEvent.position)}
      >
        {props.isRTL ? pages.reverse() : pages}
      </ViewPager>
      <View
        style={{
          width: '100%',
          // height: 200 * scaleMultiplier,
          flexDirection: 'column',
          alignSelf: 'flex-end',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}
      >
        <WahaButton
          type='filled'
          color={
            onboardingPage === pages.length - 1 ? colors.apple : colors.blue
          }
          onPress={
            onboardingPage === pages.length - 1
              ? props.onFinish
              : () => pagerRef.setPage(onboardingPage + 1)
          }
          label={
            onboardingPage === pages.length - 1
              ? i18n.t('start')
              : i18n.t('next')
          }
          style={{
            width: Dimensions.get('window').width - 40,
            marginHorizontal: 20,
            height: 68 * scaleMultiplier
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {dots}
        </View>

        {/* <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            alignItems: props.isRTL ? 'flex-start' : 'flex-end',
            opacity: checkmarkOpacity
          }}
        >
          {/* <TouchableOpacity onPress={props.onFinish}> */}
        {/* <TouchableOpacity onPress={props.onFinish}>
          <Icon name='check' size={50} color={colors.tuna} />
        </TouchableOpacity> */}
        {/* </Animated.View> */}
      </View>
      {/* <ViewPager ref={ref => (ref ? console.log(ref.setPage) : null)} /> */}
    </SafeAreaView>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
    width: Dimensions.get('window').width - 100 * scaleMultiplier,
    height: Dimensions.get('window').width - 100 * scaleMultiplier,
    borderRadius: 20
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
