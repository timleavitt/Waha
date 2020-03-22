//imports
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Button, Modal, Alert } from 'react-native';
import LessonItem from '../components/LessonItem';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

//redux imports
import { downloadLesson } from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/appProgressActions'
import { connect } from 'react-redux'

function LessonListScreen(props) {

  
  //////////////////////////////////////////
  ////STATE, CONSTRUCTOR, AND NAVIGATION////
  //////////////////////////////////////////


  //simple state to switch back and forth whenever we want to re-render
  //the screen. attached to the extraData prop on the flatlist
  const [refresh, setRefresh] = useState(false);

  //modal states
  const [idToDownload, setIDToDownload] = useState(null);
  const [showSaveLessonModal, setShowSaveLessonModal] = useState(false);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [showLessonOptionsModal, setShowLessonOptionsModal] = useState(false);

  //find our specified study set with data taken from the last screen
  selectedStudySetArray = props.database[props.database.currentLanguage].studySets.filter(studyset => studyset.id === props.navigation.getParam("studySetID"));

  //make our data only the array of lessons
  selectedLessonList = selectedStudySetArray[0].lessons;

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
        scripture: item.scripture
      }
    })
  }


  ///////////////////////
  ////OTHER FUNCTIONS////
  ///////////////////////


  //PURPOSE: delete a lesson .mp3 of id set by an individual flatlist item
  function deleteLesson() {
    FileSystem.deleteAsync(FileSystem.documentDirectory + idToDownload + '.mp3')
    hideModals();
    setRefresh(old => !old)
  }

  //PURPOSE: download a lesson .mp3 of id set by an individual flatlist item
  function downloadLesson() {
    //get our source from our array of lessons in this study set
    const currentLesson = selectedLessonList.filter(lesson => lesson.id === idToDownload)
    const source = currentLesson[0].source
    props.downloadLesson(idToDownload, source);
    hideModals();
  }

  //PURPOSE: hide the modal without doing anything
  function hideModals() {
    setShowSaveLessonModal(false);
    setShowDeleteLessonModal(false);
    setShowLessonOptionsModal(false);
  }
  
  //PURPOSE: change the complete status via redux dispatch
  function toggleComplete(whatToMark) {
    if (idToDownload in props.appProgress && whatToMark === 'incomplete') {
      props.toggleComplete(idToDownload);
    } else if (!(idToDownload in props.appProgress) && whatToMark === 'complete') {
      props.toggleComplete(idToDownload); 
    }
    hideModals();
  }

  //share lesson functionality
  function shareLesson(chapter) {
    switch (chapter) {
      case 'fellowship':
        Sharing.shareAsync(FileSystem.documentDirectory + props.currentLanguage + 'chapter1.mp3')
        break;
      case 'passage':
        FileSystem.getInfoAsync(FileSystem.documentDirectory + idToDownload + '.mp3')
        .then(({ exists }) => {
            exists ? 
              Sharing.shareAsync(FileSystem.documentDirectory + idToDownload + '.mp3') : 
              Alert.alert('Error', 
              'Lesson must be downloaded before share is enabled!',
              [{
                text: 'OK', 
                onPress: () => {}
              }])
        })
        
        break;
      case 'application':
        Sharing.shareAsync(FileSystem.documentDirectory + props.currentLanguage + 'chapter3.mp3')
        break;
    }
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
        setShowLessonOptionsModal={() => setShowLessonOptionsModal(true)}
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
          <Button title="Cancel" onPress={hideModals} />
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
          <Button title="Cancel" onPress={hideModals} />
        </View>
      </Modal>
      <Modal 
        visible={showLessonOptionsModal}
        animationType="slide"
        presentationStyle="overFullScreen"
        transparent={true}
      >
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end", paddingBottom: "5%"}}>
          <Button title="Mark lesson as complete" onPress={() => toggleComplete('complete')} />
          <Button title="Mark lesson as incomplete" onPress={() => toggleComplete('incomplete')} />
          <Button title="Share Chapter 1: Fellowship" onPress={() => shareLesson('fellowship')} />
          <Button title="Share Chapter 2: Passage" onPress={() => shareLesson('passage')} />
          <Button title="Share Chapter 3: Application" onPress={() => shareLesson('application')} />
          <Button title="Mark lesson as incomplete" onPress={() => toggleComplete('incomplete')} />
          <Button title="Close" onPress={hideModals} />
        </View>
      </Modal>
    </View>
  )
}

LessonListScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "waha"
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
  console.log(state.downloads)
  return {
    downloads: state.downloads,
    appProgress: state.appProgress,
    database: state.database,
    currentLanguage: state.database.currentLanguage
  }
};

function mapDispatchToProps(dispatch) {
  return {
    downloadLesson: (lessonID, source) => {dispatch(downloadLesson(lessonID, source))},
    toggleComplete: lessonID => {dispatch(toggleComplete(lessonID))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonListScreen);