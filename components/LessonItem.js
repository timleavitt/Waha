//basic imports
import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';

function LessonItem(props) {

    //state to keep track of whether this lesson is downloaded
    //NOTE: must be state; don't try it with a normal var
    const [isDownloaded, setIsDownloaded] = useState(false);

    //check if the lesson is downloaded and set isDownloaded accordingly
    FileSystem.getInfoAsync(FileSystem.documentDirectory + props.id + '.mp3')
        .then(({ exists }) => {
            exists ? setIsDownloaded(true) : setIsDownloaded(false)
        })


    function showSaveModal() {
        props.setIDToDownload.call();
        props.setShowSaveLessonModal.call();
    }

    function showDeleteModal() {
        props.setIDToDownload.call();
        props.setShowDeleteLessonModal.call();
    }

    //component for what to display on the far right of the list
    //can either be cloud down arrow (click to download), x (click to delete),
    //a no internet icon, or a spin icon if it's downloading
    var downloadedFeedback;
    var progressBar;
    if (!props.downloadProgress) {
        downloadedFeedback = 
            <Ionicons.Button 
                name={isDownloaded ? "ios-backspace" : "md-cloud-download"} 
                size={30}
                onPress={isDownloaded ? showDeleteModal : showSaveModal}
                backgroundColor="rgba(0,0,0,0)"
                color="black"
            />
        progressBar = null;
    } else {
        downloadedFeedback = <ActivityIndicator size="small" color="black" />
        progressBar = <Progress.Bar progress={props.downloadProgress} width={400} color="black" borderColor="black"/>
    }  

    return (
        <View style={styles.lessonItem}>
            <View style={styles.mainDisplay}>
                <TouchableOpacity style={styles.progresAndTitle} onPress={props.onLessonSelect}>
                    <View style={styles.icon}>
                        <Ionicons
                            name={props.isComplete ? "ios-arrow-dropdown-circle" : "ios-arrow-dropdown"}
                            size={30}
                        />
                    </View>
                    <View styles={styles.titleContainer}>
                        <Text style={styles.title}>{props.title}</Text>
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
        flex: 1,
        height: 75,
        borderColor: "black",
        borderWidth: 2,
        margin: 5,
        justifyContent: "space-between",
        flexDirection: "column",
    },
    mainDisplay: {
        flexDirection: "row"
    },
    title: {
        fontSize: 22,
        textAlignVertical: "center",
        paddingHorizontal: 10
    },
    subtitle: {
        fontSize: 15,
        paddingHorizontal: 10,
        color: "gray"
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

export default LessonItem;