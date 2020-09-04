import i18n from 'i18n-js'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import Onboarding from '../components/Onboarding'
import { colors } from '../constants'
import {
  addLanguage,
  changeLanguage,
  setFinishedOnboarding
} from '../redux/actions/databaseActions'
import { changeActiveGroup } from '../redux/actions/groupsActions'
// translations import
import en from '../translations/en.json'

function OnboardingSlidesScreen (props) {
  //// STATE

  // translations for language select
  i18n.translations = {
    en
  }

  //// CONSTRUCTOR

  useEffect(() => {
    var language = props.route.params.selectedLanguage
    props.addLanguage(language)
  }, [])

  // //// FUNCTIONS

  // tells redux that we're ready to go to loading screen once onboarding is finished
  function finishOnboarding () {
    props.setFinishedOnboarding(true)
    props.navigation.navigate('Loading')
  }

  //// RENDER

  return (
    <View style={styles.screen}>
      <Onboarding
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
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    justifyContent: 'center'
  }
})

////REDUX

function mapStateToProps (state) {
  return {
    isFetching: state.database.isFetching
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addLanguage: language => dispatch(addLanguage(language)),
    changeLanguage: language => dispatch(changeLanguage(language)),
    setFinishedOnboarding: toSet => dispatch(setFinishedOnboarding(toSet)),
    changeActiveGroup: name => {
      dispatch(changeActiveGroup(name))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingSlidesScreen)
