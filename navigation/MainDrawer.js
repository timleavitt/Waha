import NetInfo from '@react-native-community/netinfo'
import { createDrawerNavigator } from '@react-navigation/drawer'
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer
} from '@react-navigation/native'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import WahaDrawer from '../components/WahaDrawer'
import { scaleMultiplier } from '../constants'
import db from '../firebase/db'
import {
  storeLanguageData,
  storeLanguageSets
} from '../redux/actions/databaseActions'
import { updateConnectionStatus } from '../redux/actions/networkActions'
import MainStack from './MainStack'

// Create the drawer navigator.
const Drawer = createDrawerNavigator()

/**
 * This component renders a drawer navigator that contains Waha's navigation drawer. It's placed around the MainStack navigator. It also contains a ton of logic related to things that happen globally in the background, such as updating the connection status and retrieving updates from Firestore.
 */
function MainDrawer ({
  // Props passed from redux.
  isRTL,
  activeDatabase,
  isConnected,
  translations,
  activeGroup,
  security,
  updateConnectionStatus,
  storeLanguageData
}) {
  /**
   * Determines whether a screen should be able to access the navigation drawer via gesture. Should only return true on the StorySetTabs navigator because this is the only spot we should be able to swipe to open the drawer.
   * @param {string} route - The route passed from the navigation component.
   * @return {boolean} - Whether gestures should be enabled or not.
   */
  function getGestureEnabled (route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'StorySetTabs'
    if (routeName === 'StorySetTabs') return true
    else return false
  }

  useEffect(() => {
    // Add a listener for connection status and update the redux state accordingly.
    const netInfoUnsubscribe = NetInfo.addEventListener(state => {
      updateConnectionStatus(state.isConnected)
    })

    //+ FIRESTORE LISTENERS

    var localLanguageInfo = {}
    var localSets = []

    db.collection('languages')
      .doc(activeGroup.language)
      .onSnapshot(function (doc) {
        if (doc.data()) {
          storeLanguageData(doc.data(), activeGroup.language)
          localLanguageInfo = doc.data()
        }
      })

    db.collection('sets')
      .where('languageID', '==', activeGroup.language)
      .onSnapshot(querySnapshot => {
        if (!querySnapshot.empty) {
          var sets = []
          querySnapshot.forEach(doc => {
            sets.push({
              id: doc.id,
              ...doc.data()
            })
          })
          storeLanguageSets(sets, activeGroup.language)
        }
      })

    return function cleanup () {
      netInfoUnsubscribe()
    }
  }, [])

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerPosition={isRTL ? 'right' : 'left'}
        drawerType='back'
        drawerContent={props => <WahaDrawer {...props} />}
        drawerStyle={{
          width: '80%'
        }}
        edgeWidth={75 * scaleMultiplier}
      >
        <Drawer.Screen
          options={({ route }) => ({
            gestureEnabled: getGestureEnabled(route)
          })}
          name='MainStack'
          component={MainStack}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]

  return {
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    isConnected: state.network.isConnected,
    translations: state.database[activeGroup.language].translations,
    activeGroup: activeGroup,
    security: state.security
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateConnectionStatus: status => {
      dispatch(updateConnectionStatus(status))
    },
    storeLanguageData: (data, language) => {
      dispatch(storeLanguageData(data, language))
    },
    storeLanguageSets: (sets, language) => {
      dispatch(storeLanguageSets(sets, language))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainDrawer)
