import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, FlatList, Dimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { scaleMultiplier, setImages } from '../constants'
import { Audio } from 'expo-av';
import WahaModal from '../components/WahaModal'
import ModalButton from '../components/ModalButton'
import Scrubber from '../components/Scrubber'
import PlayPauseSkip from '../components/PlayPauseSkip';
import ChapterSelect from '../components/ChapterSelect'
import PlayScreenHeaderButtons from '../components/PlayScreenHeaderButtons'
import BackButton from '../components/BackButton'
import { toggleComplete, setBookmark } from '../redux/actions/groupsActions'
import { connect } from 'react-redux'
import { downloadLesson } from '../redux/actions/downloadActions'
console.disableYellowBox = true;

function PlayScreen(props) {

   //// STATE

   // stores loaded audio file
   const [soundObject, setSoundObject] = useState(new Audio.Sound());

   // stores the length of the current audio file in milliseconds (loaded by sound object)
   const [audioFileLength, setAudioFileLength] = useState(null);

   // keeps track of if the audio file is loaded
   const [isLoaded, setIsLoaded] = useState(false);

   // keeps track of whether the audio file is playing or paused
   const [isPlaying, setIsPlaying] = useState(false);

   // keeps track of the current position of the seeker 
   const [seekPosition, setSeekPosition] = useState(0);

   // keeps track of if the seeker should update every second
   // note: only time it shouldn't is during seeking, skipping, or loading a new chapter
   const shouldTickUpdate = useRef(false);

   // keeps track of currently playing chapter
   const [activeChapter, setActiveChapter] = useState('fellowship')

   // sources for all 3 audio files
   const [chapter1Source, setChapter1Source] = useState(FileSystem.documentDirectory + props.activeGroup.language + 'chapter1.mp3');
   const [chapter2Source, setChapter2Source] = useState(FileSystem.documentDirectory + props.route.params.id + '.mp3');
   const [chapter3Source, setChapter3Source] = useState(FileSystem.documentDirectory + props.activeGroup.language + 'chapter3.mp3');

   //share modal
   const [showShareLessonModal, setShowShareLessonModal] = useState(false);

   // data for album art flatlist
   const albumArtData = [
      {
         key: '0',
         type: 'text',
         header: props.translations.questionsHeader,
         body: props.translations.questionsBody
      },
      {
         key: '1',
         type: 'image',
         iconName: setImages[props.activeDatabase.sets.filter(set => set.id === props.route.params.setid)[0].index]
      },
      {
         key: '2',
         type: 'text',
         header: props.route.params.scriptureHeader,
         body: props.route.params.scriptureText
      },
   ]

   //// CONSTRUCTOR

   useEffect(() => {
      //set nav options
      props.navigation.setOptions(getNavOptions())

      //load up chapter 1 initially
      try {
         loadAudioFile(chapter1Source);
      } catch (error) {
         console.log(error)
      }

      //check if chapter 2 is downloaded, then load it
      checkIsDownloaded();

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

   //// NAV OPTIONS

   function getNavOptions() {
      return {
         headerTitle: props.route.params.subtitle,
         headerRight: props.isRTL ?
            () => <BackButton onPress={() => props.navigation.goBack()} /> :
            () => <PlayScreenHeaderButtons
               shareOnPress={() => setShowShareLessonModal(true)}
               completeOnPress={changeCompleteStatus}
               completeCondition={props.activeGroup.progress.includes(props.route.params.index)}
            />,
         headerLeft: props.isRTL ?
            () => <PlayScreenHeaderButtons
               shareOnPress={() => setShowShareLessonModal(true)}
               completeOnPress={changeCompleteStatus}
               completeCondition={props.activeGroup.progress.includes(props.route.params.index)}
            /> :
            () => <BackButton onPress={() => props.navigation.goBack()} />,
      }
   }

   //// AUDIO CONTROL FUNCTIONS

   // updates something on every api call to audio object and every second
   soundObject.setOnPlaybackStatusUpdate(playbackStatus => {
      if (playbackStatus.isLoaded) {
         setIsLoaded(true)
      }

      // depending on what chapter we're on, either jump to the next 
      // chapter once we finish or toggle the whole lesson as complete
      if (playbackStatus.didJustFinish) {
         if (activeChapter === 'fellowship') {
            changeChapter('passage')
         } else if (activeChapter === 'passage') {
            FileSystem.getInfoAsync(FileSystem.documentDirectory + props.route.params.id + '.mp3')
               .then(({ exists }) => {
                  // only switch to chapter 2 if it's downloaded
                  if (exists && !(props.route.params.id in props.downloads))
                     changeChapter('application')
               })
         } else if (activeChapter === 'application') {
            var isComplete = (props.activeGroup.progress.includes(props.route.params.id))
            if (!isComplete)
               changeCompleteStatus();
         }
      }
   })

   // checks if the lesson is downloaded or not
   async function checkIsDownloaded() {
      FileSystem.getInfoAsync(FileSystem.documentDirectory + props.route.params.id + '.mp3')
         .then(({ exists }) => {
            if (!exists && !(props.route.params.id in props.downloads)) {
               props.downloadLesson(props.route.params.id, props.route.params.source);
            }
         })
   }

   // loads an audio file, sets the length, and starts playing it 
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

   // gets called every second by our timer and updates the seeker position based on the progress through the audio file
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

   // plays the audio if it's currently paused and pauses the audio if it's currently playing
   function playHandler() {
      if (isLoaded) {
         updateSeekerTick();
         isPlaying ?
            soundObject.setStatusAsync({ progressUpdateIntervalMillis: 1000, shouldPlay: false }) :
            soundObject.setStatusAsync({ progressUpdateIntervalMillis: 1000, shouldPlay: true });
         setIsPlaying(currentStatus => !currentStatus);
      }
   }

   // starts playing loaded audio from the position the user releases the thumb at
   // note: catchs are empty because of a weird ios-only warning appearing
   // that doesn't seem to affect any functionality--it's being ignored
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

   // sets shouldTickUpdate to flase to prevent the seeker from updating while dragging
   function onSeekDrag(value) {
      shouldTickUpdate.current = false;
   }

   // skips an amount of milliseconds through the audio track
   function skip(amount) {
      isPlaying ?
         soundObject.setStatusAsync({ shouldPlay: true, positionMillis: (seekPosition + amount) }) :
         soundObject.setStatusAsync({ shouldPlay: false, positionMillis: (seekPosition + amount) });
      setSeekPosition(seekPosition => seekPosition + amount);
   }

   //// OTHER FUNCTIONS

   // changes the active chapter
   function changeChapter(chapter) {
      shouldTickUpdate.current = false;
      setSeekPosition(0)
      soundObject.unloadAsync();
      setActiveChapter(chapter)

      if (chapter === 'fellowship') {
         loadAudioFile(chapter1Source)
      } else if (chapter === 'passage') {
         loadAudioFile(chapter2Source)
      } else if (chapter === 'application') {
         loadAudioFile(chapter3Source)
      }
   }

   // switches the complete status of a lesson to the opposite of its current status
   // and alerts the user of the change
   function changeCompleteStatus() {
      var isComplete = (props.activeGroup.progress.includes(props.route.params.index))
      props.toggleComplete(props.activeGroup.name, props.route.params.index)
      props.setBookmark(props.activeGroup.name)

      if (isComplete) {
         Alert.alert(props.translations.alerts.markedAsIncomplete.header,
            props.translations.alerts.markedAsIncomplete.body,
            [{
               text: props.translations.alerts.ok,
               onPress: () => props.navigation.goBack()
            }])
      } else {
         Alert.alert(props.translations.alerts.markedAsComplete.header,
            props.translations.alerts.markedAsComplete.body,
            [{
               text: props.translations.alerts.ok,
               onPress: () => props.navigation.goBack()
            }])
      }
   }

   // opens the share sheet to share a chapter
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

   //// RENDER

   function renderAlbumArtItem({ item }) {
      if (item.type === 'text') {
         var scrollBarLeft = item.key === '0' ? null : <View style={styles.scrollBar} />
         var scrollBarRight = item.key === '0' ? <View style={styles.scrollBar} /> : null
         return (
            <View style={[styles.albumArtContainer, { marginLeft: item.key === '0' ? 30 : 10, marginRight: item.key === '2' ? 30 : 10 }]}>
               {scrollBarLeft}
               <ScrollView style={[styles.textContainer, { marginLeft: item.key === '2' ? 5 : 0, marginRight: item.key === '0' ? 5 : 0 }]}>
                  <Text style={styles.albumTextHeader}>{item.header}</Text>
                  <Text style={styles.albumTextBody}>{item.body}</Text>
               </ScrollView>
               {scrollBarRight}
            </View>
         )
      }
      else {
         return (
            <View style={[styles.albumArtContainer, { justifyContent: 'center', alignItems: 'center' }]}>
               <MaterialCommunityIcons
                  name={item.iconName}
                  size={300 * scaleMultiplier}
                  color={props.activeDatabase.sets.filter(set => set.id === props.route.params.setid)[0].color}
               />
            </View>
         )
      }
   }

   // renders the play/pause/skip container conditionally because we don't want to show controls when the audio is loading
   // if we're loading, render a loading circle; otherwise load the audio controls
   var audioControlContainer = isLoaded ?
      <View style={styles.audioControlContainer}>
         <ChapterSelect
            activeChapter={activeChapter}
            lessonID={props.route.params.id}
            onPress={chapter => changeChapter(chapter)}
         />
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
      </View> :
      <View style={styles.audioControlContainer}>
         <ActivityIndicator size="large" color="black" />
      </View>

   return (
      <View style={styles.screen}>
         <View style={styles.topHalfContainer}>
            <View style={styles.titlesContainer}>
               <Text style={styles.title}>{props.route.params.title}</Text>
            </View>
            <View style={styles.albumArtListContainer}>
               <FlatList
                  data={albumArtData}
                  renderItem={renderAlbumArtItem}
                  horizontal={true}
                  pagingEnabled={true}
                  snapToAlignment={"start"}
                  snapToInterval={Dimensions.get('window').width - 70}
                  decelerationRate={"fast"}
                  showsHorizontalScrollIndicator={false}
                  getItemLayout={(data, index) => (
                     { length: Dimensions.get('window').width - 70, offset: Dimensions.get('window').width - 70 * index, index }
                  )}
                  initialScrollIndex={1}
               />
               {/* <ScrollView
                  // contentContainerStyle={{paddingRight: Dimensions.get('window').width - 70}}
                  horizontal={true}
                  pagingEnabled={true}
                  snapToAlignment={"start"}
                  snapToInterval={Dimensions.get('window').width - 70}
                  decelerationRate={"fast"}
                  //contentOffset={{ x: Dimensions.get('window').width - 70, y: 0 }}
                  showsHorizontalScrollIndicator={false}
               >
                  <View style={{ ...styles.albumArtContainer, ...{ marginLeft: 30 } }}>
                     <ScrollView>
                        <Text style={{ flexWrap: "wrap", fontFamily: 'bold', textAlign: "center", margin: 5}}>{props.route.params.scriptureHeader}</Text>
                        <Text style={{ flexWrap: "wrap", fontFamily: 'regular' }}>{props.route.params.scriptureText}</Text>
                     </ScrollView>
                     <View style={styles.scrollBar} />
                  </View>
                  <View style={{ ...styles.albumArtContainer, ...{ justifyContent: "center", alignItems: "center" } }}>
                     <MaterialCommunityIcons name={props.route.params.iconName} size={200} />
                  </View>
                  <View style={{ ...styles.albumArtContainer, ...{ marginRight: 30 } }}>
                     <View style={styles.scrollBar} />
                     <ScrollView>
                        <Text style={{ flexWrap: "wrap", fontFamily: 'bold', textAlign: "center", margin: 5 }}>Questions</Text>
                     </ScrollView>
                  </View>
               </ScrollView> */}
            </View>
         </View>
         {audioControlContainer}

         {/* MODALS */}
         <WahaModal
            isVisible={showShareLessonModal}
            hideModal={() => setShowShareLessonModal(false)}
            closeText={props.translations.modals.lessonOptions.close}
         >
            <ModalButton title={props.translations.modals.lessonOptions.shareChapter1} onPress={() => shareLesson('fellowship')} />
            <ModalButton title={props.translations.modals.lessonOptions.shareChapter2} onPress={() => shareLesson('passage')} />
            <ModalButton isLast={true} title={props.translations.modals.lessonOptions.shareChapter3} onPress={() => shareLesson('application')} />
         </WahaModal>
      </View>

   )
};

//// STYLES

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      justifyContent: "space-between",
      height: "100%",
      width: "100%",
      backgroundColor: "#FFFFFF"
   },
   topHalfContainer: {
      justifyContent: "space-evenly",
      flex: 1
   },
   titlesContainer: {
      flexDirection: "column",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap"
   },
   title: {
      textAlign: "center",
      fontSize: 30 * scaleMultiplier,
      fontFamily: 'black',
      flexWrap: "nowrap"
   },
   subtitle: {
      textAlign: "center",
      fontSize: 18 * scaleMultiplier,
      fontFamily: 'regular'
   },
   albumArtListContainer: {
      width: "100%",
   },
   albumArtContainer: {
      width: (Dimensions.get('window').width - 80),
      height: (Dimensions.get('window').width - 80),
      borderRadius: 10,
      marginHorizontal: 10,
      paddingHorizontal: 10,
      backgroundColor: "#DEE3E9",
      flexDirection: "row"
   },
   textContainer: {
      flexDirection: "column",
      flex: 1,
   },
   albumTextHeader: {
      flexWrap: "wrap",
      fontFamily: 'bold',
      textAlign: "center",
      margin: 5
   },
   albumTextBody: {
      flexWrap: "wrap",
      fontFamily: 'regular'
   },
   scrollBar: {
      width: 4,
      height: 150 * scaleMultiplier,
      backgroundColor: "#9FA5AD",
      borderRadius: 10,
      alignSelf: "center",
   },
   audioControlContainer: {
      justifyContent: "space-evenly",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      height: "33%",
   },
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      database: state.database,
      activeGroup: activeGroup,
      activeDatabase: state.database[activeGroup.language],
      translations: state.database[activeGroup.language].translations,
      downloads: state.downloads,
      colors: state.database[activeGroup.language].colors,
      isRTL: state.database[activeGroup.language].isRTL,
   }
};

function mapDispatchToProps(dispatch) {
   return {
      toggleComplete: (groupName, lessonIndex) => { dispatch(toggleComplete(groupName, lessonIndex)) },
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      setBookmark: groupName => { dispatch(setBookmark(groupName)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayScreen);