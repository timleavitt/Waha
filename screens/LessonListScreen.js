//normal imports imports
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, AsyncStorage, Button, Modal } from 'react-native';
//import Modal from 'react-native-modal'
import LessonItem from '../components/LessonItem';
import { useFocusEffect } from 'react-navigation-hooks';
import * as FileSystem from 'expo-file-system';

//redux imports
import { downloadLesson, toggleComplete } from '../redux/actions'
import { connect } from 'react-redux'

//data import
import { STUDYSETS } from '../data/dummy-data';

function LessonListScreen(props) {

  
  //////////////////////////////////////////
  ////STATE, CONSTRUCTOR, AND NAVIGATION////
  //////////////////////////////////////////


  //simple state to switch back and forth whenever we want to re-render
  //the screen. attached to the extraData prop on the flatlist
  const [refresh, setRefresh] = useState(false);

  //modal states
  const [showSaveLessonModal, setShowSaveLessonModal] = useState(false);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [idToDownload, setIDToDownload] = useState(null);

  //find our specified study set with data taken from the last screen
  selectedStudySetArray = STUDYSETS.filter(studyset => studyset.id === props.navigation.getParam("studySetID"));

  //make our data only the array of lessons
  selectedLessonList = selectedStudySetArray[0].lessonList;

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


  //PURPOSE: delete a lesson .mp3 of id set by an individual flatlist item
  function deleteLesson() {
    FileSystem.deleteAsync(FileSystem.documentDirectory + idToDownload + '.mp3')
    setShowDeleteLessonModal(false);
    setRefresh(old => !old)
  }

  //PURPOSE: download a lesson .mp3 of id set by an individual flatlist item
  function downloadLesson() {
    props.downloadLesson(idToDownload);
    setShowSaveLessonModal(false);
  }

  //PURPOSE: hide the modal without doing anything
  function hideModal() {
    setShowSaveLessonModal(false);
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
        isComplete={(LessonList.item.id in props.appProgress)}
        downloadProgress={props.downloads[LessonList.item.id]}
        setShowSaveLessonModal={() => setShowSaveLessonModal(true)}
        setShowDeleteLessonModal={() => setShowDeleteLessonModal(true)}
        setIDToDownload={() => setIDToDownload(LessonList.item.id)}
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
      <Modal 
        visible={showSaveLessonModal}
        animationType="slide"
        presentationStyle="overFullScreen"
        transparent={true}
      >
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end", paddingBottom: "5%"}}>
          <Button title="Download lesson" onPress={downloadLesson} />
          <Button title="Cancel" onPress={hideModal} />
        </View>
      </Modal>
      <Modal 
        visible={showDeleteLessonModal}
        animationType="slide"
        presentationStyle="overFullScreen"
        transparent={true}
      >
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end", paddingBottom: "5%"}}>
          <Button title="Delete lesson" onPress={deleteLesson} />
          <Button title="Cancel" onPress={hideModal} />
        </View>
      </Modal>
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
  console.log(state)
  return {
    downloads: state.downloads,
    appProgress: state.appProgress
  }
};

function mapDispatchToProps(dispatch) {
  return {
    downloadLesson: lessonID => {dispatch(downloadLesson(lessonID))},
    toggleComplete: lessonID => {dispatch(toggleComplete(lessonID))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonListScreen);