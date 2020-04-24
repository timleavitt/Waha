import React from 'react';
import DrawerNavigator from './DrawerNavigator'
import OnboardingNavigator from './OnboaringNavigator'
import LoadingScreen from '../screens/LoadingScreen'
import { connect } from 'react-redux'

function WahaNavigator(props) {
   if (!props.isFirstOpen && !props.isFetching && props.isReadyToStart)
      return <DrawerNavigator />
   else if (!props.isFirstOpen && props.isFetching && props.isReadyToStart)
      return <LoadingScreen/>
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