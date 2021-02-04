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

const Drawer = createDrawerNavigator()

function MainDrawer (props) {
  //- allows only accessing hamburger swipe from study set screen
  function getGestureEnabled (route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'SetTabs'
    if (routeName === 'SetTabs') return true
    else return false

    // const routeName = route.state
    //   ? route.state.routes[route.state.index].name
    //   : route.params?.screen || props.security.securityEnabled
    //   ? 'PianoApp'
    //   : 'SetTabs'
    // if (routeName === 'SetTabs') return true
    // else return false
  }

  useEffect(() => {
    // add listener for connection status and update it accordingly
    const netInfoUnsubscribe = NetInfo.addEventListener(state => {
      props.updateConnectionStatus(state.isConnected)
    })

    //+ FIRESTORE LISTENERS

    var localLanguageInfo = {}
    var localSets = []

    db.collection('languages')
      .doc(props.activeGroup.language)
      .onSnapshot(function (doc) {
        if (doc.data()) {
          props.storeLanguageData(doc.data(), props.activeGroup.language)
          localLanguageInfo = doc.data()
        }
      })

    db.collection('sets')
      .where('languageID', '==', props.activeGroup.language)
      .onSnapshot(querySnapshot => {
        // make this work without internet
        if (!querySnapshot.empty) {
          var sets = []
          querySnapshot.forEach(doc => {
            sets.push({
              id: doc.id,
              ...doc.data()
            })
          })

          // store the new sets object
          props.storeLanguageSets(sets, props.activeGroup.language)
        }
      })

    // if (props.isConnected) {
    // try {
    //   // listener for languages collection
    //   db.collection('languages')
    //     .doc(props.activeGroup.language)
    //     .onSnapshot(function (doc) {
    //       console.log(Object.keys(doc.data()))
    //       //- download a file
    //       function downloadSomething (url, fileName) {
    //         var downloadResumable = FileSystem.createDownloadResumable(
    //           url,
    //           FileSystem.documentDirectory +
    //             props.activeGroup.language +
    //             '-' +
    //             fileName,
    //           {}
    //         )
    //         return downloadResumable.downloadAsync().catch(error => {
    //           throw error
    //         })
    //       }

    //       // check for new fellowship or application chapters or header image
    //       doc.data().files.forEach(fileName => {
    //         if (!props.activeDatabase.files.includes(fileName)) {
    //           Alert.alert(
    //             props.translations.general.popups.new_chapter_downloading_title,
    //             props.translations.general.popups
    //               .new_chapter_downloading_message,
    //             [{ text: props.translations.general.ok, onPress: () => {} }]
    //           )
    //           if (fileName.includes('header'))
    //             return downloadSomething(
    //               `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${props.activeGroup.language}%2Fother%2F${fileName}.png?alt=media`,
    //               fileName.slice(0, -3) + '.png'
    //             )
    //           else
    //             return downloadSomething(
    //               `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${props.activeGroup.language}%2Fother%2F${fileName}.mp3?alt=media`,
    //               fileName.slice(0, -3) + '.mp3'
    //             )
    //         }
    //       })

    //       // store data from update
    //       props.storeLanguageData(
    //         { ...doc.data(), sets: props.activeDatabase.sets },
    //         props.activeGroup.language
    //       )

    //       localLanguageInfo = doc.data()

    //       // console.log(props.activeDatabase.translations)

    //       // TODO at some point
    //       // if
    //       // 1. all core story sets are completed
    //       // 2. a new core story set has been addded

    //       // 1. add it automatically to added sets for this group
    //       // 2. make it display the 'new' icon somehow

    //       // if
    //       // 1. mobilization tools is unlocked for this group
    //       // 2. a new mobilization tools set is added
    //       // if (props.activeGroup.setShouldShowMobilizationToolsTab && )

    //       // 1. add it automatically to added sets for htis group
    //       // 2. make it dispaly the 'new' icon somehow
    //     })

    //   // listener for sets collection
    //   db.collection('sets')
    //     .where('languageID', '==', props.activeGroup.language)
    //     .onSnapshot(querySnapshot => {
    //       // get all sets and put them in one object for redux storage
    //       var sets = []
    //       querySnapshot.forEach(doc => {
    //         sets.push({
    //           id: doc.id,
    //           ...doc.data()
    //         })
    //       })

    //       // store the new sets object
    //       props.storeLanguageData(
    //         { ...localLanguageInfo, sets: sets },
    //         props.activeGroup.language
    //       )
    //     })
    // } catch (error) {
    //   console.log(error)
    // }
    // }
    return function cleanup () {
      netInfoUnsubscribe()
    }
  }, [])

  // side of navigation drawer
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
