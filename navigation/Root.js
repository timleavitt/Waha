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
    props.haveFinishedInitialFetch &&
    !props.isFetching &&
    props.haveFinishedOnboarding
  ) {
    return <MainDrawer />
  } else if (
    !props.haveFinishedInitialFetch ||
    (props.haveFinishedInitialFetch && !props.haveFinishedOnboarding)
  ) {
    return <Onboarding />
  } else {
    return <LoadingScreen />
  }
}

function mapStateToProps (state) {
  return {
    haveFinishedOnboarding: state.database.haveFinishedOnboarding,
    haveFinishedInitialFetch: state.database.haveFinishedInitialFetch,
    isFetching: state.fetchingStatus.isFetching
  }
}

export default connect(mapStateToProps)(Root)
