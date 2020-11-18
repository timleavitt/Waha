import React from 'react'
import { connect } from 'react-redux'
import LoadingScreen from '../screens/LoadingScreen'
import MainDrawer from './MainDrawer'
import Onboarding from './Onboarding'

function Root (props) {
  // conditionally render the right navigator
  // if we're done with onboarding/fetching, render the main drawer
  // if we're not done with those things, render the onboarding screens
  // otherwise, we're fetching, so render the loading screen
  if (
    props.hasInstalledFirstLanguageInstance &&
    !props.isInstallingLanguageInstance &&
    props.hasOnboarded
  ) {
    return <MainDrawer />
  } else if (
    !props.hasInstalledFirstLanguageInstance ||
    (props.hasInstalledFirstLanguageInstance && !props.hasOnboarded)
  ) {
    return <Onboarding />
  } else {
    return <LoadingScreen />
  }
}

function mapStateToProps (state) {
  return {
    hasOnboarded: state.database.hasOnboarded,
    hasInstalledFirstLanguageInstance:
      state.database.hasInstalledFirstLanguageInstance,
    isInstallingLanguageInstance: state.isInstallingLanguageInstance
  }
}

export default connect(mapStateToProps)(Root)
