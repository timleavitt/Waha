import i18n from 'i18n-js'
import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import OnboardingSwiper from '../components/OnboardingSwiper'
import { getSystemIsRTL } from '../constants'
import { setHasOnboarded } from '../redux/actions/databaseActions'
import { colors } from '../styles/colors'
import ar from '../translations/ar.json'
import en from '../translations/en.json'

i18n.translations = {
  en,
  ar
}

function WahaOnboardingSlidesScreen ({
  // Props passed from navigation.
  navigation: { navigate },
  route: {
    // Props passed from previous screen.
    params: { selectedLanguage }
  },
  // Props passed from redux.
  setHasOnboarded
}) {
  //+ FUNCTIONS

  // tells redux that we're ready to go to loading screen once onboarding is finished
  function finishOnboarding () {
    setHasOnboarded(true)
    navigate('Loading', {
      selectedLanguage: selectedLanguage
    })
  }

  //+ RENDER

  return (
    <SafeAreaView style={styles.screen}>
      <OnboardingSwiper
        sources={[
          require('../assets/onboarding/onboarding1.png'),
          require('../assets/onboarding/onboarding2.png'),
          require('../assets/onboarding/onboarding3.png'),
          require('../assets/onboarding/onboarding4.png')
        ]}
        titles={[
          i18n.t('title0'),
          i18n.t('title1'),
          i18n.t('title2'),
          i18n.t('title3')
        ]}
        messages={[
          i18n.t('body0'),
          i18n.t('body1'),
          i18n.t('body2'),
          i18n.t('body3')
        ]}
        onFinish={finishOnboarding}
        nextTranslation={i18n.t('next')}
        startTranslation={i18n.t('start')}
        useDefaultFont={true}
        isRTL={getSystemIsRTL()}
      />
    </SafeAreaView>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    justifyContent: 'center'
  }
})

//+REDUX

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    setHasOnboarded: toSet => dispatch(setHasOnboarded(toSet))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WahaOnboardingSlidesScreen)
