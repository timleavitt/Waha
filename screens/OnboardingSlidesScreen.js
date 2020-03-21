//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';

//redux imports
import { toggleComplete } from '../redux/actions/appProgressActions'
import { setFirstOpen } from '../redux/actions/databaseActions'
import { connect } from 'react-redux'
import { addLanguage, changeLanguage } from '../redux/actions/databaseActions'


function OnboardingSlidesScreen(props) {

  
  //////////////////////////////////////////
  ////STATE, CONSTRUCTOR, AND NAVIGATION////
  //////////////////////////////////////////


  function navigateToLoading() {
    props.navigation.replace("StudySet")
  }

  useEffect(() => {
    props.setFirstOpen(false)
    var language = props.navigation.getParam("selectedLanguage")
    props.changeLanguage(language)
    props.addLanguage(language)
  }, [])

  const [pageNumber, setPageNumber] = useState(1)

  ///////////////////////
  ////OTHER FUNCTIONS////
  ///////////////////////

  function incrementPageNumber(direction) {
    if (direction === "next") {
      setPageNumber(oldPageNumber =>  oldPageNumber += 1)
    } else {
      setPageNumber(oldPageNumber => oldPageNumber -= 1)
    }
  }

  useEffect(() => {
    console.log(pageNumber)
  }, [pageNumber])

  
  ////////////////////////////////
  ////RENDER/STYLES/NAVOPTIONS////
  ////////////////////////////////
  var image;
  var title;
  var body;
  switch (pageNumber) {
    case 1:
      image = <Image source={require('../assets/meme1.png')} style={styles.image}/>
      title = <Text style={styles.title}>Welcome to the app!</Text>
      body = <Text style={styles.body}>Jeff keeps adding new features for me to do :)</Text>
      break;
    case 2:
      image = <Image source={require('../assets/meme2.jpg')} style={styles.image}/>
      title = <Text style={styles.title}>I enjoy it though</Text>
      body = <Text style={styles.body}>Here's a picture of me as a kid</Text>
      break;
    case 3:
      image = <Image source={require('../assets/meme3.jpg')} style={styles.image}/>
      title = <Text style={styles.title}>Sometimes when I code</Text>
      body = <Text style={styles.body}>I get frustrated and make the face of this cat</Text>
      break;
    case 4:
      image = <Image source={require('../assets/meme4.jpg')} style={styles.image}/>
      title = <Text style={styles.title}>And then I ask myself</Text>
      body = <Text style={styles.body}>Why do I do it?</Text>
      break;
    default:
      console.log('out of page number bounds')
  }

  //create modal in here, pass state to show it to lesson item so lesson item
  //can change it and show the modal on this screen
  return (
    <View style={styles.screen}>
      <View style={styles.pageContainer}>
        <View style={styles.imageContainer}>
          {image}
        </View>
        <View style={styles.titleContainer}>
          {title}
        </View>
        <View style={styles.bodyContainer}>
          {body}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View>
          {pageNumber > 1 ? <Button title="Prev" onPress={() => incrementPageNumber("prev")}/>: null}
        </View>
        <View>
          <Button title={pageNumber !== 4 ? "Next" : "Finish"} onPress={pageNumber !== 4 ? () => incrementPageNumber("next") : () => props.navigation.replace("StudySet")}/>
        </View>
      </View>
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
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  pageContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    flex: 1
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    width: "100%",
    height: "20%",
    padding: 100
  },
  titleContainer: {
    width: "100%",
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 50,
    flexWrap: "wrap",
  },
  bodyContainer: {
    width: "100%",
    padding: 20,
  },
  body: {
    textAlign: "center",
    fontSize: 20,
    flexWrap: "wrap",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
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
    addLanguage: language => dispatch(addLanguage(language)),
    changeLanguage: language => dispatch(changeLanguage(language)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingSlidesScreen);