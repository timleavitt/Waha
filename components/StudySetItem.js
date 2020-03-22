//basic imports
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux'

function StudySetItem(props) {

    const [numCompleted, setNumCompleted] = useState(0)

    console.log(props.id)

    useEffect(() => {
        var localNumCompleted = 0
        for (lesson in props.progress) {
            if (lesson.startsWith(props.id)) {
                localNumCompleted += 1
            }
        }
        setNumCompleted(localNumCompleted)
    }, [])
    

    

    return(
        <TouchableOpacity style={styles.studySetItem} onPress={props.onStudySetSelect}>
            <View style={{flexDirection: "row"}}>   
                <View style={styles.progressImage}>
                    <AnimatedCircularProgress
                        size={120}
                        width={15}
                        fill={(numCompleted / 5) * 100}
                        tintColor="#00e0ff"
                        onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="#3d5875"
                    >
                        {(fill) => (<MaterialCommunityIcons name='pine-tree' size={80}/>)}
                    </AnimatedCircularProgress>
                </View>
                <View style={styles.titleContainer}>
                 <Text style={styles.title}>{props.title}</Text>
                </View>
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
        paddingHorizontal: 10,
        flexWrap: "wrap",
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center"
    },
    progressImage: {
        margin: 5
    }
})


function mapStateToProps(state) {
    
    return {
        progress: state.appProgress
    }
};

export default connect(mapStateToProps)(StudySetItem);