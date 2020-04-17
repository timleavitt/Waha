import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'

function PlayPauseSkip(props) {

   //// RENDER

   return (
      <View style={styles.playPauseSkipContainer}>
         <TouchableOpacity
            style={styles.playPauseSkipButton}
            onPress={() => props.onSkipPress(-10000)}
         >
            <Icon name="skip-back" size={69 * scaleMultiplier} />
         </TouchableOpacity>
         <TouchableOpacity
            style={styles.playPauseSkipButton}
            onPress={props.onPlayPress}
         >
            <Icon
               name={props.isPlaying ? "pause-filled" : "play-filled"}
               size={100 * scaleMultiplier}
               color={props.colors.primaryColor}
            />
         </TouchableOpacity>
         <TouchableOpacity
            style={styles.playPauseSkipButton}
            onPress={() => props.onSkipPress(10000)}
         >
            <Icon name="skip-forward" size={69 * scaleMultiplier} />
         </TouchableOpacity>
      </View>
   )
}

//// STYLES

const styles = StyleSheet.create({
   playPauseSkipContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      marginTop: -15,

   },
   playPauseSkipButton: {
      alignItems: "center",
      justifyContent: "center",
   }
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors
   }
};

export default connect(mapStateToProps)(PlayPauseSkip);
