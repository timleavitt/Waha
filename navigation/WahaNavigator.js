import React from 'react';

import MainNavigator from './MainNavigator'
import OnboardingNavigator from './OnboaringNavigator'

import { connect } from 'react-redux'

function WahaNavigator(props) {
   //only go to main navigation once we're ready to start
   if (!props.isFirstOpen && !props.isFetching && props.isReadyToStart)
      return <MainNavigator />
   else
      return <OnboardingNavigator />
}

function mapStateToProps(state) {
   return {
      isFirstOpen: state.database.isFirstOpen,
      isFetching: state.database.isFetching,
      isReadyToStart: state.database.isReadyToStart
   }
};

export default connect(mapStateToProps)(WahaNavigator);