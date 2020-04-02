//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';

import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'

//redux imports
import { connect } from 'react-redux'
import { addLanguage, changeLanguage } from '../redux/actions/databaseActions'
import { resetProgress } from '../redux/actions/appProgressActions';

function GroupsScreen(props) {

  
  //////////////////////////////////////////
  ////STATE, CONSTRUCTOR, AND NAVIGATION////
  //////////////////////////////////////////


  
  //set language based on user's language vs user's location?
  useEffect(() => {
   props.navigation.setOptions(getNavOptions())
  }, [])

  function getNavOptions() {
   return {
       headerRight: props.isRTL ? () =>
         <BackButton
            isRTL={props.isRTL}
            onPress={() => props.navigation.goBack()}
         /> :
         () => <View></View>,
      headerLeft: props.isRTL ? () =>
         <View></View> :
         () =>
         <BackButton
            isRTL={props.isRTL}
            onPress={() => props.navigation.goBack()}
         />,
   }
}

  ///////////////////////
  ////OTHER FUNCTIONS////
  ///////////////////////



  ////////////////////////////////
  ////RENDER/STYLES/NAVOPTIONS////
  ////////////////////////////////


  //create modal in here, pass state to show it to lesson item so lesson item
  //can change it and show the modal on this screen
  return (
    <View>
       <Button title="test" onPress={() => props.navigation.navigate('AddNewGroup')}/>
    </View>
  )
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#F7F7F7"
      //justifyContent: "flex-start"
   },
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
  console.log(state.groups)
  return {
    downloads: state.downloads,
    appProgress: state.appProgress,
    database: state.database,
    colors: state.database[state.database.currentLanguage].colors,
    isRTL: state.database[state.database.currentLanguage].isRTL,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    addLanguage: language => dispatch(addLanguage(language)),
    changeLanguage: language => dispatch(changeLanguage(language)),
    resetProgress: () => dispatch(resetProgress())
  }
} 

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);