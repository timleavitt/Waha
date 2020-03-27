//basic imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, ActivityIndicator, ScrollView, FlatList, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

//sound stuff
import { Audio } from 'expo-av';

//components
import WahaModal from '../components/WahaModal'
import ModalButton from '../components/ModalButton'
import Scrubber from '../components/Scrubber'
import PlayPauseSkip from '../components/PlayPauseSkip';
import ChapterSelect from '../components/ChapterSelect'
import HeaderButtons from '../components/HeaderButtons'

//redux
import { toggleComplete } from '../redux/actions/appProgressActions'
import { connect } from 'react-redux'
import { downloadLesson } from '../redux/actions/downloadActions'
console.disableYellowBox = true;

function PlayScreen(props) {


   /////////////
   ////STATE////
   /////////////


   //sound object for storing/controlling audio file
   const [soundObject, setSoundObject] = useState(new Audio.Sound());

   //the length of the current audio file (loaded by sound object)
   const [audioFileLength, setAudioFileLength] = useState(null);

   //boolean to determine if the audio file has finished loading 
   const [isLoaded, setIsLoaded] = useState(false);

   //boolean to determine if the audio file is currently playing or paused
   const [isPlaying, setIsPlaying] = useState(false);

   //the current position of the seeker
   const [seekPosition, setSeekPosition] = useState(0);

   //boolean to determine if the seeker should update every second
   //NOTE: only time it shouldn't is during seeking, skipping, or loading a new chapter
   const shouldTickUpdate = useRef(false);

   //string of the currently active chapter
   const [activeChapter, setActiveChapter] = useState('fellowship')

   //sources for all 3 audio files
   const [chapter1Source, setChapter1Source] = useState(FileSystem.documentDirectory + props.currentLanguage + 'chapter1.mp3');
   const [chapter2Source, setChapter2Source] = useState(FileSystem.documentDirectory + props.navigation.getParam('id') + '.mp3');
   const [chapter3Source, setChapter3Source] = useState(FileSystem.documentDirectory + props.currentLanguage + 'chapter3.mp3');

   //share modal
   const [showShareLessonModal, setShowShareLessonModal] = useState(false);

   //ALBUM ART SLIDER STUFF
   const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

   const albumSlidesData = [
      {
         key: '0',
         type: 'text',
         body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
         key: '1',
         type: 'image',
         iconName: props.navigation.getParam("iconName")
      },
      {
         key: '2',
         type: 'text',
         body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
   ]


   ///////////////////
   ////CONSTRUCTOR////
   ///////////////////


   //PURPOSE: constructor on first open
   useEffect(() => {
      //load up chapter 1 initially
      try {
         loadAudioFile(chapter1Source);
      } catch (error) {
         console.log(error)
      }

      //check if file is downloaded, then load it
      checkIsDownloaded(); // -> loadAudioFile()

      //determine complete status of loaded lesson
      var id = props.navigation.getParam('id');

      //send completion info over to navigation (appProgress is from redux)
      props.navigation.setParams({ navIsComplete: (id in props.progress) });
      props.navigation.setParams({ navMarkHandler: changeCompleteStatus });
      props.navigation.setParams({ setShowShareLessonModal: setShowShareLessonModal })
      props.navigation.setParams({ primaryColor: props.colors.primaryColor })

      //set up our timer tick for updating the seeker every second
      const interval = setInterval(updateSeekerTick, 1000);

      //when leaving the screen, cancel the interval timer and unload the audio file
      return function cleanup() {
         clearInterval(interval);
         if (soundObject) {
            soundObject.unloadAsync();
            setSoundObject(null);
         }
      }
   }, []);


   ///////////////////////////////
   ////AUDIO CONTROL FUNCTIONS////
   ///////////////////////////////


   //PURPOSE: update something on every api call to audio object and every second
   soundObject.setOnPlaybackStatusUpdate(playbackStatus => {
      if (playbackStatus.isLoaded) {
         setIsLoaded(true)
      }

      //depending on what chapter we're on, either jump to the next chapter once we finish or 
      //toggle the whole lesson as complete
      if (playbackStatus.didJustFinish) {
         if (activeChapter === 'fellowship') {
            changeChapter('passage')
         } else if (activeChapter === 'passage') {
            changeChapter('application')
         } else if (activeChapter === 'application') {
            var id = props.navigation.getParam('id');
            var isComplete = (id in props.progress)
            if (!isComplete)
               changeCompleteStatus();
         }
      }
   })

   //PURPOSE: check if the lesson is downloaded or not
   async function checkIsDownloaded() {
      FileSystem.getInfoAsync(FileSystem.documentDirectory + props.navigation.getParam('id') + '.mp3')
         .then(({ exists }) => {
            if (!exists && !(props.navigation.getParam('id') in props.downloads)) {
               props.downloadLesson(props.navigation.getParam('id'), props.navigation.getParam('source'));
            }
         })
   }

   //PURPOSE: load the audio file and set isLoaded and 
   //PARAMETERS: source to load file from
   async function loadAudioFile(source) {
      //console.log(source);
      try {
         await soundObject
            .loadAsync({ uri: source }, { progressUpdateIntervalMillis: 1000 })
            .then(playbackStatus => {
               setAudioFileLength(playbackStatus.durationMillis);
               soundObject.setStatusAsync({ progressUpdateIntervalMillis: 1000, shouldPlay: true });
               shouldTickUpdate.current = true;
               setIsPlaying(true)
            })
      } catch (error) {
         console.log(error)
      }
   }

   //PURPOSE: gets called every second by our interval, and updates the seeker position
   //based on the progress through the audio file
   async function updateSeekerTick() {
      //console.log(shouldTickUpdate.current)
      if (shouldTickUpdate.current) {
         try {
            await soundObject
               .getStatusAsync()
               .then(playbackStatus => {
                  setSeekPosition(playbackStatus.positionMillis);
               })
            //.catch(err => console.log(err))
         } catch (error) {
            console.log(error)
         }
      }
   }

   //PURPOSE: when user taps the play button, if the audio is playing, 
   //pause it; if it's paused, start playing it
   function playHandler() {
      if (isLoaded) {
         updateSeekerTick();
         isPlaying ?
            soundObject.setStatusAsync({ progressUpdateIntervalMillis: 1000, shouldPlay: false }) :
            soundObject.setStatusAsync({ progressUpdateIntervalMillis: 1000, shouldPlay: true });
         setIsPlaying(currentStatus => !currentStatus);
      }
   }

   //PURPOSE: start playing from the position they release the thumb at
   //PARAMETERS: the current seeker value
   //NOTE: .catchs are empty because of a weird ios-only warning appearing
   //that doesn't seem to affect any functionality. it's being ignored
   function onSeekRelease(value) {
      if (isPlaying) {
         soundObject.setStatusAsync({
            shouldPlay: false,
            positionMillis: value,
            seekMillisToleranceBefore: 10000,
            seekMillisToleranceAfter: 10000
         }).catch(err => { })
         soundObject.setStatusAsync({
            shouldPlay: true,
            positionMillis: value,
            seekMillisToleranceBefore: 10000,
            seekMillisToleranceAfter: 10000
         }).catch(err => { })
      } else {
         soundObject.setStatusAsync({
            shouldPlay: false,
            positionMillis: value,
            seekMillisToleranceBefore: 10000,
            seekMillisToleranceAfter: 10000
         }).catch(err => { })
      }
      shouldTickUpdate.current = true;
      setSeekPosition(value);
   }

   //PURPOSE: prevent the seeker from updating every second whenever
   //the user is dragging the thumb
   function onSeekDrag(value) {
      shouldTickUpdate.current = false;
   }

   //PURPOSE: skips an amount of milliseconds through the audio track
   function skip(amount) {
      isPlaying ?
         soundObject.setStatusAsync({ shouldPlay: true, positionMillis: (seekPosition + amount) }) :
         soundObject.setStatusAsync({ shouldPlay: false, positionMillis: (seekPosition + amount) });
      setSeekPosition(seekPosition => seekPosition + amount);
   }


   ///////////////////////
   ////OTHER FUNCTIONS////
   ///////////////////////

   //PURPOSE: change the active chapter
   function changeChapter(chapter) {
      //stop updating ticker
      shouldTickUpdate.current = false;

      //set seek position back to 0
      setSeekPosition(0)

      //unload whatever old sound object was loaded
      soundObject.unloadAsync();

      //set the button to show the new active chapter
      setActiveChapter(chapter)

      //load the new audio file
      if (chapter === 'fellowship') {
         loadAudioFile(chapter1Source)
      } else if (chapter === 'passage') {
         loadAudioFile(chapter2Source)
      } else if (chapter === 'application') {
         loadAudioFile(chapter3Source)
      }
   }

   //PURPOSE: switch the complete status of a lesson to the opposite of its current status
   function changeCompleteStatus() {
      var id = props.navigation.getParam('id');
      var isComplete = (id in props.progress)
      //redux action: change the complete status
      props.toggleComplete(id)

      if (isComplete) {
         Alert.alert('Lesson marked as incomplete!',
            'Don\' forget to select when your next lesson is!',
            [{
               text: 'OK',
               onPress: () => { props.navigation.goBack(); }
            }])
      } else {
         Alert.alert(props.translations['completeMessageTitle'],
            props.translations['completeMessageBody'],
            [{
               text: 'OK',
               onPress: () => { props.navigation.goBack(); }
            }])
      }
   }

   //PURPOSE: open the share sheet to share a chapter
   function shareLesson(chapter) {
      switch (chapter) {
         case 'fellowship':
            Sharing.shareAsync(chapter1Source).catch(error => console.log(error))
            break;
         case 'passage':
            Sharing.shareAsync(chapter2Source)
            break;
         case 'application':
            Sharing.shareAsync(chapter3Source)
            break;
      }
   }


   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   //PURPOSE: render the album art slide flatlist
   function renderAlbumSlide(slideList) {
      var content;
      if (slideList.item.type === 'text') {
         content = <Text style={{ flexWrap: "wrap", fontFamily: 'open-sans-regular' }}>{slideList.item.body}</Text>
      } else {
         content = <MaterialCommunityIcons name={slideList.item.iconName} size={350} />
      }
      return (
         <ScrollView style={{ ...styles.albumArtContainer, ...{ backgroundColor: props.colors.lessonSetScreenBG, } }}>
            {content}
         </ScrollView>
      )
   }

   //PLAY/PAUSE/SKIP CONTAINER
   //conditionally rendered because we don't want to show controls when the audio is loading
   var audioControlContainer;
   if (!isLoaded) {
      //special case when audio is still loading
      audioControlContainer =
         <View style={styles.audioControlContainer}>
            <ActivityIndicator size="large" color={props.colors.grayedOut} />
         </View>
   } else {
      //general case which shows scrubber/play controls
      audioControlContainer =
         <View style={styles.audioControlContainer}>
            <Scrubber
               value={seekPosition}
               onSlidingComplete={onSeekRelease}
               onValueChange={onSeekDrag}
               maximumValue={audioFileLength}
               seekPosition={seekPosition}
            />
            <PlayPauseSkip
               isPlaying={isPlaying}
               onPlayPress={playHandler}
               onSkipPress={value => { skip(value) }}
            />
         </View>
   }

   return (
      <View style={styles.screen}>
         <View style={styles.titlesContainer}>
            <Text style={styles.title}>{props.navigation.getParam("title")}</Text>
            <Text style={styles.subtitle}>{props.navigation.getParam("scripture")}</Text>
         </View>
         <FlatList
            renderItem={renderAlbumSlide}
            data={albumSlidesData}
            horizontal={true}
            pagingEnabled={true}
            snapToAlignment={"start"}
            snapToInterval={Dimensions.get('window').width}
            decelerationRate={"fast"}
            viewabilityConfig={viewConfigRef.current}
            initialScrollIndex={0}
         />
         <View style={styles.controlsContainer}>
            <ChapterSelect
               activeChapter={activeChapter}
               lessonID={props.navigation.getParam('id')}
               onPress={chapter => changeChapter(chapter)}
            />
            {audioControlContainer}
         </View>

         {/* MODALS */}
         <WahaModal isVisible={showShareLessonModal}>
            <ModalButton title="Share Chapter 1: Fellowship" onPress={() => shareLesson('fellowship')} />
            <ModalButton title="Share Chapter 2: Passage" onPress={() => shareLesson('passage')} />
            <ModalButton title="Share Chapter 3: Application" onPress={() => shareLesson('application')} />
            <ModalButton title="Close" onPress={() => setShowShareLessonModal(false)} style={{ color: "red" }} />
         </WahaModal>
      </View>

   )
}

PlayScreen.navigationOptions = navigationData => {
   const navIsComplete = navigationData.navigation.getParam("navIsComplete");
   const navMarkHandler = navigationData.navigation.getParam("navMarkHandler");
   const setShowShareLessonModal = navigationData.navigation.getParam("setShowShareLessonModal");
   const primaryColor = navigationData.navigation.getParam("primaryColor");

   return {
      headerTitle: navigationData.navigation.getParam("subtitle"),
      headerBackTitle: "Back",
      headerStyle: {
         backgroundColor: primaryColor
      },
      headerTitleStyle: {
         color: "#fff",
         fontFamily: 'open-sans-bold'
      },
      gestureEnabled: false,
      headerRight: () =>
         <HeaderButtons
            name='md-share'
            onPress1={() => setShowShareLessonModal(true)}
            hasCompleteButton={true}
            completeOnPress={navMarkHandler}
            completeCondition={navIsComplete}
         />
   }
};

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      justifyContent: "space-between"
   },
   titlesContainer: {
      flexDirection: "column",
      marginTop: 10
   },
   title: {
      textAlign: "center",
      fontSize: 30,
      fontFamily: 'open-sans-bold'
   },
   subtitle: {
      textAlign: "center",
      fontSize: 20,
      fontFamily: 'open-sans-light'
   },
   albumArtContainer: {
      width: (Dimensions.get('window').width - 40),
      padding: 20,
      margin: 20,
      borderRadius: 10
   },
   controlsContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
   },
   audioControlContainer: {
      justifyContent: "space-around",
      flexDirection: "column",
      marginBottom: 5,
      marginHorizontal: 10,
      width: "100%",
      height: 200
   },

})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
   //console.log(state.downloads)
   return {
      progress: state.appProgress,
      database: state.database,
      currentLanguage: state.database.currentLanguage,
      translations: state.database[state.database.currentLanguage].translations,
      downloads: state.downloads,
      colors: state.database[state.database.currentLanguage].colors
   }
};

function mapDispatchToProps(dispatch) {
   return {
      toggleComplete: lessonID => { dispatch(toggleComplete(lessonID)) },
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayScreen);