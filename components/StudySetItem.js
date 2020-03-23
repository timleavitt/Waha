//basic imports
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux'

function StudySetItem(props) {

    const [numCompleted, setNumCompleted] = useState(0)
    const [fullyCompleted, setFullyCompleted] = useState(false)

    var numLessons = 5

    useEffect(() => {
        var localNumCompleted = 0
        for (lesson in props.progress) {
            if (lesson.startsWith(props.id)) {
                localNumCompleted += 1
            }
        }
        setNumCompleted(localNumCompleted)
    }, [props.progress])

    useEffect(() => {
        if(numCompleted === numLessons) {
            setFullyCompleted(true)
        } else {
            setFullyCompleted(false)
        }
    }, [numCompleted])
    

    return(
        <TouchableOpacity style={styles.studySetItem} onPress={props.onStudySetSelect}>
            <View style={{flexDirection: "row"}}>   
                <View style={styles.progressImage}>
                    <AnimatedCircularProgress
                        size={120}
                        width={15}
                        fill={(numCompleted / numLessons) * 100}
                        tintColor={fullyCompleted ? props.grayedOut : props.primaryColor}
                        rotation={0}
                        backgroundColor="#fff"
                    >
                        {(fill) => (<MaterialCommunityIcons name={props.iconName} size={70} color={fullyCompleted ? props.grayedOut : props.primaryColor}/>)}
                    </AnimatedCircularProgress>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={{...styles.subtitle,...{color: fullyCompleted ? props.grayedOut : "black"}}}>{props.subtitle}</Text>
                    <Text style={{...styles.title,...{color: fullyCompleted ? props.grayedOut : "black"}}}>{props.title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    studySetItem: {
        flex: 1,
        height: 150,
        margin: 5,
        justifyContent: "center"
    },
    title: {
        fontSize: 22,
        textAlignVertical: "center",
        paddingHorizontal: 10,
        flexWrap: "wrap",
        fontFamily: 'open-sans-bold'
    },
    subtitle: {
        fontSize: 14,
        textAlignVertical: "center",
        paddingHorizontal: 10,
        flexWrap: "wrap",
        fontFamily: 'open-sans-light'
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "column",
    },
    progressImage: {
        margin: 5
    }
})


function mapStateToProps(state) {
    
    return {
        progress: state.appProgress,
        primaryColor: state.database[state.database.currentLanguage].colors.primaryColor,
        grayedOut: state.database[state.database.currentLanguage].colors.grayedOut,
    }
};

export default connect(mapStateToProps)(StudySetItem);