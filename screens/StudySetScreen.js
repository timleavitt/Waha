//basic imports
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import i18n from 'i18n-js';



//other component imports
import StudySetItem from '../components/StudySetItem';

//redux
import { connect } from 'react-redux'
import { addLanguage, changeLanguage } from '../redux/actions/databaseActions'
import { setFirstOpen } from '../redux/actions/databaseActions'

function StudySetScreen(props) {

    //check if we're on first launch (maybe get better solution later;
    //this does an async operation every time this screen opens)
    useEffect(() => {
        if (props.isFirstOpen) {
            props.navigation.replace("LanguageSelect")
        }
        console.log(props.appProgress)
        //props.changeLanguage("english");
        //props.addLanguage("english");
    }, [])

    FileSystem.getFreeDiskStorageAsync().then(freeDiskStorage => {
        //console.log(freeDiskStorage)
      });
    
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
        //console.log(contents)
    });

    //function to navigate to the lesson list screen
    //props.navigation.navigate takes us to lessonlist screen
    //params is the information we want to pass to lessonlist screen
    function navigateToLessonList(item) {
        props.navigation.navigate({
            routeName: "LessonList",
            params: {
                title: item.title,
                studySetID: item.id,
            }
        })
    }

    i18n.translations = {
        en: { 
          loadingMessage: "Hang on, we're setting things up..."
        },
        es: {
          loadingMessage: "Espera, estamos preparando las cosas..."
        }
      };


    ////////////////////////////////
    ////RENDER/STYLES/NAVOPTIONS////
    ////////////////////////////////

    
    //function to render the studyset items
    //includes onSelect which navigates to the appropriate lesson list screen
    function renderStudySetItem(studySetList) {
        return (
            <StudySetItem
                title={studySetList.item.title}
                onStudySetSelect={() => navigateToLessonList(studySetList.item)}
                id={studySetList.item.id}
            />
        )
    }

    
    //if we're not fetching data, render the flatlist. if we are, render a loading screen
    if (!props.isFetching) {
        return (
            <View style={styles.screen}>
                <FlatList
                    data={props.database[props.database.currentLanguage].studySets}
                    renderItem={renderStudySetItem}
                    extraData={props.appProgress}
                />
                <Text style={{...styles.text, color: props.primaryColor}}>This text is the primary color from the database! How cool!</Text>
                <Text style={{...styles.text, color: props.secondaryColor}}>This text is the secondary color from the database! Radical!</Text>
            </View>
        )
    } else {
        return (
            <View style={{flex: 1, justifyContent: "center"}}>
                <Text style={{textAlign: "center", fontSize: 30, marginVertical: 20}}>{i18n.t('loadingMessage')}</Text>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    }
}

StudySetScreen.navigationOptions = navData => {
    return {
        headerTitle: "waha"
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    text: {
        textAlign: "center",
        margin: 40
    }
})

/////////////
////REDUX////
/////////////

function mapStateToProps(state) {
    //console.log(state.appProgress)
    if(!state.database.isFetching)
        return {
            database: state.database,
            primaryColor: state.database[state.database.currentLanguage].colors.primaryColor,
            secondaryColor: state.database[state.database.currentLanguage].colors.secondaryColor,
            appProgress: state.appProgress
        }
    else {
        return {
            isFetching: state.database.isFetching,
            isFirstOpen: state.database.isFirstOpen
        }
    }
};

function mapDispatchToProps(dispatch) {
return {
    addLanguage: language => dispatch(addLanguage(language)),
    changeLanguage: language => dispatch(changeLanguage(language)),
    setFirstOpen: toSet => dispatch(setFirstOpen(toSet))
}
};

export default connect(mapStateToProps, mapDispatchToProps)(StudySetScreen);