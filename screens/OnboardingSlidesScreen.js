//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Image, FlatList, Dimensions } from 'react-native';
import i18n from 'i18n-js';

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

  const [pageNumber, setPageNumber] = useState(0)
  const [flatListRef, setFlatListRef] = useState()

  const onViewRef = React.useRef(({viewableItems})=> {
    if(viewableItems) {
      setPageNumber(viewableItems[0].index)
    }
  })

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

  useEffect(() => {
    if(flatListRef) {
      flatListRef.scrollToIndex({index: pageNumber})
    }
  }, [pageNumber])

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

  i18n.translations = {
    en: { 
      title0: 'Welcome to the app!',
      body0: 'Jeff keeps adding new features for me to do :)' ,
      title1: 'I enjoy it though',
      body1: 'Here\'s a picture of me as a kid',
      title2: 'Sometimes when I code,',
      body2: 'I get frustrated and make the face of this cat',
      title3: 'And then I ask myself',
      body3: 'Why do I do it?',
      prev: 'Previous',
      next: 'Next',
      finish: 'Finish'
    },
    es: {
      title0: 'Bienvenido a la aplicación!',
      body0: 'Jeff sigue agregando nuevas funciones para que yo haga :)' ,
      title1: 'Aunque lo disfruto',
      body1: 'Aquí hay una foto mía de niño',
      title2: 'A veces cuando codifico,',
      body2: 'Me frustro y hago la cara de este gato',
      title3: 'Y luego me pregunto',
      body3: '¿Por qué lo hago?',
      prev: 'Previo',
      next: 'Siguiente',
      finish: 'Terminar'
    }
  };

  
  ////////////////////////////////
  ////RENDER/STYLES/NAVOPTIONS////
  ////////////////////////////////

  const onboardingData = [
    {
      key: '0',
      imageSource: require('../assets/onboarding/meme1.png'),
      title: i18n.t('title0'),
      body: i18n.t('body0'),
    },
    {
      key: '1',
      imageSource: require('../assets/onboarding/meme2.jpg'),
      title: i18n.t('title1'),
      body: i18n.t('body1'),
    },
    {
      key: '2',
      imageSource: require('../assets/onboarding/meme3.jpg'),
      title: i18n.t('title2'),
      body: i18n.t('body2'),
    },
    {
      key: '3',
      imageSource: require('../assets/onboarding/meme4.jpg'),
      title: i18n.t('title3'),
      body: i18n.t('body3'),
    }
  ]

  function renderOnboardingSlide(slideList) {
    return (
      <View style={styles.pageContainer}>
        <View style={styles.imageContainer}>
          <Image source={slideList.item.imageSource} style={styles.image} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{slideList.item.title}</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.body}>{slideList.item.body}</Text>
        </View>
      </View>
    )
  }

  //create modal in here, pass state to show it to lesson item so lesson item
  //can change it and show the modal on this screen
  return (
    <View style={styles.screen}>
        <FlatList 
          renderItem={renderOnboardingSlide}
          data={onboardingData}
          ref={(ref) => {setFlatListRef(ref)}}
          horizontal={true}
          pagingEnabled={true}
          snapToAlignment={"start"}
          snapToInterval={Dimensions.get('window').width}
          decelerationRate={"fast"}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />
      <View style={styles.buttonsContainer}>
        <View>
          {pageNumber > 0 ? <Button title= {i18n.t('prev')} onPress={() => incrementPageNumber("prev")}/>: null}
        </View>
        <View>
          <Button title={pageNumber !== 3 ? i18n.t('next') : i18n.t('finish')} onPress={pageNumber !== 3 ? () => incrementPageNumber("next") : () => props.navigation.replace("StudySet")}/>
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
    width: Dimensions.get('window').width,
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