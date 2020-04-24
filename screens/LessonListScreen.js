import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, Image, Button, Text } from 'react-native';
import LessonItem from '../components/LessonItem';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import SetItem from '../components/SetItem';
import WahaModal from '../components/WahaModal'
import ModalButton from '../components/ModalButton'
import NetInfo from '@react-native-community/netinfo';
import { scaleMultiplier } from '../constants'
import BackButton from '../components/BackButton'
import { downloadLesson } from '../redux/actions/downloadActions'
import { toggleComplete, setBookmark } from '../redux/actions/groupsActions'
import { connect } from 'react-redux'

function LessonListScreen(props) {

   //// STATE

   // switches back and forth whenever we want to re-render
   // the screen (attached to the extraData prop on the flatlist)
   const [refresh, setRefresh] = useState(false);

   // keeps track of whether the user has internet connection
   const [isConnected, setIsConnected] = useState(false);

   // keeps track of the lesson to download/delete/toggle complete when modals are up
   const [activeLessonInModal, setActiveLessonInModal] = useState({});

   // modal states
   const [showSaveLessonModal, setShowSaveLessonModal] = useState(false);
   const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
   const [showLessonOptionsModal, setShowLessonOptionsModal] = useState(false);
   


   //// CONSTRUCTOR

   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
      const unsubscribe = NetInfo.addEventListener(state => {
         setIsConnected(state.isConnected)
      });
      return function cleanup() {
         unsubscribe();
      }
   }, [])

   //// NAV OPTIONS

   function getNavOptions() {
      return {
         headerTitle: () => <Image style={styles.headerImage} source={{ uri: FileSystem.documentDirectory + props.activeGroup.language + 'header.png' }} />,
         headerRight: props.isRTL ?
            () => <BackButton onPress={() => props.navigation.goBack()} /> :
            () => <View></View>,
         headerLeft: props.isRTL ?
            () => <View></View> :
            () => <BackButton onPress={() => props.navigation.goBack()} />
      }
   }

   //// FUNCTIONS

   // downloads a lesson's chapter 2 mp3 via modal press
   function downloadLessonFromModal() {
      props.downloadLesson(activeLessonInModal.id, activeLessonInModal.source);
      hideModals();
      setRefresh(old => !old)
   }

   // deletes a lesson's chapter 2 mp3 via modal press
   function deleteLessonFromModal() {
      FileSystem.deleteAsync(FileSystem.documentDirectory + activeLessonInModal.id + '.mp3')
      hideModals();
      setRefresh(old => !old)
   }

   // changes the complete status of a lesson via modal press
   // note: don't change it if they're marking it as what it's already marked as
   function toggleCompleteFromModal(statusToMark) {
      if (props.activeGroup.progress.includes(activeLessonInModal.index) && statusToMark === 'incomplete') {
         props.toggleComplete(props.activeGroup.name, activeLessonInModal.index);
         props.setBookmark(props.activeGroup.name)
      } else if (!props.activeGroup.progress.includes(activeLessonInModal.index) && statusToMark === 'complete') {
         props.toggleComplete(props.activeGroup.name, activeLessonInModal.index);
         props.setBookmark(props.activeGroup.name)
      }
      hideModals();
   }

   // marks every lesson in current set as complete up until the selected lesson via modal press
   function markUpToThisPointAsCompleteFromModal() {
      for (var i = 1; i <= activeLessonInModal.index; i++) {
         if (!props.activeGroup.progress.includes(i) && props.activeDatabase.lessons[i - 1].setid === props.route.params.setID) {
            props.toggleComplete(props.activeGroup.name, i)
         }
      }
      hideModals();
      props.setBookmark(props.activeGroup.name)
   }

   // hides all the modals 
   function hideModals() {
      setShowSaveLessonModal(false);
      setShowDeleteLessonModal(false);
      setShowLessonOptionsModal(false);
   }


   // opens the share sheet to share a chapter of a lesson
   function shareLesson(chapter) {
      switch (chapter) {
         case 'fellowship':
            Sharing.shareAsync(FileSystem.documentDirectory + props.activeGroup.language + 'chapter1.mp3')
            break;
         case 'passage':
            FileSystem.getInfoAsync(FileSystem.documentDirectory + activeLessonInModal.id + '.mp3')
               .then(({ exists }) => {
                  exists ?
                     Sharing.shareAsync(FileSystem.documentDirectory + activeLessonInModal.id + '.mp3') :
                     Alert.alert(
                        props.translations.alerts.shareUndownloaded.header,
                        props.translations.alerts.shareUndownloaded.body,
                        [{ text: props.translations.alerts.options.ok, onPress: () => { } }]
                     )
               })
            break;
         case 'application':
            Sharing.shareAsync(FileSystem.documentDirectory + props.activeGroup.language + 'chapter3.mp3')
            break;
      }
   }

   //// RENDER

   function renderLessonItem(lessonList) {
      return (
         <LessonItem
            lesson={lessonList.item}
            onLessonSelect={() => props.navigation.navigate('Play', {
               id: lessonList.item.id,
               setid: lessonList.item.setid,
               index: lessonList.item.index,
               title: lessonList.item.title,
               subtitle: lessonList.item.subtitle,
               source: lessonList.item.source,
               scriptureHeader: lessonList.item.scriptureHeader,
               scriptureText: lessonList.item.scriptureText,
            })}
            isComplete={props.activeGroup.progress.includes(lessonList.item.index)}
            isConnected={isConnected}
            downloadProgress={props.downloads[lessonList.item.id]}
            setShowSaveLessonModal={() => setShowSaveLessonModal(true)}
            setShowDeleteLessonModal={() => setShowDeleteLessonModal(true)}
            setActiveLessonInModal={() => setActiveLessonInModal(lessonList.item)}
            setShowLessonOptionsModal={() => setShowLessonOptionsModal(true)}
            setRefresh={() => setRefresh()}
         />
      )
   }

   return (
      <View style={styles.screen}>
         <View style={styles.studySetItemContainer}>
            <SetItem
               index={props.route.params.index}
               title={props.route.params.title}
               subtitle={props.route.params.subtitle}
               id={props.route.params.studySetID}
               isSmall={true}
               color={props.route.params.color}
            />
         </View>
         <FlatList
            data={props.activeDatabase.lessons.filter(lesson => props.route.params.setID === lesson.setid)}
            renderItem={renderLessonItem}
            keyExtractor={item => item.id}
         />
         {/* MODALS */}
         <WahaModal 
            isVisible={showSaveLessonModal} 
            hideModal={hideModals}
            closeText={props.activeDatabase.translations.modals.downloadLessonOptions.cancel}
         > 
            <ModalButton isLast={true}title={props.activeDatabase.translations.modals.downloadLessonOptions.downloadLesson} onPress={downloadLessonFromModal} />
         </WahaModal>
         <WahaModal 
            isVisible={showDeleteLessonModal} 
            hideModal={hideModals}
            closeText={props.activeDatabase.translations.modals.deleteLessonOptions.cancel}
         >
            <ModalButton isLast={true} title={props.activeDatabase.translations.modals.deleteLessonOptions.deleteLesson} onPress={deleteLessonFromModal} />
         </WahaModal>
         <WahaModal 
            isVisible={showLessonOptionsModal} 
            hideModal={hideModals}
            closeText={props.activeDatabase.translations.modals.lessonOptions.close}
         >
            <ModalButton title={props.activeDatabase.translations.modals.lessonOptions.markLessonComplete} onPress={() => toggleCompleteFromModal('complete')} />
            <ModalButton title={props.activeDatabase.translations.modals.lessonOptions.markLessonIncomplete} onPress={() => toggleCompleteFromModal('incomplete')} />
            <ModalButton title={props.activeDatabase.translations.modals.lessonOptions.shareChapter1} onPress={() => shareLesson('fellowship')} />
            <ModalButton title={props.activeDatabase.translations.modals.lessonOptions.shareChapter2} onPress={() => shareLesson('passage')} />
            <ModalButton title={props.activeDatabase.translations.modals.lessonOptions.shareChapter3} onPress={() => shareLesson('application')} />
            <ModalButton isLast={true} title={props.activeDatabase.translations.modals.lessonOptions.markUpToPointAsComplete} onPress={markUpToThisPointAsCompleteFromModal} />
         </WahaModal>
      </View>
   )
}

//// STYLES

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "#F7F9FA"
   },
   studySetItemContainer: {
      width: "100%",
      height: 90 * scaleMultiplier
   },
   headerImage: {
      resizeMode: "contain",
      width: 120,
      height: 40,
      alignSelf: "center",
   },
   hiddenItemContainer: {
      justifyContent: "space-between",
      flexDirection: "row",

   }
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      downloads: state.downloads,
      activeDatabase: state.database[activeGroup.language],
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroup: activeGroup,
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: (groupName, lessonIndex) => { dispatch(toggleComplete(groupName, lessonIndex)) },
      setBookmark: groupName => { dispatch(setBookmark(groupName)) },
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonListScreen);