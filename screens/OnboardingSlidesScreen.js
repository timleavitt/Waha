//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';

//redux imports
import { toggleComplete } from '../redux/actions/appProgressActions'
import { setFirstOpen } from '../redux/actions/databaseActions'
import { connect } from 'react-redux'

function OnboardingSlidesScreen(props) {

  
  //////////////////////////////////////////
  ////STATE, CONSTRUCTOR, AND NAVIGATION////
  //////////////////////////////////////////


  function navigateToLoading() {
    props.navigation.navigate({
      routeName: "Loading",
      params: {
        
      }
    })
  }

  useEffect(() => {
    props.setFirstOpen(false)
}, [])


  ///////////////////////
  ////OTHER FUNCTIONS////
  ///////////////////////

  
  ////////////////////////////////
  ////RENDER/STYLES/NAVOPTIONS////
  ////////////////////////////////


  //create modal in here, pass state to show it to lesson item so lesson item
  //can change it and show the modal on this screen
  return (
    <View style={styles.screen}>
        <Text>Language select screen</Text>
        <Button title="navigate to loading screen" onPress={navigateToLoading}/>
    </View>
  )
}

OnboardingSlidesScreen.navigationOptions = navigationData => {
  return {
    headerShown: false
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
  //console.log(state)
  return {
  }
};

function mapDispatchToProps(dispatch) {
  return {
    setFirstOpen: toSet => dispatch(setFirstOpen(toSet)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingSlidesScreen);