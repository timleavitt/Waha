import React, { useEffect } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import { colors, scaleMultiplier } from '../constants'
function SecurityOnboardingScreen (props) {
  //// STATE

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  //// NAV OPTIONS
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

  // //// FUNCTIONS

  // tells redux that we're ready to go to loading screen once onboarding is finished
  function finishOnboarding () {
    props.navigation.navigate('KeyOrderSet_Initial')
  }

  //// RENDER

  const onboardingData = [
    {
      backgroundColor: colors.white,
      image: (
        <Image
          style={styles.image}
          source={require('../assets/onboarding/security_onboarding1.png')}
        />
      ),
      title: props.translations.security.popups.onboarding_1_title,
      subtitle: props.translations.security.popups.onboarding_1_message
    },
    {
      backgroundColor: colors.white,
      image: (
        <Image
          style={styles.image}
          source={require('../assets/onboarding/security_onboarding2.png')}
        />
      ),
      title: props.translations.security.popups.onboarding_2_title,
      subtitle: props.translations.security.popups.onboarding_2_message
    },
    {
      backgroundColor: colors.white,
      image: (
        <Image
          style={styles.image}
          source={require('../assets/onboarding/security_onboarding3.png')}
        />
      ),
      title: props.translations.security.popups.onboarding_3_title,
      subtitle: props.translations.security.popups.onboarding_3_message
    }
  ]

  return (
    <View style={styles.screen}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Onboarding
          pages={onboardingData}
          showSkip={false}
          onDone={finishOnboarding}
          nextLabel={props.translations.general.next}
          containerStyles={{
            marginTop: Dimensions.get('window').height > 600 ? 100 : 0,
            justifyContent: 'flex-start'
          }}
          imageContainerStyles={{
            paddingBottom: 0
          }}
        />
      </View>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  image: {
    resizeMode: 'center',
    width:
      Dimensions.get('window').width < 700
        ? 241 * scaleMultiplier
        : 321 * scaleMultiplier,
    height:
      Dimensions.get('window').width < 700
        ? 204 * scaleMultiplier
        : 272 * scaleMultiplier
  }
})

////REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    translations: state.database[activeGroup.language].translations
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecurityOnboardingScreen)
