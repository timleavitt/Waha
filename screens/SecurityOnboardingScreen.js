import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Button,
  Image,
  FlatList,
  Dimensions
} from 'react-native'
import i18n from 'i18n-js'
import { connect } from 'react-redux'
import { createGroup, changeActiveGroup } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'
import BackButton from '../components/BackButton'
import Onboarding from 'react-native-onboarding-swiper'

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
      backgroundColor: '#FFFFFF',
      image: (
        <Image
          style={styles.image}
          source={require('../assets/onboarding/onboarding1.png')}
        />
      ),
      title: props.translations.security.popups.onboarding_1_title,
      subtitle: props.translations.security.popups.onboarding_1_message
    },
    {
      backgroundColor: '#FFFFFF',
      image: (
        <Image
          style={styles.image}
          source={require('../assets/onboarding/onboarding2.png')}
        />
      ),
      title: props.translations.security.popups.onboarding_2_title,
      subtitle: props.translations.security.popups.onboarding_2_message
    },
    {
      backgroundColor: '#FFFFFF',
      image: (
        <Image
          style={styles.image}
          source={require('../assets/onboarding/onboarding3.png')}
        />
      ),
      title: props.translations.security.popups.onboarding_3_title,
      subtitle: props.translations.security.popups.onboarding_3_message
    }
  ]

  return (
    <View style={styles.screen}>
      <Onboarding
        pages={onboardingData}
        showSkip={false}
        onDone={finishOnboarding}
        nextLabel={props.translations.general.next}
        containerStyles={{ marginTop: 0 }}
        imageContainerStyles={{
          paddingBottom: Dimensions.get('window').width < 700 ? 0 : 60
        }}
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F9FA',
    flexDirection: 'column',
    justifyContent: 'space-between'
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
