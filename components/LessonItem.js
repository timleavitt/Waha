//basic imports
import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AsyncStorage} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function LessonItem(props) {

    const [isComplete, setIsComplete] = useState(false);
    
    useEffect(() => {
        console.log(props.progressArray);
        //console.log(isComplete)
    }, [])
/* 
    async function getLessonMark() {
        try {
          await AsyncStorage
            .getItem(props.id)
            .then(value => {
              if (value === 'incomplete') {
                setIsComplete(false);
              } else {
                setIsComplete(true);
              }
            })
        } catch (error) {
          console.log(error);
        }
      }  */

    return(
        <TouchableOpacity style={styles.lessonItem} onPress={props.onLessonSelect}>
            <View style={styles.icon}><Ionicons name={isComplete ? "ios-arrow-dropdown-circle" : "ios-arrow-dropdown"} size={30}/></View>
            
            <View styles={styles.titleContainer}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.subtitle}>{props.subtitle}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    lessonItem: {
        flex: 1,
        height: 75,
        borderColor: "black",
        borderWidth: 2,
        margin: 5,
        justifyContent: "flex-start",
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
    }
})

export default LessonItem;