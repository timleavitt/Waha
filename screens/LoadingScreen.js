import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import i18n from 'i18n-js';
import { connect } from 'react-redux'
import * as Progress from 'react-native-progress';

function LoadingScreen(props) {
   i18n.translations = {
      en: {
         loadingMessage: "Hang on, we're setting things up..."
      },
      te: {
         loadingMessage: "aliquet eget sit amet tellus cras..."
      },
   };
   return (
      <View style={styles.screen}>
         <Text style={styles.loadingMessageText}>{i18n.t('loadingMessage')}</Text>
         <View style={styles.progressBarContainer}>
            <Progress.Bar 
               progress={props.progress} 
               width={Dimensions.get('window').width - 50} 
               color={"black"}
            />
         </View>
         {/* <ActivityIndicator size="large" color="black" /> */}
      </View>
   )
}

//// STYLES

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      justifyContent: "center",
   },
   loadingMessageText: {
      textAlign: "center",
      fontSize: 30,
      padding: 10,
      fontFamily: "medium"
   },
   progressBarContainer: {
      width: "100%",
      justifyContent: 'center',
      alignItems: 'center'
   }
})

function mapStateToProps(state) {
   return {
      progress: state.database.currentFetchProgress
   }
};

export default connect(mapStateToProps)(LoadingScreen);