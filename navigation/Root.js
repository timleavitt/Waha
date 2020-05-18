import React from 'react'
import MainDrawer from './MainDrawer'
import Onboarding from './Onboarding'
import LoadingScreen from '../screens/LoadingScreen'
import { connect } from 'react-redux'

function Root (props) {
  if (
    props.haveFinishedInitialFetch &&
    !props.isFetching &&
    props.haveFinishedOnboarding
  ) {
    return <MainDrawer />
    // } else if ((props.haveFinishedOnboarding && props.isFetching && !props.haveFinishedInitialFetch) || (props.haveFinishedOnboarding && props.fetchError)) {
    //    return <LoadingScreen/>
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
    isFetching: state.fetchingStatus.isFetching,
    fetchError: state.fetchingStatus.fetchError
  }
}

export default connect(mapStateToProps)(Root)
