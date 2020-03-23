//basic imports
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux'

function PlayPauseSkip(props) {
   return (
      <View style={styles.playPauseSkipContainer}>
         <TouchableOpacity
            style={styles.playPauseSkipButton}
            onPress={() => props.onSkipPress(-10000)}
         >
            <MaterialIcons name="replay-10" size={60} />
         </TouchableOpacity>
         <TouchableOpacity
            style={styles.playPauseSkipButton}
            onPress={props.onPlayPress}
         >
            <MaterialCommunityIcons
               name={props.isPlaying ? "pause-circle" : "play-circle"}
               size={125}
               color={props.colors.accentColor}
            />
         </TouchableOpacity>
         <TouchableOpacity
            style={styles.playPauseSkipButton}
            onPress={() => props.onSkipPress(10000)}
         >
            <MaterialIcons name="forward-10" size={60} />
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   playPauseSkipContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
   },
   playPauseSkipButton: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1
   }
})

function mapStateToProps(state) {
   //console.log(state.downloads)
   return {
      colors: state.database[state.database.currentLanguage].colors
   }
};

export default connect(mapStateToProps)(PlayPauseSkip);
