//basic imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Slider, Alert, Button, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import * as Sharing from 'expo-sharing';

//sound stuff
import { Audio } from 'expo-av';

//components
import TimeDisplay from "../components/TimeDisplay";

//redux
import { toggleComplete } from '../redux/actions/appProgressActions'
import { connect } from 'react-redux'
import { downloadLesson } from '../redux/actions/downloadActions'
console.disableYellowBox = true;

function PlayScreen(props) {
  

  ///////////////////////////
  ////STATE & CONSTRUCTOR////
  ///////////////////////////


  //sound object for storing/controlling audio file
  const [soundObject, setSoundObject] = useState(new Audio.Sound());

  //the length of the current audio file (loaded by sound object)
  const [audioFileLength, setAudioFileLength] = useState(null);

  //boolean to determine if the audio file has finished loading 
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  //boolean to determine if the audio file is currently playing or paused
  const [isPlaying, setIsPlaying] = useState(false);

  //the current position of the seeker
  const [seekPosition, setSeekPosition] = useState(0);

  //boolean to determine if the seeker should update every second
  //NOTE: only time it shouldn't is during seeking, skipping, or loading a new chapter
  const shouldTickUpdate = useRef(false);

  const [activeChapter, setActiveChapter] = useState('fellowship')

  const [chapter1Source, setChapter1Source] = useState(FileSystem.documentDirectory + props.currentLanguage + 'chapter1.mp3');
  const [chapter2Source, setChapter2Source] = useState(FileSystem.documentDirectory + props.navigation.getParam('id') + '.mp3');
  const [chapter3Source, setChapter3Source] = useState(FileSystem.documentDirectory + props.currentLanguage + 'chapter3.mp3');

  //share modal
  const [showShareLessonModal, setShowShareLessonModal] = useState(false);

  //PURPOSE: update something on every api call to audio object and every second
  soundObject.setOnPlaybackStatusUpdate(playbackStatus => {
    if (playbackStatus.isLoaded) {
      setIsLoaded(true)
    } 

    if (playbackStatus.isBuffering) {
      setIsBuffering(true)
    } else {
      setIsBuffering(false)
    }

    //depending on what chapter we're on, either jump to the next chapter once we finish or 
    //toggle the whole lesson as complete
    if (playbackStatus.didJustFinish) {
      if (activeChapter === 'fellowship') {
        changeChapter('passage') 
      } else if (activeChapter === 'passage') {
        changeChapter('application')
      } else if (activeChapter === 'application') {
        changeCompleteStatus();
      }
    }
  })

  //PURPOSE: constructor on first screen open
  useEffect(() => {
    //load up chapter 1 initially
    try {
      console.log('loading chapter 1')
      loadAudioFile(chapter1Source);
    } catch (error) {
      console.log(error)
    }

    //check if file is downloaded, then load it
    checkIsDownloaded(); // -> loadAudioFile()
 
    //determine complete status of loaded lesson
    var id = props.navigation.getParam('id');

    //send completion info over to navigation (appProgress is from redux)
    props.navigation.setParams({ navIsComplete: (id in props.appProgress) });
    props.navigation.setParams({ navMarkHandler: changeCompleteStatus });
    props.navigation.setParams({ setShowShareLessonModal: setShowShareLessonModal })

    //set up our timer tick for updating the seeker every second
    const interval = setInterval(updateSeekerTick, 1000);

    //when leaving the screen, cancel the interval timer and unload the audio file
    return function cleanup() {
      clearInterval(interval);
      soundObject.unloadAsync();
    }
  }, []);


  ///////////////////////////////
  ////AUDIO CONTROL FUNCTIONS////
  ///////////////////////////////

  
  //PURPOSE: check if the lesson is downloaded or not
  async function checkIsDownloaded() {
    FileSystem.getInfoAsync(FileSystem.documentDirectory + props.navigation.getParam('id') + '.mp3')
    .then(({exists}) => {
      if (!exists && !(props.navigation.getParam('id') in props.downloads)){
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
     }).catch(err => {})
     soundObject.setStatusAsync({ 
      shouldPlay: true, 
      positionMillis: value,
      seekMillisToleranceBefore: 10000,
      seekMillisToleranceAfter: 10000
   }).catch(err => {})
    } else {
      soundObject.setStatusAsync({ 
        shouldPlay: false, 
        positionMillis: value,
        seekMillisToleranceBefore: 10000,
        seekMillisToleranceAfter: 10000
     }).catch(err => {})
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


  //////////////////////////////////
  ////PROGRESS STORAGE FUNCTIONS////
  //////////////////////////////////
  

  function changeCompleteStatus() {
    var id = props.navigation.getParam('id');
    var isComplete = (id in props.appProgress)
    //redux action: change the complete status
    props.toggleComplete(id)

    if (isComplete) {
      Alert.alert('Lesson marked as incomplete!', 
      'Don\' forget to select when your next lesson is!',
      [{
        text: 'OK', 
        onPress: () => {props.navigation.goBack();}
      }])
    } else {
      Alert.alert(props.translations['completeMessageTitle'], 
        props.translations['completeMessageBody'],
      [{
        text: 'OK', 
        onPress: () => {props.navigation.goBack();}
      }])
    } 
  }


  ///////////////////////
  ////SHARE FUNCTIONS////
  ///////////////////////


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
    //setShowShareLessonModal(false)
  }


  ////////////////////////////////
  ////RENDER/STYLES/NAVOPTIONS////
  ////////////////////////////////


  var playButton;
  if (!isBuffering) {
    playButton = 
    <Ionicons.Button
      name={isPlaying ? "ios-pause" : "ios-play"}
      size={125}
      onPress={playHandler}
      backgroundColor="rgba(0,0,0,0)"
      iconStyle={styles.button}
    />
  } else {
    playButton = 
     <ActivityIndicator size="large" color="black" />
  }

  var controlsContainer;
  if (!isLoaded) {
    controlsContainer = 
      <View style={{...styles.controlsContainer, justifyContent: "center"}}>
        <ActivityIndicator size="large" color="black" />
      </View>
    } else {
    controlsContainer =
      <View style={styles.controlsContainer}>
          <View style={styles.scrubberContainer}>
            <View style={styles.scrubber}>
              <Slider
                value={seekPosition}
                onSlidingComplete={onSeekRelease}
                onValueChange={onSeekDrag}
                minimumValue={0}
                maximumValue={audioFileLength}
                step={1000}
              />
            </View>
            <View style={styles.timeInfo}>
              <TimeDisplay style={styles.scrubberInfo} time={seekPosition} max={audioFileLength} />
              <TimeDisplay style={styles.scrubberInfo} time={audioFileLength} max={audioFileLength} />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Ionicons.Button
              name="md-return-left"
              size={85}
              onPress={skip.bind("this", -5000)}
              backgroundColor="rgba(0,0,0,0)"
              iconStyle={styles.button}
            />
            {playButton}
            <Ionicons.Button
              name="md-return-right"
              size={85}
              onPress={skip.bind("this", 15000)}
              backgroundColor="rgba(0,0,0,0)"
              iconStyle={styles.button}
            />
          </View>
        </View>
        
  }

  if ((props.navigation.getParam('id') in props.downloads)) {
    chapter2Button = 
      <View style={{...styles.chapterSelect, flexDirection: "column", backgroundColor: "#3D4849"}}>
        <Text style={{color: "gray", fontSize: 18, flex: 1}}>Passage</Text>
        <Progress.Bar progress={props.downloads[props.navigation.getParam("id")]} color="black" borderColor="black" width={40}/>
      </View>
  } else {
    chapter2Button = 
      <TouchableOpacity style={styles.chapterSelect} onPress={() => changeChapter('passage')}>
        <MaterialCommunityIcons name={(activeChapter === 'passage') ? "numeric-2-box" : "numeric-2"} size={30}/>
        <Text style={{color: "white", fontSize: 18, flex: 1}}>Passage</Text>
      </TouchableOpacity>
  }

  return (
    <View style={styles.screen}>
      <View style={styles.titlesContainer}>
        <Text style={styles.title}>{props.navigation.getParam("title")}</Text>
        <Text style={styles.subtitle}>{props.navigation.getParam("scripture")}</Text>
      </View>
      <Text style={{ textAlign: "center", flex: 1 }}>Status: {isLoaded ? "Finished loading" : "Loading"}</Text>
      <View style={styles.chapterSelectContainer}>
          <TouchableOpacity style={styles.chapterSelect} onPress={() => changeChapter('fellowship')}>
            <MaterialCommunityIcons name={(activeChapter === 'fellowship') ? "numeric-1-box" : "numeric-1"} size={30}/>
            <Text style={{color: "white", fontSize: 18, flex: 1}}>Fellowship</Text>
          </TouchableOpacity>
          {chapter2Button}
          <TouchableOpacity style={styles.chapterSelect} onPress={() => changeChapter('application')}>
            <MaterialCommunityIcons name={(activeChapter === 'application') ? "numeric-3-box" : "numeric-3"} size={30}/>
            <Text style={{color: "white", fontSize: 18, flex: 1}}>Application</Text>
          </TouchableOpacity>
        </View>
      {controlsContainer}

      <Modal
        visible={showShareLessonModal}
        animationType="slide"
        presentationStyle="overFullScreen"
        transparent={true}
      >
        <View style={{flex: 1, flexDirection: "column", justifyContent: "flex-end"}}>
          <View style={{backgroundColor: "white", paddingBottom: 20, paddingTop: 10}}>
            <Button title="Share Chapter 1: Fellowship" onPress={() => shareLesson('fellowship')} />
            <Button title="Share Chapter 2: Passage" onPress={() => shareLesson('passage')} />
            <Button title="Share Chapter 3: Application" onPress={() => shareLesson('application')} />
            <Button title="Close" onPress={() => setShowShareLessonModal(false)} />
          </View>
        </View>
      </Modal>
    </View>

  )
}

PlayScreen.navigationOptions = navigationData => {
  const navIsComplete = navigationData.navigation.getParam("navIsComplete");
  const navMarkHandler = navigationData.navigation.getParam("navMarkHandler");
  const setShowShareLessonModal = navigationData.navigation.getParam("setShowShareLessonModal");

  return {
    headerTitle: navigationData.navigation.getParam("title"),
    headerRight: () =>
      <View style={{flexDirection: "row"}}>
        <Ionicons.Button
          name="md-share"
          size={20}
          onPress={() => setShowShareLessonModal(true)}
          backgroundColor="rgba(0,0,0,0)"
          color="black"
          iconStyle={styles.markButton}
        />
        <Ionicons.Button
          name={navIsComplete ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"}
          size={20}
          onPress={navMarkHandler}
          backgroundColor="rgba(0,0,0,0)"
          color="black"
          iconStyle={styles.markButton}
        />
      </View>
  }
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  controlsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#d3d3d3",
    borderRadius: 20,
    marginBottom: 50,
    marginHorizontal: 15,
    height: 200,
  },
  albumArt: {
    height: 400,
    padding: 50,
    backgroundColor: "black",
    margin: 25
  },
  scrubberContainer: {
    paddingHorizontal: 8,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  chapterSelectContainer: {
    flexDirection: "row",
    margin: 20,
    justifyContent: "space-between"
  },
  chapterSelect: {
    backgroundColor: "gray",
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    margin: 2,
    justifyContent: "center"
  },
  scrubberInfo: {
    padding: 10
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  scrubber: {
    width: "100%",
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  button: {
    margin: 10,
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 0
  },
  titlesContainer: {
    flexDirection: "column",
    marginVertical: 15
  },
  title: {
    textAlign: "center",
    fontSize: 30
  },
  subtitle: {
    textAlign: "center",
    fontSize: 20,
    color: "#d3d3d3"
  },
  markButton: {
    justifyContent: "center",
    alignContent: "center"
  }
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
  //console.log(state.downloads)
  return {
    appProgress: state.appProgress,
    database: state.database,
    currentLanguage: state.database.currentLanguage,
    translations: state.database[state.database.currentLanguage].translations,
    downloads: state.downloads,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    toggleComplete: lessonID => {dispatch(toggleComplete(lessonID))},
    downloadLesson: (lessonID, source) => {dispatch(downloadLesson(lessonID, source))},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayScreen);