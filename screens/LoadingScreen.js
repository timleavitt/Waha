//imports
import React, { useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';

//redux imports
import { toggleComplete } from '../redux/actions/appProgressActions'
import { connect } from 'react-redux'

function LoadingScreen(props) {

  
  //////////////////////////////////////////
  ////STATE, CONSTRUCTOR, AND NAVIGATION////
  //////////////////////////////////////////


//   function navigateToOnboarding() {
//     props.navigation.navigate({
//       routeName: "Onboarding",
//       params: {
        
//       }
//     })
//   }


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
    </View>
  )
}

// LoadingScreen.navigationOptions = navigationData => {
//   return {
//     header: null
//   };
// };

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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);