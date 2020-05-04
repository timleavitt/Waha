import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import i18n from 'i18n-js';
import { connect } from 'react-redux'
import * as Progress from 'react-native-progress';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { scaleMultiplier } from '../constants';
import { setFetchError, addLanguage } from '../redux/actions/databaseActions';

function LoadingScreen(props) {
   i18n.translations = {
      en: {
         loadingMessage: "Hang on, we're setting things up...",
         errorMessage: "Sorry, there was a problem during fetching. Please check your connection and try again.",
         retry: "Retry"
      },
      te: {
         loadingMessage: "aliquet eget sit amet tellus cras...",
         errorMessage: "aliquet eget sit amet tellus cra aliquet eget sit amet tellus cra aliquet eget sit amet tellus cra",
         retry: "tellus"
      },
   };

   function retry() {
      props.setFetchError(false, null)
      props.addLanguage(props.errorLanguage)
   }

   return props.fetchError ?
      <View style={styles.screen}>
         <Text style={styles.loadingMessageText}>{i18n.t('errorMessage')}</Text>
         <TouchableOpacity onPress={retry} style={styles.button}>
            <Text style={styles.buttonTitle}>{i18n.t('retry')}</Text>
         </TouchableOpacity>
      </View> :
      <View style={styles.screen}>
         <Text style={styles.loadingMessageText}>{i18n.t('loadingMessage')}</Text>
         <View style={styles.progressBarContainer}>
            <Progress.Bar
               progress={props.progress}
               width={Dimensions.get('window').width - 50}
               color={"black"}
            />
         </View>
      </View>
}

//// STYLES

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      justifyContent: "center",
      alignItems: 'center'
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
   },
   button: {
      width: 200,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#1D1E20",
      borderRadius: 5
   },
   buttonTitle: {
      textAlign: "center",
      fontSize: 24 * scaleMultiplier,
      fontFamily: 'medium',
      color: "#FFFFFF"
   },
})

function mapStateToProps(state) {
   return {
      progress: state.database.currentFetchProgress,
      fetchError: state.fetchingStatus.fetchError,
      errorLanguage: state.fetchingStatus.errorLanguage,
   }
};

function mapDispatchToProps(dispatch) {
   return {
      addLanguage: language => { dispatch(addLanguage(language)) },
      setFetchError: (status, language) => {dispatch(setFetchError(status, language))}
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);