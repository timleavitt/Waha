import React, { useState } from 'react'
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import PagerView from 'react-native-pager-view'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { activeGroupSelector } from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import {
  getLanguageFont,
  StandardTypography,
  SystemTypography
} from '../styles/typography'
import WahaButton from './standard/WahaButton'

function mapStateToProps (state) {
  return activeGroupSelector(state)
    ? {
        font: getLanguageFont(activeGroupSelector(state).language)
      }
    : {}
}

function OnboardingSwiper ({
  // Props passed from a parent component.
  isRTL,
  sources,
  titles,
  messages,
  onFinish,
  nextTranslation,
  startTranslation,
  useDefaultFont,
  // Props passed from redux.
  font = null
}) {
  const [onboardingPage, setOnboardingPage] = useState(1)
  const [pagerRef, setPagerRef] = useState()
  var dots = []

  titles.forEach((title, index) => {
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
  titles.forEach((title, index) => {
    pages.push(
      <View style={{ flexDirection: 'row', flex: 1 }} key={index}>
        <View style={styles.page}>
          <Image style={styles.image} source={sources[index]} />
          <View>
            <Text
              style={[
                useDefaultFont
                  ? SystemTypography(
                      false,
                      'h2',
                      'Bold',
                      'center',
                      colors.shark
                    )
                  : StandardTypography(
                      { font, isRTL },
                      'h2',
                      'Bold',
                      'center',
                      colors.shark
                    ),
                { marginVertical: 10 }
              ]}
            >
              {titles[index]}
            </Text>
            <Text
              style={
                useDefaultFont
                  ? SystemTypography(
                      false,
                      'h3',
                      'Regular',
                      'center',
                      colors.chateau
                    )
                  : StandardTypography(
                      { font, isRTL },
                      'h3',
                      'Regular',
                      'center',
                      colors.chateau
                    )
              }
            >
              {messages[index]}
            </Text>
          </View>
        </View>

        {/* <View style={{}}>
          {index === titles.length - 1 ? (
            <TouchableOpacity onPress={onFinish}>
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
        onPress={onFinish}
      >
        <Icon name='cancel' color={colors.oslo} size={40 * scaleMultiplier} />
      </TouchableOpacity> */}
      <PagerView
        ref={ref => (ref ? setPagerRef(ref) : null)}
        // showPageIndicator
        style={styles.pager}
        initialPage={isRTL ? pages.length - 1 : 0}
        onPageSelected={stuff => setOnboardingPage(stuff.nativeEvent.position)}
      >
        {isRTL ? pages.reverse() : pages}
      </PagerView>
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
            isRTL
              ? onboardingPage === 0
                ? colors.apple
                : colors.blue
              : onboardingPage === pages.length - 1
              ? colors.apple
              : colors.blue
          }
          onPress={
            isRTL
              ? onboardingPage === 0
                ? onFinish
                : () => pagerRef.setPage(onboardingPage - 1)
              : onboardingPage === pages.length - 1
              ? onFinish
              : () => pagerRef.setPage(onboardingPage + 1)
          }
          label={
            isRTL
              ? onboardingPage === 0
                ? startTranslation
                : nextTranslation
              : onboardingPage === pages.length - 1
              ? startTranslation
              : nextTranslation
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
            alignItems: isRTL ? 'flex-start' : 'flex-end',
            opacity: checkmarkOpacity
          }}
        >
          {/* <TouchableOpacity onPress={onFinish}> */}
        {/* <TouchableOpacity onPress={onFinish}>
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

export default connect(mapStateToProps)(OnboardingSwiper)
