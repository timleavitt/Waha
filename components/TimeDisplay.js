//basic imports
import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { scaleMultiplier } from '../constants'

function TimeDisplay(props) {

    //function to convert a time in milliseconds to a 
    //nicely formatted string (for the scrubber)
    function msToTime(duration) {
        if (duration > 0 && duration <= props.max) {
        var seconds = Math.floor((duration / 1000) % 60);
        var minutes = Math.floor((duration / (1000 * 60)) % 60);

        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return minutes + ":" + seconds;
        } else if (duration > props.max) {
            return msToTime(props.max);
        } else {
            return "00:00";
        }
    }

    return (
        <View styles={props.style}>
            <Text style={styles.timeText}>{msToTime(props.time)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
   timeText: {
      fontFamily: 'light',
      fontSize: 12 * scaleMultiplier
   }
})

export default TimeDisplay;
