//basic imports
import React, { useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AsyncStorage} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

function LessonItem(props) {

    const [isDownloaded, setIsDownloaded] = useState(false);
    var isComplete;
    if(props.isComplete === 'complete') {
        isComplete = true;
    } else {
        isComplete = false;
    }

    FileSystem.getInfoAsync(FileSystem.documentDirectory + props.id + '.mp3')
        .then(({ exists }) => {
            exists ? setIsDownloaded(true) : setIsDownloaded(false)
        })

    return(
        <View style={styles.lessonItem}>
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
                <Ionicons.Button 
                    name={isDownloaded ? "ios-backspace" : "md-cloud-download"} 
                    size={30}
                    onPress={isDownloaded ? props.deleteLesson : props.downloadLesson}
                    backgroundColor="rgba(0,0,0,0)"
                    color="black"
                 />
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
        flexDirection: "row",
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
        alignContent: "center"
    },
    downloadButton: {
    }
})

export default LessonItem;