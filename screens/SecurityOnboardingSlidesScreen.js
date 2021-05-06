import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import OnboardingSwiper from '../components/OnboardingSwiper'
import WahaBackButton from '../components/WahaBackButton'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

function mapStateToProps (state) {
  return {
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state)
  }
}

/**
 * A screen that guides the user through what security mode is.
 */
const SecurityOnboardingSlidesScreen = ({
  // Props passed from navigation.
  navigation: { setOptions, navigate, goBack },
  translations,
  font,
  isRTL,
  activeGroup
}) => {
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

  return (
    <View style={styles.screen}>
      <OnboardingSwiper
        isRTL={isRTL ? true : false}
        sources={[
          require('../assets/onboardingImages/security_onboarding1.png'),
          require('../assets/onboardingImages/security_onboarding2.png'),
          require('../assets/onboardingImages/security_onboarding3.png'),
          require('../assets/onboardingImages/security_onboarding4.png')
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
        onFinish={() => navigate('PianoPasscodeSet')}
        nextTranslation={translations.general.next}
        startTranslation={translations.general.start}
        useDefaultFont={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'column',
    justifyContent: 'center'
  }
})

export default connect(mapStateToProps)(SecurityOnboardingSlidesScreen)
