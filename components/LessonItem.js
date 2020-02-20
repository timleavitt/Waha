//basic imports
import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AsyncStorage} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function LessonItem(props) {

    //console.log(props.isComplete);
    var isComplete;
    if(props.isComplete === 'complete') {
        isComplete = true;
    } else {
        isComplete = false;
    }

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
                    name={"md-cloud-download"} 
                    size={30}
                    onPress={props.downloadLesson}
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