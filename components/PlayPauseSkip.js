//basic imports
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'

function PlayPauseSkip(props) {
   //console.log((Dimensions.get('window').width / 380))
   return (
      <View style={styles.playPauseSkipContainer}>
         <TouchableOpacity
            style={styles.playPauseSkipButton}
            onPress={() => props.onSkipPress(-10000)}
         >
            <MaterialIcons name="replay-10" size={69 * scaleMultiplier} />
         </TouchableOpacity>
         <TouchableOpacity
            style={styles.playPauseSkipButton}
            onPress={props.onPlayPress}
         >
            <MaterialCommunityIcons
               name={props.isPlaying ? "pause-circle" : "play-circle"}
               size={100 * scaleMultiplier}
               color={props.colors.primaryColor}
            />
         </TouchableOpacity>
         <TouchableOpacity
            style={styles.playPauseSkipButton}
            onPress={() => props.onSkipPress(10000)}
         >
            <MaterialIcons name="forward-10" size={69 * scaleMultiplier} />
         </TouchableOpacity>
      </View>
   )
}

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

function mapStateToProps(state) {
   //console.log(state.downloads)
   return {
      colors: state.database[state.database.currentLanguage].colors
   }
};

export default connect(mapStateToProps)(PlayPauseSkip);
