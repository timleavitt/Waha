//basic imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Text, Slider, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

//sound stuff
import { Audio } from 'expo-av';

//components
import TimeDisplay from "../components/TimeDisplay";

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

  //boolean to determine if the audio file is currently playing or paused
  const [isPlaying, setIsPlaying] = useState(false);

  //the current position of the seeker
  const [seekPosition, setSeekPosition] = useState(0);

  //boolean to determine if the seeker should update every second
  //NOTE: only time it shouldn't is during seeking or skipping
  const [shouldTickUpdate, setShouldTickUpdate] = useState(true);
  

  //NOT USED CURRENTLY: update something on every api call to audio object and every second
  soundObject.setOnPlaybackStatusUpdate(playbackStatus => {
  })

  //PURPOSE: constructor on first screen open
  useEffect(() => {

    //check if file is downloaded, then load it
    checkIsDownloaded(); // -> loadAudioFile()
 
    //determine complete status of loaded lesson
    fetchCompleteStatus();

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
    let source = '';
    FileSystem.getInfoAsync(FileSystem.documentDirectory + props.navigation.getParam('id') + '.mp3')
    .then(({exists}) => {
      if(exists) {
        //console.log('file exists')
        source = (FileSystem.documentDirectory + props.navigation.getParam('id') + '.mp3')
      } else {
        //console.log('file does not exist')
        source = props.navigation.getParam('source')
      } 
      loadAudioFile(source);
    })
  }

  //PURPOSE: load the audio file and set isLoaded and 
  //PARAMETERS: source to load file from
  async function loadAudioFile(source) {
    try {
      await soundObject
        .loadAsync({ uri: source }, { progressUpdateIntervalMillis: 1000 })
        .then(async playbackStatus => {
          setIsLoaded(playbackStatus.isLoaded);
          setAudioFileLength(playbackStatus.durationMillis);
        })
    } catch (error) {
      console.log(error)
    }
  }

  //PURPOSE: gets called every second by our interval, and updates the seeker position
  //based on the progress through the audio file
  async function updateSeekerTick() {
    if (shouldTickUpdate) {
      try {
        await soundObject
          .getStatusAsync()
          .then(async playbackStatus => {
            setSeekPosition(playbackStatus.positionMillis);
          })
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
  function onSeekRelease(value) {
    isPlaying ?
      soundObject.setStatusAsync({ shouldPlay: true, positionMillis: value }) :
      soundObject.setStatusAsync({ shouldPlay: false, positionMillis: value });
    setShouldTickUpdate(true);
    setSeekPosition(value);
  }

  //PURPOSE: prevent the seeker from updating every second whenever
  //the user is dragging the thumb
  function onSeekDrag(value) {
    setShouldTickUpdate(false);
  }

  //PURPOSE: skips an amount of milliseconds through the audio track
  function skip(amount) {
    isPlaying ?
      soundObject.setStatusAsync({ shouldPlay: true, positionMillis: (seekPosition + amount) }) :
      soundObject.setStatusAsync({ shouldPlay: false, positionMillis: (seekPosition + amount) });
    setSeekPosition(seekPosition => seekPosition + amount);
  }


  //////////////////////////////////
  ////PROGRESS STORAGE FUNCTIONS////
  //////////////////////////////////
  
  
  //PURPOSE: get the complete status of the current lesson from async,
  //then send that to the navigation options to update the button
  async function fetchCompleteStatus() {
    try {
      var id = props.navigation.getParam('id');
      var tempProgress = {}
      var isCompleteToSend = false

      await AsyncStorage
        .getItem('progress')
        .then(value => {
          //get complete status of this lesson to send to button
          tempProgress = JSON.parse(value);
          if(tempProgress[id] === 'complete') {
            isCompleteToSend = true;
          } else {
            isCompleteToSend = false;
          }

          //send stuff over to navigation
          props.navigation.setParams({ navIsComplete: isCompleteToSend });
          props.navigation.setParams({ navMarkHandler: changeCompleteStatus });
        })
    } catch (error) {
      console.log(error);
    }
  }

  //PURPOSE: change the complete status of the currently selected lesson
  //and update the async object accordingly
  async function changeCompleteStatus() {
    try {
      //props.navigation.getParam('refresh').call();
      var id = props.navigation.getParam('id');
      var temp = {}
      var tempProgress = {}
      var isCompleteToSend = false

      await AsyncStorage
        .getItem('progress')
        .then(value => {
          //get complete status of this lesson to send to button
          tempProgress = JSON.parse(value);
          if(tempProgress[id] === 'complete') {
            isCompleteToSend = false;
            temp[id] = 'incomplete'
          } else {
            isCompleteToSend = true;
            temp[id] = 'complete'
          }

          //update progress in async
          AsyncStorage.setItem('progress', JSON.stringify(Object.assign(tempProgress, temp)))

          //send stuff over to navigation
          props.navigation.setParams({ navIsComplete: isCompleteToSend });
          props.navigation.setParams({ navMarkHandler: changeCompleteStatus });
        })
    } catch (error) {
      console.log(error);
    }
  }


  ////////////////////////////////
  ////RENDER/STYLES/NAVOPTIONS////
  ////////////////////////////////


  return (
    <View style={styles.screen}>
      <View style={styles.titlesContainer}>
        <Text style={styles.title}>{props.navigation.getParam("title")}</Text>
        <Text style={styles.subtitle}>{props.navigation.getParam("subtitle")}</Text>
      </View>
      <Text style={{ textAlign: "center", flex: 1 }}>Status: {isLoaded ? "Finished loading" : "Loading"}</Text>
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
          <Ionicons.Button
            name={isPlaying ? "ios-pause" : "ios-play"}
            size={125}
            onPress={playHandler}
            backgroundColor="rgba(0,0,0,0)"
            iconStyle={styles.button}
          />
          <Ionicons.Button
            name="md-return-right"
            size={85}
            onPress={skip.bind("this", 15000)}
            backgroundColor="rgba(0,0,0,0)"
            iconStyle={styles.button}
          />
        </View>
      </View>
    </View>
  )
}

PlayScreen.navigationOptions = navigationData => {
  const navIsComplete = navigationData.navigation.getParam("navIsComplete");
  const navMarkHandler = navigationData.navigation.getParam("navMarkHandler");
  //console.log(`complete status in navigation: ${navIsComplete}`);
  return {
    headerTitle: navigationData.navigation.getParam("title"),
    headerRight: () =>
      <Ionicons.Button
        name={navIsComplete ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"}
        size={20}
        onPress={navMarkHandler}
        backgroundColor="rgba(0,0,0,0)"
        color="black"
        iconStyle={styles.markButton}
      />
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
    height: 200
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
    width: "100%"
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

export default PlayScreen;