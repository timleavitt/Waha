//basic imports
import React from 'react';
import { View, StyleSheet, Slider, Platform } from 'react-native';
import TimeDisplay from "../components/TimeDisplay";
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'

function Scrubber(props) {
   return (
      <View style={styles.scrubberContainer}>
         <View style={styles.scrubber}>
            <Slider
               value={props.value}
               onSlidingComplete={props.onSlidingComplete}
               onValueChange={props.onValueChange}
               minimumValue={0}
               maximumValue={props.maximumValue}
               step={1000}
               minimumTrackTintColor={"#3A3C3F"}
               thumbTintColor={"#3A3C3F"}
            />
         </View>
         <View style={styles.timeInfo}>
            <TimeDisplay style={styles.scrubberInfo} time={props.seekPosition} max={props.maximumValue} />
            <TimeDisplay style={styles.scrubberInfo} time={props.maximumValue} max={props.maximumValue} />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   scrubberContainer: {
      paddingHorizontal: 8,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      marginTop: 10,
   },
   scrubber: {
      width: "100%"
   },
   timeInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%"
   },
})

function mapStateToProps(state) {
   //console.log(state.downloads)
   return {
      colors: state.database[state.database.currentLanguage].colors
   }
};

export default connect(mapStateToProps)(Scrubber);