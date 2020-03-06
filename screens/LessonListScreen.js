//normal imports imports
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, AsyncStorage } from 'react-native';
import Modal from 'react-native-modal'
import LessonItem from '../components/LessonItem';
import { useFocusEffect } from 'react-navigation-hooks';
import * as FileSystem from 'expo-file-system';

//redux imports
import { downloadLesson, purge } from '../redux/actions'
import { connect } from 'react-redux'

//data import
import { STUDYSETS } from '../data/dummy-data';

function LessonListScreen(props) {

  
  //////////////////////////////////////////
  ////STATE, CONSTRUCTOR, AND NAVIGATION////
  //////////////////////////////////////////


  //state to hold a temp version of our progress so we can pass it to 
  //our flatlist items and re-render whenever it changes
  const [progress, setProgress] = useState({});

  //simple state to switch back and forth whenever we want to re-render
  //the screen. attached to the extraData prop on the flatlist
  const [refresh, setRefresh] = useState(false);

  //find our specified study set with data taken from the last screen
  selectedStudySetArray = STUDYSETS.filter(studyset => studyset.id === props.navigation.getParam("studySetID"));

  //make our data only the array of lessons
  selectedLessonList = selectedStudySetArray[0].lessonList;

  useFocusEffect(
    React.useCallback(() => {
      //console.log("useFocus has triggered, refreshing...")
      fetchCompleteStatuses();

      return () => { };
    }, [])
  );

  //function to navigate to the play screen
  //props.navigation.navigate takes us to the play screen
  //params is the information we want to pass to play screen
  function navigateToPlay(item) {
    props.navigation.navigate({
      routeName: "Play",
      params: {
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        source: item.source,
      }
    })
  }


  ///////////////////////
  ////OTHER FUNCTIONS////
  ///////////////////////


  //PURPOSE: get the progress object from async and set our local 
  //progress state to whatever we receive
  async function fetchCompleteStatuses() {
    await AsyncStorage
      .getItem("progress")
      .then(value => {
        setProgress(JSON.parse(value))
      })
  }

  //PURPOSE: delete a lesson .mp3 from a specific address
  //is passed to each lessonlist item
  function deleteLesson(item) {
    FileSystem.deleteAsync(FileSystem.documentDirectory + item.id + '.mp3')
    setRefresh(old => !old)
  }


  ////////////////////////////////
  ////RENDER/STYLES/NAVOPTIONS////
  ////////////////////////////////


  //PURPOSE: function to render each individual lesson item in the flatlist
  function renderLessonItem(LessonList) {
    return (
      <LessonItem
        id={LessonList.item.id}
        title={LessonList.item.title}
        subtitle={LessonList.item.subtitle}
        onLessonSelect={() => navigateToPlay(LessonList.item)}
        downloadLesson={() => props.downloadLesson(LessonList.item.id)}
        deleteLesson={() => deleteLesson(LessonList.item)}
        isComplete={progress[LessonList.item.id]}
        downloadProgress={props.downloads[LessonList.item.id]}
      />
    )
  }

  //create modal in here, pass state to show it to lesson item so lesson item
  //can change it and show the modal on this screen
  return (
    <View style={styles.screen}>
      <FlatList
        data={selectedLessonList}
        renderItem={renderLessonItem}
        extraData={refresh}
      />
    </View>
  )
}

LessonListScreen.navigationOptions = navigationData => {
  return {
    headerTitle: navigationData.navigation.getParam("title")
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
    downloads: state.downloads,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    downloadLesson: lessonID => {dispatch(downloadLesson(lessonID))},
    purge: () => {dispatch(purge())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonListScreen);