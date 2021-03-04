import React from 'react'
import { connect } from 'react-redux'
import { groupNames } from '../constants'
import { changeActiveGroup, createGroup } from '../redux/actions/groupsActions'
import LoadingScreen from '../screens/LoadingScreen'
import MainDrawer from './MainDrawer'
import Onboarding from './Onboarding'

function mapStateToProps (state) {
  if (state.activeGroup)
    return {
      hasOnboarded: state.database.hasOnboarded,
      hasInstalledFirstLanguageInstance:
        state.database.hasInstalledFirstLanguageInstance,
      isInstallingLanguageInstance: state.isInstallingLanguageInstance,
      activeGroup: state.activeGroup,
      groups: state.groups,
      database: state.database
    }
  else
    return {
      hasOnboarded: state.database.hasOnboarded,
      hasInstalledFirstLanguageInstance:
        state.database.hasInstalledFirstLanguageInstance,
      isInstallingLanguageInstance: state.isInstallingLanguageInstance
    }
}

function mapDispatchToProps (dispatch) {
  return {
    changeActiveGroup: name => {
      dispatch(changeActiveGroup(name))
    },
    createGroup: (groupName, language, emoji) =>
      dispatch(createGroup(groupName, language, emoji))
  }
}

/**
 * This component renders a navigator conditionally based on state. It's the first thing rendered in App.js.
 */
function Root ({
  // Props passed from redux.
  hasOnboarded,
  hasInstalledFirstLanguageInstance,
  isInstallingLanguageInstance,
  activeGroup = null,
  groups = null,
  database = null,
  changeActiveGroup,
  createGroup
}) {
  // Below are some failsafes to keep the app functioning in case of group errors.
  if (activeGroup) {
    // If somehow, every group got deleted, create a new group in one of the installed languages so that the app can still function.
    if (groups.length === 0) {
      var languageID
      Object.keys(database).forEach(key => {
        if (key.length === 2) {
          languageID = key
        }
      })
      createGroup(groupNames[languageID], languageID, 'default')
      changeActiveGroup(groupNames[languageID])
      // If somehow, we switch to a group that doesn't exist, fall back to the first group in the groups redux array so that the app can still function.
    } else if (!groups.some(group => activeGroup === group.name)) {
      changeActiveGroup(groups[0].name)
    }
  }

  /*
  Conditionally render the navigator based on the state of the 3 redux variables above. There's 3 possible options:
    1. If the user has already installed their first language instance, isn't currently installing a language instance, and has gone through the onboarding sequence, then show the normal MainDrawer navigator.
    2. If the user hasn't installed their first language instance OR has but hasn't finished onboarding yet, then the user is opening up the app for the first time, or else cancelled their install and still needs to install their first language instance. In this case, the Onboarding navigator should be rendered.
    3. If the user has installed their first language instance and is currently installing a language instance, we're installing a subsequent language instance and should render the Loading screen.
  */
  if (
    hasInstalledFirstLanguageInstance &&
    !isInstallingLanguageInstance &&
    hasOnboarded
  ) {
    return <MainDrawer />
  } else if (
    !hasInstalledFirstLanguageInstance ||
    (hasInstalledFirstLanguageInstance && !hasOnboarded)
  ) {
    return <Onboarding />
  } else {
    return <LoadingScreen />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
