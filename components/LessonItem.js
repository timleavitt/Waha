//imports
import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux'

function LessonItem(props) {


   const [isDownloaded, setIsDownloaded] = useState(false)

   //check if the lesson is downloaded and set isDownloaded accordingly
   FileSystem.getInfoAsync(FileSystem.documentDirectory + props.id + '.mp3')
   .then(({ exists }) => {
      exists ? setIsDownloaded(true) : setIsDownloaded(false)
      props.setRefresh(old => !old)
      }
   )

    //functions to call modals from lessonlistscreen
    //function are setState functions passed from lessonlistscreen
    function showSaveModal() {
        props.setIDToDownload.call();
        props.setShowSaveLessonModal.call();
    }

    function showDeleteModal() {
        props.setIDToDownload.call();
        props.setShowDeleteLessonModal.call();
    }

    function showLessonOptionsModal() {
        props.setIDToDownload.call();
        props.setShowLessonOptionsModal.call();
    }

      //console.log(props.isDownloaded)


    ////////////////////////////////
    ////RENDER/STYLES/NAVOPTIONS////
    ////////////////////////////////


    //component for what to display on the far right of the list
    //can either be cloud down arrow (click to download), x (click to delete),
    //a no internet icon, or a spin icon if it's downloading
    var downloadedFeedback;
    var progressBar;
    if (!props.downloadProgress) {
        downloadedFeedback = 
            <Ionicons.Button 
                name={isDownloaded ? "md-cloud-done" : "md-cloud-download"} 
                color={isDownloaded ? props.grayedOut : "black"}
                size={30}
                onPress={isDownloaded ? showDeleteModal : showSaveModal}
                backgroundColor="rgba(0,0,0,0)"
            />
        progressBar = null;
    } else {
        downloadedFeedback = <ActivityIndicator size="small" color="black" />
        progressBar = <Progress.Bar progress={props.downloadProgress} width={400} color="black" borderColor="black"/>
    }  

    return (
        <View style={{...styles.lessonItem, ...props.isComplete ? {backgroundColor: "#D3D3D3"} : null}}>
            <View style={styles.mainDisplay}>
                <TouchableOpacity 
                    style={styles.progresAndTitle} 
                    onPress={props.onLessonSelect}
                    onLongPress={showLessonOptionsModal}
                >
                    <View style={styles.icon}>
                        <MaterialCommunityIcons
                            name={props.isComplete ? "check-circle" : "play-box-outline"}
                            color={props.isComplete ? props.grayedOut : props.accentColor}
                            size={30}
                        />
                    </View>
                    <View styles={styles.titleContainer}>
                        <Text style={{...styles.title,...{color: props.isComplete ? props.grayedOut : "black"}}}>{props.title}</Text>
                        <Text style={styles.subtitle}>{props.subtitle}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.icon}>
                    {downloadedFeedback}
                </View>
            </View>
            <View style={styles.progressBar}>
                {progressBar}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    lessonItem: {
        height: 75,
        padding: 5,
        justifyContent: "center",
        flexDirection: "column",
        alignContent: "center"
    },
    mainDisplay: {
        flexDirection: "row"
    },
    title: {
        fontSize: 22,
        textAlignVertical: "center",
        paddingHorizontal: 10,
        fontFamily: 'open-sans-regular'
    },
    subtitle: {
        fontSize: 15,
        paddingHorizontal: 10,
        fontFamily: 'open-sans-light'
    },
    titleContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
    },
    icon: {
        justifyContent: "center",
        marginHorizontal: 10
    },
    progresAndTitle: {
        justifyContent: "flex-start",
        flexDirection: 'row',
        alignContent: "center",
        flex: 1
    },
    progressBar: {
        width: "100%"
    }
})

function mapStateToProps(state) {
    return {
      grayedOut: state.database[state.database.currentLanguage].colors.grayedOut,
      accentColor: state.database[state.database.currentLanguage].colors.accentColor,
      progress: state.appProgress,
    }
  };
  
  function mapDispatchToProps(dispatch) {
    return {
      downloadLesson: (lessonID, source) => {dispatch(downloadLesson(lessonID, source))},
      toggleComplete: lessonID => {dispatch(toggleComplete(lessonID))}
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(LessonItem);