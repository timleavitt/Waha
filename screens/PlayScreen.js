//basic imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Text, Slider } from 'react-native';

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

  //keep track of it audio is currently playing
  const [isPlaying, setIsPlaying] = useState(false);
  
  //the current position of the scrubber
  const [seekPosition, setSeekPosition] = useState(0);
  
  //should the scrubber be updating based on the track position?
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

    //when leaving the screen, set ismounted to flase
    //and unload the audio file
    return function cleanup() {
      isMounted.current = false;
      clearInterval(interval);
      soundObject.unloadAsync();
      setSoundObject(null);
    } 
  }, []);
  
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
  /*useEffect(() => {
    soundObject.playFromPositionAsync(seekPosition);
  }, [seekPosition])  */ 

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
      <Text style={{ textAlign: "center" }}>Status: {isLoaded ? "Finished loading" : "Loading"}</Text>
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
          <TimeDisplay style={styles.scrubberInfo} time={lengthMilli} max={lengthMilli}/>
        </View>
      </View>
      <View style={styles.controlsContainer}>
        <Button title="Skip behind" onPress={skip.bind("this", -5000)} />
        <Button title={isPlaying ? "Pause" : "Play"} onPress={playHandler} />
        <Button title="Skip ahead" onPress={skip.bind("this", 15000)} />
      </View>
    </View>
  )
}

PlayScreen.navigationOptions = navigationData => {
  return {
    headerTitle: navigationData.navigation.getParam("title")
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  albumArt: {
    height: 400,
    padding: 50,
    backgroundColor: "black",
    margin: 25
  },
  scrubberContainer: {
    paddingHorizontal: 10,
    flexDirection: "column",
    width: "100%"
  },
  scrubberInfo: {
    padding: 10
  },
  controlsContainer: {
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
  }
})

export default PlayScreen;