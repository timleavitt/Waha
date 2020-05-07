import React, { useState, useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { AsyncStorage } from 'react-native'
import { scaleMultiplier } from '../constants'
import WahaDrawer from '../components/WahaDrawer'
import { updateConnectionStatus } from '../redux/actions/networkActions'
import StackNavigator from './StackNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { connect } from 'react-redux'
import { resumeDownload } from '../redux/actions/downloadActions'
import { db, storeData } from '../redux/actions/databaseActions'

const Drawer = createDrawerNavigator()

//allows only accessing hamburger swipe from study set screen
function getGestureEnabled (route) {
  // Access the tab navigator's state using `route.state`
  const routeName = route.state
    ? // Get the currently active route name in the tab navigator
      route.state.routes[route.state.index].name
    : // If state doesn't exist, we need to default to `screen` param if available, or the initial screen
      // In our case, it's "Feed" as that's the first screen inside the navigator
      route.params?.screen || 'Set'
  if (routeName === 'Set') return true
  else return false
}

function DrawerNavigator (props) {
  useEffect(() => {
    // add listener for connection status and update it accordingly
    const unsubscribe = NetInfo.addEventListener(state => {
      props.updateConnectionStatus(state.isConnected)
    })

    // add listener for receiving updates in firebase
    db.collection('languages')
      .doc(props.activeGroup.language)
      .onSnapshot(function (doc) {
        props.storeData(doc.data(), props.activeGroup.language)
      })

    return function cleanup () {
      unsubscribe()
    }
  }, [])

  // if we connect to internet, check to see if we have any paused downloads
  useEffect(() => {
    if (props.isConnected) {
      checkPausedDownloads()
    }
  }, [props.isConnected])

  //// FUNCTIONS
  async function checkPausedDownloads () {
    props.activeDatabase.lessons.forEach(async lesson => {
      await AsyncStorage.getItem(lesson.id).then(async value => {
        if (value) {
          props.resumeDownload(lesson.id, value)
        }
      })
    })
  }

  var direction = props.isRTL ? 'right' : 'left'
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerPosition={direction}
        drawerType='back'
        drawerContent={props => <WahaDrawer {...props} />}
        drawerStyle={{
          width: '80%'
        }}
        edgeWidth={300 * scaleMultiplier}
      >
        <Drawer.Screen
          options={({ route }) => ({
            gestureEnabled: getGestureEnabled(route)
          })}
          name='StackNavigator'
          component={StackNavigator}
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
    activeGroup: activeGroup
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateConnectionStatus: status => {
      dispatch(updateConnectionStatus(status))
    },
    resumeDownload: (lessonID, downloadSnapshotJSON) => {
      dispatch(resumeDownload(lessonID, downloadSnapshotJSON))
    },
    storeData: (data, language) => {
      dispatch(storeData(data, language))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerNavigator)
