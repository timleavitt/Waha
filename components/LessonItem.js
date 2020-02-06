//basic imports
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';

function LessonItem(props) {
    return(
        <TouchableOpacity style={styles.lessonItem} onPress={props.onLessonSelect}>
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
        justifyContent: "center"
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
        justifyContent: "center"
    }
})

export default LessonItem;