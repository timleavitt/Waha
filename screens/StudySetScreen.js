//basic imports
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

//data import
import { STUDYSETS } from '../data/dummy-data';
import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
//other component imports
import StudySetItem from '../components/StudySetItem';
import { Ionicons } from '@expo/vector-icons';

function StudySetScreen(props) {

    //state to do stuff on first launch (use for onboarding)
    const [isFirstLaunch, setIsFirstLaunch] = useState(false);

    async function checkFirstLaunch() {
        //UNCOMMENT TO CLEAR ASYNC STORAGE
        /*  const asyncStorageKeys = await AsyncStorage.getAllKeys();
        if (asyncStorageKeys.length > 0) {
            AsyncStorage.clear();
        }  */
        try {
            await AsyncStorage
                .getItem('alreadyLaunched')
                .then(value => {
                    if (value == null) {
                        AsyncStorage.setItem('alreadyLaunched', 'true');
                        setIsFirstLaunch(true);
                        setProgress();
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    //Purpose: set status of all lessons to 'incomplete'
    function setProgress() {
        var progress = {};
        for (i = 0; i < STUDYSETS.length; i++) {
            for (j = 0; j < STUDYSETS[i].lessonList.length; j++) {
                progress[STUDYSETS[i].lessonList[j].id] = 'incomplete'
            }
        }
        AsyncStorage.setItem('progress', JSON.stringify(progress))
    }

    //check if we're on first launch (maybe get better solution later;
    //this does an async operation every time this screen opens)
    useEffect(() => {
        checkFirstLaunch();
    }, [])

    //function to navigate to the lesson list screen
    //props.navigation.navigate takes us to lessonlist screen
    //params is the information we want to pass to lessonlist screen
    function navigateToLessonList(item) {
        props.navigation.navigate({
            routeName: "LessonList",
            params: {
                title: item.title,
                studySetID: item.id
            }
        })
    }

    //function to render the studyset items
    //includes onSelect which navigates to the appropriate lesson list screen
    function renderStudySetItem(studySetList) {
        return (
            <StudySetItem
                title={studySetList.item.title}
                onStudySetSelect={() => navigateToLessonList(studySetList.item)}
            />
        )
    }

    return (
        <View style={styles.screen}>
            <FlatList
                data={STUDYSETS}
                renderItem={renderStudySetItem}
            />
        </View>
    )
}

StudySetScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Study Sets'
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default StudySetScreen;