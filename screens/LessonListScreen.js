//imports
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import LessonItem from '../components/LessonItem';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import StudySetItemSmall from '../components/StudySetItemSmall';
import FlatListSeparator from '../components/FlatListSeparator'
import WahaModal from '../components/WahaModal'
import ModalButton from '../components/ModalButton'
import NetInfo from '@react-native-community/netinfo';
import { scaleMultiplier } from '../constants'
import BackButton from '../components/BackButton'

//redux imports
import { downloadLesson } from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/groupsActions'
import { connect } from 'react-redux'

function LessonListScreen(props) {

   //////////////////////////////////////////
   ////STATE, CONSTRUCTOR, AND NAVIGATION////
   //////////////////////////////////////////


   //simple state to switch back and forth whenever we want to re-render
   //the screen. attached to the extraData prop on the flatlist
   const [refresh, setRefresh] = useState(false);
   const [isConnected, setIsConnected] = useState(false);

   //modal states
   const [idToDownload, setIDToDownload] = useState(null);
   const [showSaveLessonModal, setShowSaveLessonModal] = useState(false);
   const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
   const [showLessonOptionsModal, setShowLessonOptionsModal] = useState(false);

   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
      const unsubscribe = NetInfo.addEventListener(state => {
         setIsConnected(state.isConnected)
      });
      return function cleanup() {
         unsubscribe();
      }
   }, [])

   function getNavOptions() {
      return {
         headerRight: props.route.params.isRTL ? () =>
            <BackButton
               isRTL={props.route.params.isRTL}
               onPress={() => props.navigation.goBack()}
            /> :
            () => <View></View>,
         headerLeft: props.route.params.isRTL ? () =>
            <View></View> :
            () =>
               <BackButton
                  isRTL={props.route.params.isRTL}
                  onPress={() => props.navigation.goBack()}
               />,
         //gestureDirection: props.route.params.isRTL ? 'horizontal-inverted' : 'horizontal'
      }
   }
   //function to navigate to the play screen
   //props.navigation.navigate takes us to the play screen
   //params is the information we want to pass to play screen
   function navigateToPlay(item) {
      props.navigation.navigate('Play', {
         id: item.id,
         title: item.title,
         subtitle: item.subtitle,
         source: item.source,
         scripture: item.scripture,
         iconName: props.route.params.iconName,
         isRTL: props.route.params.isRTL
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
      if (props.currentProgress.includes(idToDownload) && whatToMark === 'incomplete') {
         props.toggleComplete(props.activeGroupName, idToDownload);
      } else if (!props.currentProgress.includes(idToDownload) && whatToMark === 'complete') {
         props.toggleComplete(props.activeGroupName, idToDownload);
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
                           onPress: () => { }
                        }])
               })

            break;
         case 'application':
            Sharing.shareAsync(FileSystem.documentDirectory + props.currentLanguage + 'chapter3.mp3')
            break;
      }
   }

   function markUpToThisPointAsComplete(id) {
      var languageAndStudySet = id.substr(0, 4)
      var markToLesson = id.substr(4, 5)

      for (var i = 1; i <= parseInt(markToLesson); i++) {
         var formattedID = ("0" + i).slice(-2);
         idToMark = languageAndStudySet + formattedID
         if (!props.currentProgress.includes(idToMark)) {
            props.toggleComplete(props.activeGroupName, idToMark)
         }
      }
      hideModals();
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
            isComplete={props.currentProgress.includes(LessonList.item.id)}
            downloadProgress={props.downloads[LessonList.item.id]}
            setShowSaveLessonModal={() => setShowSaveLessonModal(true)}
            setShowDeleteLessonModal={() => setShowDeleteLessonModal(true)}
            setIDToDownload={() => setIDToDownload(LessonList.item.id)}
            setShowLessonOptionsModal={() => setShowLessonOptionsModal(true)}
            setRefresh={() => setRefresh()}
            isConnected={isConnected}
         />
      )
   }

   //create modal in here, pass state to show it to lesson item so lesson item
   //can change it and show the modal on this screen
   return (
      <View style={styles.screen}>
         <View style={styles.studySetItemContainer}>
            <StudySetItemSmall
               title={props.route.params.title}
               subtitle={props.route.params.subtitle}
               id={props.route.params.studySetID}
               iconName={props.route.params.iconName}
            />
         </View>
         <FlatListSeparator />
         <FlatList
            data={props.database[props.currentLanguage].studySets.filter(studyset => studyset.id === props.route.params.studySetID)[0].lessons}
            renderItem={renderLessonItem}
            extraData={refresh}
            ItemSeparatorComponent={FlatListSeparator}
         />
         <WahaModal isVisible={showSaveLessonModal}>
            <ModalButton title="Download lesson" onPress={downloadLesson} />
            <ModalButton title="Cancel" onPress={hideModals} style={{ color: "red" }} />
         </WahaModal>
         <WahaModal isVisible={showDeleteLessonModal}>
            <ModalButton title="Delete lesson" onPress={deleteLesson} />
            <ModalButton title="Cancel" onPress={hideModals} style={{ color: "red" }} />
         </WahaModal>
         <WahaModal isVisible={showLessonOptionsModal}>
            <ModalButton title="Mark lesson as complete" onPress={() => toggleComplete('complete')} />
            <ModalButton title="Mark lesson as incomplete" onPress={() => toggleComplete('incomplete')} />
            <ModalButton title="Share Chapter 1: Fellowship" onPress={() => shareLesson('fellowship')} />
            <ModalButton title="Share Chapter 2: Passage" onPress={() => shareLesson('passage')} />
            <ModalButton title="Share Chapter 3: Application" onPress={() => shareLesson('application')} />
            <ModalButton title="Mark to this point at complete" onPress={() => markUpToThisPointAsComplete(idToDownload)} />
            <ModalButton title="Close" onPress={hideModals} style={{ color: "red" }} />
         </WahaModal>
      </View>
   )
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "#F7F9FA"
   },
   studySetItemContainer: {
      width: "100%",
      height: 80 * scaleMultiplier
   },
   headerImage: {
      resizeMode: "center",
      width: 120,
      height: 40,
   }
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   console.log(activeGroup.progress)

   return {
      downloads: state.downloads,
      currentProgress: activeGroup.progress,
      database: state.database,
      currentLanguage: activeGroup.language,
      colors: state.database[activeGroup.language].colors,
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroupName: state.activeGroup
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: (groupName, lessonID) => { dispatch(toggleComplete(groupName, lessonID)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonListScreen);