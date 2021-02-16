import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import OnboardingSwiper from '../components/OnboardingSwiper'
import BackButton from '../components/standard/BackButton'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

function SecurityOnboardingSlidesScreen ({
  // Props passed from navigation.
  navigation: { setOptions, navigate, goBack },
  translations,
  font,
  isRTL,
  activeGroup
}) {
  //+ STATE

  //+ CONSTRUCTOR

  useEffect(() => {
    setOptions(getNavOptions())
  }, [])

  //+ NAV OPTIONS
  function getNavOptions () {
    return {
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => goBack()} />
    }
  }

  //+ RENDER

  return (
    <View style={styles.screen}>
      <OnboardingSwiper
        isRTL={isRTL ? true : false}
        sources={[
          require('../assets/onboarding/security_onboarding1.png'),
          require('../assets/onboarding/security_onboarding2.png'),
          require('../assets/onboarding/security_onboarding3.png'),
          require('../assets/onboarding/security_onboarding4.png')
        ]}
        titles={[
          translations.security.popups.onboarding_1_title,
          translations.security.popups.onboarding_2_title,
          translations.security.popups.onboarding_3_title,
          translations.security.popups.onboarding_4_title
        ]}
        messages={[
          translations.security.popups.onboarding_1_message,
          translations.security.popups.onboarding_2_message,
          translations.security.popups.onboarding_3_message,
          translations.security.popups.onboarding_4_message
        ]}
        onFinish={() => navigate('KeyOrderSet_Initial')}
        nextTranslation={translations.general.next}
        startTranslation={translations.general.start}
        useDefaultFont={false}
      />
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    flexDirection: 'column',
    justifyContent: 'center'
  }
})

//+REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(SecurityOnboardingSlidesScreen)
