//basic imports
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import { AppLoading } from 'expo'
//data import
import { STUDYSETS } from '../data/dummy-data';
import { AsyncStorage } from 'react-native';
import db from '../config'

//other component imports
import StudySetItem from '../components/StudySetItem';

//redux
import { connect } from 'react-redux'
import { addLanguage } from '../redux/actions/databaseActions'
import { changeLanguage } from '../redux/actions/currentLanguageActions'

function StudySetScreen(props) {

    //state to do stuff on first launch (use for onboarding)
    const [isFirstLaunch, setIsFirstLaunch] = useState(false);

    async function checkFirstLaunch() {
        //UNCOMMENT TO CLEAR ASYNC STORAGE
        //   const asyncStorageKeys = await AsyncStorage.getAllKeys();
        // if (asyncStorageKeys.length > 0) {
        //     AsyncStorage.clear();
        // }  
        try {
            await AsyncStorage
                .getItem('alreadyLaunched')
                .then(value => {
                    if (value == null) {
                        AsyncStorage.setItem('alreadyLaunched', 'true');
                        setIsFirstLaunch(true);
                    }
                })
        } catch (error) {
            console.log(error);
        }
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

    function dummyLanguageSetup() {
        props.changeLanguage("english")
        props.addLanguage("english");
    }

    return (
        <View style={styles.screen}>
            <FlatList
                data={STUDYSETS}
                renderItem={renderStudySetItem}
            />
            <View style={{height: 100}}>
                <Button title="fetch data" onPress={dummyLanguageSetup}/>
            </View>
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

function mapStateToProps(state) {
    console.log(state)
    return {
        database: state.database,
        currentLanguage: state.language.currentLanguage
    }
};

function mapDispatchToProps(dispatch) {
return {
    addLanguage: language => dispatch(addLanguage(language)),
    changeLanguage: language => dispatch(changeLanguage(language))
}
};

export default connect(mapStateToProps, mapDispatchToProps)(StudySetScreen);