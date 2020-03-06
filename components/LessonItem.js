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

    //const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false); 

    //var to keep track of whether this lesson is complete
    //NOTE: must be var; don't try with state
    var isComplete;

    //check if our info passed is complete or not and set isComplete accordingly
    if(props.isComplete === 'complete') {
        isComplete = true;
    } else {
        isComplete = false;
    }

    //check when our download finishes so we can update icon
    useEffect(() => {
        if (props.downloadProgress === 1) {
            setIsDownloading(false);
        }
    }, [props.downloadProgress])

    //calls the download lesson function passed from props
    //in addition to signalling that this specific lesson is downloading
    //so that the progress can be shown
    // function downloadLesson() {
    //     props.downloadLesson.call();

    //     setIsDownloading(true);
    // }

    //check if the lesson is downloaded and set isDownloaded accordingly
    FileSystem.getInfoAsync(FileSystem.documentDirectory + props.id + '.mp3')
        .then(({ exists }) => {
            exists ? setIsDownloaded(true) : setIsDownloaded(false)
        })

    function showDeleteAlert() {
        Alert.alert(
            'Lesson Delete',
            'You are about to delete this lesson. Are you sure you\'d like to do so?',
            [{text: 'No', onPress: () => {}}, {text: 'Yes', onPress: props.deleteLesson}],
            { cancelable: false }
        );
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
                onPress={isDownloaded ? showDeleteAlert : props.downloadLesson}
                backgroundColor="rgba(0,0,0,0)"
                color="black"
            />
        progressBar = null;
    } else {
        downloadedFeedback = <ActivityIndicator size="small" color="black" />
        
        progressBar = <Progress.Bar progress={props.downloadProgress} width={400} color="black" borderColor="black"/>
    }  

    //<Text>{Math.ceil(props.downloadProgress * 100).toString() + '%'}</Text>
    return (
        <View style={styles.lessonItem}>
            <View style={styles.mainDisplay}>
                <TouchableOpacity style={styles.progresAndTitle} onPress={props.onLessonSelect}>
                    <View style={styles.icon}>
                        <Ionicons
                            name={isComplete ? "ios-arrow-dropdown-circle" : "ios-arrow-dropdown"}
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