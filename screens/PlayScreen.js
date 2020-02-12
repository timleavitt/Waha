//basic imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Text, Slider, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

//sound stuff
import { Audio } from 'expo-av';

//components
import TimeDisplay  from "../components/TimeDisplay";

function PlayScreen(props) {

  ////STATE////
  //set early when the screen opens
  const [soundObject, setSoundObject] = useState(new Audio.Sound());
  const [lengthMilli, setLengthMilli] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMounted = useRef(true);
  const source = props.navigation.getParam("source");
  const [isComplete, setIsComplete] = useState(false);
  const [currentLessonID, setCurrentLessonID] = useState(props.navigation.getParam("id"));

  //keep track of it audio is currently playing
  const [isPlaying, setIsPlaying] = useState(false);
  
  //the current position of the scrubber
  const [seekPosition, setSeekPosition] = useState(0);
  
  //should the scrubber be updating based on the track position?
  //only time it shouldn't should be during scrubbing/skipping
  const [shouldTickUpdate, setShouldTickUpdate] = useState(true);

  //update on every api call and every second
  soundObject.setOnPlaybackStatusUpdate(playbackStatus => {
  })

  ////CONSTRUCTOR////
  useEffect(() => {
    //on first open, load audio file and set interval for 
    //updating scrubber
    loadAudioFile();
    const interval = setInterval(updateSeekerTick, 1000);

    //console.log(typeof props.navigation.getParam("id"));

    //figure out if lesson is marked as complete or not, 
    //and send over info to navigation
    getSetLessonMark();
    props.navigation.setParams({navIsComplete: isComplete})
    props.navigation.setParams({navMarkHandler: markHandler})

    //when leaving the screen, set ismounted to flase
    //and unload the audio file
    return function cleanup() {
      isMounted.current = false;
      clearInterval(interval);
      soundObject.unloadAsync();
      setSoundObject(null);
    } 
  }, []);

  useEffect(() => {
    props.navigation.setParams({navIsComplete: isComplete});
    props.navigation.setParams({navMarkHandler: markHandler});
  }, [isComplete])
  
  //function to load the audio file
  async function loadAudioFile() {
    try {
      await soundObject
        .loadAsync({uri: source}, {progressUpdateIntervalMillis: 1000})
        .then(async playbackStatus => {
          setIsLoaded(playbackStatus.isLoaded);
          setLengthMilli(playbackStatus.durationMillis);
      }) 
    } catch (error) {
      console.log(error)
    }
  }

  //check if lesson is complete or not
  async function getSetLessonMark() {
    try {
      await AsyncStorage
        .getItem(currentLessonID)
        .then(value => {
          if (value === 'incomplete') {
            setIsComplete(false);
          } else {
            setIsComplete(true);
          }
        })
    } catch (error) {
      console.log(error);
    }
  }

  function markHandler() {
    //change async storage value
    isComplete ? AsyncStorage.setItem(currentLessonID, 'incomplete') : AsyncStorage.setItem(currentLessonID, 'complete');
    getSetLessonMark();
  }

  //gets called every second, and updates the seeker position
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

  //function gets called whenever user taps the play/pause button
  //if currently playing, pause the track
  //if currently paused, start playing the track
  function playHandler() {
    if(isLoaded) {
      updateSeekerTick();
      isPlaying ? 
      soundObject.setStatusAsync({progressUpdateIntervalMillis: 1000, shouldPlay: false}) : 
      soundObject.setStatusAsync({progressUpdateIntervalMillis: 1000, shouldPlay: true});
      setIsPlaying(currentStatus => !currentStatus);
    }
  }

  //start playing from the position they release the thumb at
  function onSeekRelease(value) {
    isPlaying ?
    soundObject.setStatusAsync({ shouldPlay: true, positionMillis: value }) :
    soundObject.setStatusAsync({ shouldPlay: false, positionMillis: value });
    setShouldTickUpdate(true);
    setSeekPosition(value);
  }

  //prevent the seeker from updating every second whenever
  //the user is dragging the thumb
  function onSeekHold(value) {
    setShouldTickUpdate(false);
  }

  //skips an amount of milliseconds through the audio track
  function skip(amount) {
    isPlaying ?
    soundObject.setStatusAsync({ shouldPlay: true, positionMillis: (seekPosition + amount) }) :
    soundObject.setStatusAsync({ shouldPlay: false, positionMillis: (seekPosition + amount) });
    setSeekPosition(seekPosition => seekPosition + amount);
  }


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
              onValueChange={onSeekHold}
              minimumValue={0}
              maximumValue={lengthMilli}
              step={1000}
            />
          </View>
          <View style={styles.timeInfo}>
            <TimeDisplay style={styles.scrubberInfo} time={seekPosition} max={lengthMilli} />
            <TimeDisplay style={styles.scrubberInfo} time={lengthMilli} max={lengthMilli} />
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