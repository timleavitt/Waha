import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import OnboardingSwiper from '../components/OnboardingSwiper'
import BackButton from '../components/standard/BackButton'
import { colors } from '../constants'

function SecurityOnboardingSlidesScreen (props) {
  //+ STATE

  //+ CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  //+ NAV OPTIONS
  function getNavOptions () {
    return {
      headerRight: props.isRTL
        ? () => <BackButton onPress={() => props.navigation.goBack()} />
        : () => <View></View>,
      headerLeft: props.isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => props.navigation.goBack()} />
    }
  }

  //+ RENDER

  return (
    <View style={styles.screen}>
      <OnboardingSwiper
        isRTL={props.isRTL ? true : false}
        sources={[
          require('../assets/onboarding/security_onboarding1.png'),
          require('../assets/onboarding/security_onboarding2.png'),
          require('../assets/onboarding/security_onboarding3.png'),
          require('../assets/onboarding/security_onboarding4.png')
        ]}
        titles={[
          props.translations.security.popups.onboarding_1_title,
          props.translations.security.popups.onboarding_2_title,
          props.translations.security.popups.onboarding_3_title,
          props.translations.security.popups.onboarding_4_title
        ]}
        messages={[
          props.translations.security.popups.onboarding_1_message,
          props.translations.security.popups.onboarding_2_message,
          props.translations.security.popups.onboarding_3_message,
          props.translations.security.popups.onboarding_4_message
        ]}
        onFinish={() => props.navigation.navigate('KeyOrderSet_Initial')}
        nextTranslation={props.translations.general.next}
        startTranslation={props.translations.general.start}
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
    font: state.database[activeGroup.language].font,
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(SecurityOnboardingSlidesScreen)
