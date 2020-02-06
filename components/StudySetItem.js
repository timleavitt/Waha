//basic imports
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';

function StudySetItem(props) {
    return(
        <TouchableOpacity style={styles.studySetItem} onPress={props.onStudySetSelect}>
            <View>
                <Text style={styles.title}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    studySetItem: {
        flex: 1,
        height: 150,
        borderColor: "black",
        borderWidth: 2,
        margin: 5,
        justifyContent: "center"
    },
    title: {
        fontSize: 22,
        textAlignVertical: "center",
        paddingHorizontal: 10
    }
})

export default StudySetItem;