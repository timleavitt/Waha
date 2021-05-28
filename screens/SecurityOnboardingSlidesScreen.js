import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import PagerView from 'react-native-pager-view'
import { connect } from 'react-redux'
import OnboardingPage from '../components/OnboardingPage'
import PageDots from '../components/PageDots'
import WahaBackButton from '../components/WahaBackButton'
import WahaButton from '../components/WahaButton'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    t: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state),
    isTablet: state.deviceInfo.isTablet
  }
}

const numPages = 4

/**
 * A screen that guides the user through what security mode is.
 */
const SecurityOnboardingSlidesScreen = ({
  // Props passed from navigation.
  navigation: { setOptions, navigate, goBack },
  t,
  font,
  isTablet,
  isRTL,
  activeGroup
}) => {
  /** The ref for the pager view. Used to manually swipe pages. */
  const pagerRef = useRef()

  /** Keeps track of onboarding page we're currently on. */
  const [activePage, setActivePage] = useState(0)

  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions({
      headerRight: isRTL
        ? () => <WahaBackButton onPress={() => goBack()} />
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <WahaBackButton onPress={() => goBack()} />
    })
  }, [])

  // The 4 onboarding pages. These are stored here in an array so that we can call pages.reverse() to reverse the order of the pages for RTL languages.
  const pages = [
    <OnboardingPage
      key='1'
      title={t.security && t.security.onboarding_1_title}
      message={t.security && t.security.onboarding_1_message}
    >
      <View
        style={[
          styles.imageContainer,
          {
            maxWidth: isTablet
              ? Dimensions.get('window').width * 0.7
              : Dimensions.get('window').width - 40,
            maxHeight: isTablet
              ? Dimensions.get('window').width * 0.7
              : Dimensions.get('window').width - 40
          }
        ]}
      >
        <Image
          style={styles.image}
          source={require('../assets/onboardingImages/security_onboarding1.png')}
        />
      </View>
    </OnboardingPage>,
    <OnboardingPage
      key='2'
      title={t.security && t.security.onboarding_2_title}
      message={t.security && t.security.onboarding_2_message}
    >
      <View
        style={[
          styles.imageContainer,
          {
            maxWidth: isTablet
              ? Dimensions.get('window').width * 0.7
              : Dimensions.get('window').width - 40,
            maxHeight: isTablet
              ? Dimensions.get('window').width * 0.7
              : Dimensions.get('window').width - 40
          }
        ]}
      >
        <Image
          style={styles.image}
          source={require('../assets/onboardingImages/security_onboarding2.png')}
        />
      </View>
    </OnboardingPage>,
    <OnboardingPage
      key='3'
      title={t.security && t.security.onboarding_3_title}
      message={t.security && t.security.onboarding_3_message}
    >
      <View
        style={[
          styles.imageContainer,
          {
            maxWidth: isTablet
              ? Dimensions.get('window').width * 0.7
              : Dimensions.get('window').width - 40,
            maxHeight: isTablet
              ? Dimensions.get('window').width * 0.7
              : Dimensions.get('window').width - 40
          }
        ]}
      >
        <Image
          style={styles.image}
          source={require('../assets/onboardingImages/security_onboarding3.png')}
        />
      </View>
    </OnboardingPage>,
    <OnboardingPage
      key='4'
      title={t.security && t.security.onboarding_4_title}
      message={t.security && t.security.onboarding_4_message}
    >
      <View
        style={[
          styles.imageContainer,
          {
            maxWidth: isTablet
              ? Dimensions.get('window').width * 0.7
              : Dimensions.get('window').width - 40,
            maxHeight: isTablet
              ? Dimensions.get('window').width * 0.7
              : Dimensions.get('window').width - 40
          }
        ]}
      >
        <Image
          style={styles.image}
          source={require('../assets/onboardingImages/security_onboarding4.png')}
        />
      </View>
    </OnboardingPage>
  ]

  return (
    <View style={styles.screen}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={isRTL ? numPages - 1 : 0}
        onPageSelected={({ nativeEvent }) =>
          // Set the active page to the new page.
          setActivePage(nativeEvent.position)
        }
      >
        {isRTL ? pages.reverse() : pages}
      </PagerView>
      <View
        style={[
          styles.bottomControlsContainer,
          { flexDirection: isRTL ? 'row-reverse' : 'row' }
        ]}
      >
        <PageDots numDots={numPages} activeDot={activePage} />
        <View
          style={[
            styles.skipButtonContainer,
            { flexDirection: isRTL ? 'row-reverse' : 'row' }
          ]}
        >
          <TouchableOpacity
            onPress={() => navigate('PianoPasscodeSet')}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              style={StandardTypography(
                { font, isRTL, isTablet },
                'h4',
                'Bold',
                'center',
                colors.shark
              )}
            >
              {t.general && t.general.skip}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: 20 }} />
        <WahaButton
          label={t.general && t.general.continue}
          onPress={
            // This button goes to the next page or finishes onboarding if we're on the last page.
            isRTL
              ? activePage === 0
                ? () => navigate('PianoPasscodeSet')
                : () => pagerRef.current.setPage(activePage - 1)
              : activePage === 3
              ? () => navigate('PianoPasscodeSet')
              : () => pagerRef.current.setPage(activePage + 1)
          }
          type='filled'
          color={colors.apple}
          style={{
            // Make the continue button twice as big as the skip button.
            flex: 2
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  pager: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.athens,
    aspectRatio: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%'
  },
  bottomControlsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  skipButtonContainer: {
    height: 65 * scaleMultiplier,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
})

export default connect(mapStateToProps)(SecurityOnboardingSlidesScreen)
