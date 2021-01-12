import ViewPager from '@react-native-community/viewpager'
import React, { useState } from 'react'
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { colors, getLanguageFont, scaleMultiplier } from '../constants'
import { StandardTypography, SystemTypography } from '../styles/typography'
import WahaButton from './standard/WahaButton'

function OnboardingSwiper (props) {
  const [onboardingPage, setOnboardingPage] = useState(1)
  const [pagerRef, setPagerRef] = useState()
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
          <View>
            <Text
              style={[
                props.useDefaultFont
                  ? SystemTypography(
                      false,
                      'h2',
                      'Bold',
                      'center',
                      colors.shark
                    )
                  : StandardTypography(
                      props,
                      'h2',
                      'Bold',
                      'center',
                      colors.shark
                    ),
                { marginVertical: 10 }
              ]}
            >
              {props.titles[index]}
            </Text>
            <Text
              style={
                props.useDefaultFont
                  ? SystemTypography(
                      false,
                      'h3',
                      'Regular',
                      'center',
                      colors.chateau
                    )
                  : StandardTypography(
                      props,
                      'h3',
                      'Regular',
                      'center',
                      colors.chateau
                    )
              }
            >
              {props.messages[index]}
            </Text>
          </View>
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
          paddingHorizontal: 20,
          marginBottom: 20
        }}
      >
        <WahaButton
          type='filled'
          color={
            props.isRTL
              ? onboardingPage === 0
                ? colors.apple
                : colors.blue
              : onboardingPage === pages.length - 1
              ? colors.apple
              : colors.blue
          }
          onPress={
            props.isRTL
              ? onboardingPage === 0
                ? props.onFinish
                : () => pagerRef.setPage(onboardingPage - 1)
              : onboardingPage === pages.length - 1
              ? props.onFinish
              : () => pagerRef.setPage(onboardingPage + 1)
          }
          label={
            props.isRTL
              ? onboardingPage === 0
                ? props.startTranslation
                : props.nextTranslation
              : onboardingPage === pages.length - 1
              ? props.startTranslation
              : props.nextTranslation
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
    width: Dimensions.get('window').width * scaleMultiplier * scaleMultiplier,
    height:
      Dimensions.get('window').width * 0.6 * scaleMultiplier * scaleMultiplier,
    borderRadius: 20
  },
  pager: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  page: {
    justifyContent: 'space-around',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20 * scaleMultiplier
  },
  dot: {
    marginHorizontal: 10
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return activeGroup
    ? {
        font: getLanguageFont(activeGroup.language),
        activeGroup: activeGroup
      }
    : {}
}

export default connect(mapStateToProps)(OnboardingSwiper)
