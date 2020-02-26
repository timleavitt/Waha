//basic imports
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

//data import
import { STUDYSETS } from '../data/dummy-data';
import { AsyncStorage } from 'react-native';

//other component imports
import StudySetItem from '../components/StudySetItem';
import { Ionicons } from '@expo/vector-icons';

function StudySetScreen(props) {
    
    const [isFirstLaunch, setIsFirstLaunch] = useState(false);

    async function checkFirstLaunch() {
      /*   const asyncStorageKeys = await AsyncStorage.getAllKeys();
        if (asyncStorageKeys.length > 0) {
            AsyncStorage.clear();
        } */
        try {
            await AsyncStorage
                .getItem('alreadyLaunched')
                .then(value => {
                    if (value == null) {
                        AsyncStorage.setItem('alreadyLaunched', 'true');
                        setIsFirstLaunch(true);
                        setProgressAndDownloads();
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    function setProgressAndDownloads() {
        //old
        /* var lesson;
        for (i = 0; i < STUDYSETS.length; i++) {
            for (j = 0; j < STUDYSETS[i].lessonList.length; j++) {
                lesson = STUDYSETS[i].lessonList[j].id
                setAsyncValue(lesson, 'incomplete');
            }
        }  */

        var progress = {};
        var downloads = {};

        for (i = 0; i < STUDYSETS.length; i++) {
            for (j = 0; j < STUDYSETS[i].lessonList.length; j++) {
                progress[STUDYSETS[i].lessonList[j].id] = 'incomplete'
                downloads[STUDYSETS[i].lessonList[j].id] = 'notDownloaded'
            }
        }
        setAsyncValue("progress", JSON.stringify(progress));
        setAsyncValue("downloads", JSON.stringify(downloads));
    }

    async function setAsyncValue(key, mark) {
        try {
            await AsyncStorage
               .setItem(key, mark)
               .then(value => {
               }) 
       } catch (error) {
           console.log(error);
       } 
    }

    useEffect(() => {
        console.log("study set screen use effect")
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
        return(
            <StudySetItem 
                title={studySetList.item.title}
                onStudySetSelect={() => navigateToLessonList(studySetList.item)}
            />
        )
    }

    return(
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