import React from 'react'
import { connect } from 'react-redux'
import LoadingScreen from '../screens/LoadingScreen'
import MainDrawer from './MainDrawer'
import Onboarding from './Onboarding'

function Root (props) {
  // const [appState, setAppState] = useState('')

  // function handleAppStateChange (change) {
  //   setAppState(change)
  // }

  // useEffect(() => {
  //   const appStateUnsubscribe = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange
  //   )
  //   return function cleanup () {
  //     AppState.removeEventListener('change', handleAppStateChange)
  //   }
  // }, [])
  if (
    props.haveFinishedInitialFetch &&
    !props.isFetching &&
    props.haveFinishedOnboarding
  ) {
    // if (appState === 'inactive' || appState === 'background') {
    //   return <GameScreen />
    // } else
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
