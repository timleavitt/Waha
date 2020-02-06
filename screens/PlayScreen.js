//basic imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Text, Slider } from 'react-native';

//sound stuff
import { Audio } from 'expo-av';

function PlayScreen(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [soundObject, setSoundObject] = useState(new Audio.Sound());
  const isMounted = useRef(true);
  const [lengthMilli, setLengthMilli] = useState(null);
  const [shouldSeek, setShouldSeek] = useState(true);
  const source = props.navigation.getParam("source");

  soundObject.setOnPlaybackStatusUpdate(playbackStatus => {
   
    //if (isMounted.current) {}
  })


  useEffect(() => {
    //on first open, load audio file and set interval for 
    //updating scrubber
    loadAudioFile();
    const interval = setInterval(updateSeeker, 1000);

    //when leaving the screen, set ismounted to flase
    //and unload the audio file
    return function cleanup() {
      isMounted.current = false;
      clearInterval(interval);
      soundObject.unloadAsync();
      setSoundObject(null);
    } 
  }, []);

/*   useEffect(() => {
    setSeekPosition(playbackStatus.positionMillis);
  }, [timer]); */
  
/* 
  useEffect(() => {
    soundObject.playFromPositionAsync(seekPosition);
  }, [seekPosition])  */ 

  //function to load the audio file
  async function updateSeeker() {
    if (shouldSeek) {
      try {
        await soundObject
          .getStatusAsync()
          .then(async playbackStatus => {
            setSeekPosition(playbackStatus.positionMillis);
            setLengthMilli(playbackStatus.durationMillis);
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  async function loadAudioFile() {
    try {
      await soundObject
        .loadAsync({uri: source}, {progressUpdateIntervalMillis: 1000})
        .then(async playbackStatus => {
          setIsLoaded(playbackStatus.isLoaded);
      }) 
    } catch (error) {
      console.log(error)
    }
  }
  
  function onPlaybackStatusUpdate(playbackStatus) {
    
  }

  //function gets called whenever user taps the play/pause button
  //if currently playing, pause the track
  //if currently pause, start playing the track
  function playHandler() {
    if(isLoaded) {
      updateSeeker();
      isPlaying ? 
      soundObject.setStatusAsync({progressUpdateIntervalMillis: 1000, shouldPlay: false}) : 
      soundObject.setStatusAsync({progressUpdateIntervalMillis: 1000, shouldPlay: true});
      setIsPlaying(currentStatus => !currentStatus);
    }
  }

  function msToTime(duration) {
    var seconds = Math.floor((duration / 1000) % 60);
    var minutes = Math.floor((duration / (1000 * 60)) % 60);
  
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return minutes + ":" + seconds;
  }

  function seekHandler() {
    updateSeeker();
    isPlaying ?
    soundObject.setStatusAsync({ shouldPlay: true, positionMillis: seekPosition }) :
    soundObject.setStatusAsync({ shouldPlay: false, positionMillis: seekPosition });
    updateSeeker();
    setShouldSeek(true);
  }

  function dragHandler(value) {
    setSeekPosition(value);
    soundObject.setStatusAsync({ shouldPlay: false });
    setShouldSeek(false);
  }

  // dont work yet
  function skipAhead() {
    setShouldSeek(false);
    soundObject.setStatusAsync({ shouldPlay: false, positionMillis: seekPosition });
    setSeekPosition(currentSeekPosition => currentSeekPosition + 15000);
    soundObject.setStatusAsync({ shouldPlay: true, positionMillis: seekPosition });
    setShouldSeek(true);
  }

  //dont work yet
  function skipBehind() {
    setShouldSeek(false);
    soundObject.setStatusAsync({ shouldPlay: false, positionMillis: seekPosition });
    setSeekPosition(currentSeekPosition => currentSeekPosition - 5000);
    soundObject.setStatusAsync({ shouldPlay: true, positionMillis: seekPosition });
    setShouldSeek(true);
  }


  return (
    <View style={styles.screen}>
      <View style={styles.scrubberContainer}>
        <View style={styles.scrubberInfo}><Text>{msToTime(seekPosition)}</Text></View>
        <View style={styles.scrubber}>
          <Slider
            value={seekPosition}
            onSlidingComplete={seekHandler}
            onValueChange={dragHandler}
            minimumValue={0}
            maximumValue={lengthMilli}
            step={1000} 
          />
        </View>
        <Text style={styles.scrubberInfo}>{msToTime(lengthMilli)}</Text>
      </View>
      <Text style={{textAlign: "center"}}>Status: {isLoaded ? "Finished loading" : "Loading"}</Text>
      <View style={styles.controlsContainer}>
        <Button title="Skip behind" onPress={skipBehind}/>
        <Button title={isPlaying ? "Pause" : "Play"} onPress={playHandler} />
        <Button title="Skip ahead" onPress={skipAhead}/>
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
    paddingHorizontal: 20,
    flexDirection: "row",
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
    flex: 1
  }
})

export default PlayScreen;