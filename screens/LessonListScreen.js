//imports
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, Image } from 'react-native';
import LessonItem from '../components/LessonItem';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import SetItem from '../components/SetItem';
import FlatListSeparator from '../components/FlatListSeparator'
import WahaModal from '../components/WahaModal'
import ModalButton from '../components/ModalButton'
import NetInfo from '@react-native-community/netinfo';
import { scaleMultiplier, headerImages } from '../constants'
import BackButton from '../components/BackButton'

//redux imports
import { downloadLesson } from '../redux/actions/downloadActions'
import { toggleComplete, setBookmark } from '../redux/actions/groupsActions'
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
   const [currentLesson, setCurrentLesson] = useState('')

   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
      setCurrentLesson(getCurrentLesson())
      const unsubscribe = NetInfo.addEventListener(state => {
         setIsConnected(state.isConnected)
      });
      return function cleanup() {
         unsubscribe();
      }
   }, [])

   function getNavOptions() {

      return {
         headerTitle: () => <Image style={styles.headerImage} source={headerImages[props.activeGroup.language]} />,
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
      }
   }

   ///////////////////////
   ////OTHER FUNCTIONS////
   ///////////////////////

   function getCurrentLesson() {
      // var thisGroupDatabase = props.database[props.activeGroupLanguage]
      // var bookmarkInt = 0;

      // //if a group has no progress, return the first lesson in the first study set
      // if (props.activeGroupProgress.length === 0) {
      //    return thisGroupDatabase.studySets[0].lessons[0].id
      // }
      // props.activeGroupProgress.map(lessonID => {
      //    if (parseInt(lessonID.slice(-4)) > bookmarkInt)
      //       bookmarkInt = parseInt(lessonID.slice(-4))
      //    return null;
      // })

      // //string of the id of the last completed lesson 
      // var bookmarkString = bookmarkInt.toString();
      // var extraZero = ''
      // if (bookmarkString.length < 4)
      //    extraZero = '0'
      // bookmarkString = extraZero + bookmarkString

      // var lessonListOfBookmarkStudySet = thisGroupDatabase.studySets.filter(
      //    studySet => (studySet.id).slice(2, 4) === bookmarkString.slice(0, 2)
      // )[0].lessons

      // //edge case: the last completed lesson is the last in a study set
      // if (parseInt(bookmarkString.slice(-2)) === lessonListOfBookmarkStudySet.length) {
      //    //edge case: the last completed lesson is the last available lesson in any study set
      //    if (parseInt(bookmarkString.slice(0, 2)) === thisGroupDatabase.studySets.length) {
      //       return ('Contact us for more study sets!')
      //    } else {
      //       bookmarkString = (extraZero + (parseInt(bookmarkString.slice(0, 2)) + 1)).toString().concat(bookmarkString.slice(-2))
      //       lessonListOfBookmarkStudySet = thisGroupDatabase.studySets.filter(
      //          studySet => (studySet.id).slice(2, 4) === bookmarkString.slice(0, 2)
      //       )[0].lessons
      //       bookmarkLesson = lessonListOfBookmarkStudySet.filter(
      //          lesson => lesson.id === (lesson.id).slice(0, 2).concat(bookmarkString.slice(0, 2), '01')
      //       )
      //    }

      //    //normal case
      // } else {
      //    //get the lesson AFTER the last completed lesson 
      //    bookmarkLesson = lessonListOfBookmarkStudySet.filter(
      //       lesson => lesson.id === (lesson.id).slice(0, 2).concat(extraZero, (parseInt(bookmarkString) + 1).toString())
      //    )
      // }
      // return bookmarkLesson[0].id
      return 'en001'
   }


   //PURPOSE: delete a lesson .mp3 of id set by an individual flatlist item
   function deleteLesson() {
      FileSystem.deleteAsync(FileSystem.documentDirectory + idToDownload + '.mp3')
      hideModals();
      setRefresh(old => !old)
   }

   //PURPOSE: download a lesson .mp3 of id set by an individual flatlist item
   function downloadLesson() {
      //get our source from our array of lessons in this study set
      const currentLesson = props.database.lessons.filter(lesson => lesson.id === idToDownload)
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
         props.toggleComplete(props.activeGroup.name, idToDownload);
      } else if (!props.currentProgress.includes(idToDownload) && whatToMark === 'complete') {
         props.toggleComplete(props.activeGroup.name, idToDownload);
      }
      hideModals();
   }

   //share lesson functionality
   function shareLesson(chapter) {
      switch (chapter) {
         case 'fellowship':
            Sharing.shareAsync(FileSystem.documentDirectory + props.activeLanguage + 'chapter1.mp3')
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
            Sharing.shareAsync(FileSystem.documentDirectory + props.activeLanguage + 'chapter3.mp3')
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
            props.toggleComplete(props.activeGroup.name, idToMark)
         }
      }
      hideModals();
   }


   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////


   //PURPOSE: function to render each individual lesson item in the flatlist
   function renderLessonItem(lessonList) {
      return (
         <LessonItem
            id={lessonList.item.id}
            title={lessonList.item.title}
            subtitle={lessonList.item.subtitle}
            onLessonSelect={() => props.navigation.navigate('Play', {
               id: lessonList.item.id,
               title: lessonList.item.title,
               subtitle: lessonList.item.subtitle,
               source: lessonList.item.source,
               scriptureHeader: lessonList.item.scriptureHeader,
               scriptureText: lessonList.item.scriptureText,
               isRTL: props.route.params.isRTL
            })}
            isComplete={props.currentProgress.includes(lessonList.item.id)}
            downloadProgress={props.downloads[lessonList.item.id]}
            setShowSaveLessonModal={() => setShowSaveLessonModal(true)}
            setShowDeleteLessonModal={() => setShowDeleteLessonModal(true)}
            setIDToDownload={() => setIDToDownload(lessonList.item.id)}
            setShowLessonOptionsModal={() => setShowLessonOptionsModal(true)}
            setRefresh={() => setRefresh()}
            isConnected={isConnected}
            currentLesson={currentLesson}
            getCurrentLesson={getCurrentLesson}
         />
      )
   }

   //create modal in here, pass state to show it to lesson item so lesson item
   //can change it and show the modal on this screen
   return (
      <View style={styles.screen}>
         <View style={styles.studySetItemContainer}>
            <SetItem
               title={props.route.params.title}
               subtitle={props.route.params.subtitle}
               id={props.route.params.studySetID}
               isSmall={true}
               color={props.route.params.color}
            />
         </View>
         <FlatList
            data={props.database.lessons.filter(lesson => props.route.params.setID === lesson.setid)}
            renderItem={renderLessonItem}
            extraData={refresh}
         />
         <WahaModal isVisible={showSaveLessonModal}>
            <ModalButton title={props.database.translations.modals.downloadLessonOptions.downloadLesson} onPress={downloadLesson} />
            <ModalButton title={props.database.translations.modals.downloadLessonOptions.cancel} onPress={hideModals} style={{ color: "red" }} />
         </WahaModal>
         <WahaModal isVisible={showDeleteLessonModal}>
            <ModalButton title={props.database.translations.modals.deleteLessonOptions.deleteLesson} onPress={deleteLesson} />
            <ModalButton title={props.database.translations.modals.deleteLessonOptions.cancel} onPress={hideModals} style={{ color: "red" }} />
         </WahaModal>
         <WahaModal isVisible={showLessonOptionsModal}>
            <ModalButton title={props.database.translations.modals.lessonOptions.markLessonComplete} onPress={() => toggleComplete('complete')} />
            <ModalButton title={props.database.translations.modals.lessonOptions.markLessonIncomplete} onPress={() => toggleComplete('incomplete')} />
            <ModalButton title={props.database.translations.modals.lessonOptions.shareChapter1} onPress={() => shareLesson('fellowship')} />
            <ModalButton title={props.database.translations.modals.lessonOptions.shareChapter2} onPress={() => shareLesson('passage')} />
            <ModalButton title={props.database.translations.modals.lessonOptions.shareChapter3} onPress={() => shareLesson('application')} />
            <ModalButton title={props.database.translations.modals.lessonOptions.markUpToPointAsComplete} onPress={() => markUpToThisPointAsComplete(idToDownload)} />
            <ModalButton title={props.database.translations.modals.lessonOptions.close} onPress={hideModals} style={{ color: "red" }} />
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
      height: 90 * scaleMultiplier
   },
   headerImage: {
      resizeMode: "center",
      width: 120,
      height: 40,
      alignSelf: "center",
   }
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   //console.log(state.database[activeGroup.language].lessons)
   return {
      downloads: state.downloads,
      currentProgress: activeGroup.progress,
      database: state.database[activeGroup.language],
      activeLanguage: activeGroup.language,
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroup: activeGroup,
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: (groupName, lessonID) => { dispatch(toggleComplete(groupName, lessonID)) },
      setBookmark: groupName => { dispatch(setBookmark(groupName)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonListScreen);