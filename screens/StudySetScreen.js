//basic imports
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { purgeStoredState } from 'redux-persist'

//data import
import { AsyncStorage } from 'react-native';


//other component imports
import StudySetItem from '../components/StudySetItem';

//redux
import { connect } from 'react-redux'
import { addLanguage, changeLanguage } from '../redux/actions/databaseActions'

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
        props.changeLanguage("english");
        props.addLanguage("english");
    }, [])

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

    if (!props.isFetching) {
        return (
            <View style={styles.screen}>
                <FlatList
                    data={props.database[props.database.currentLanguage].studySets}
                    renderItem={renderStudySetItem}
                />
                <Text style={{...styles.text, color: props.primaryColor}}>This text is the primary color from the database! How cool!</Text>
                <Text style={{...styles.text, color: props.secondaryColor}}>This text is the secondary color from the database! Radical!</Text>
            </View>
        )
    } else {
        return (
            <View style={{flex: 1, justifyContent: "center"}}>
                <Text style={{textAlign: "center", fontSize: 30, marginVertical: 20}}>Hang on, we're setting things up...</Text>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    }
}

StudySetScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Study Sets'
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

function mapStateToProps(state) {
    console.log(state)
    if(!state.database.isFetching)
        return {
            database: state.database,
            primaryColor: state.database[state.database.currentLanguage].colors.primaryColor,
            secondaryColor: state.database[state.database.currentLanguage].colors.secondaryColor
        }
    else {
        return {
            isFetching: state.database.isFetching,
        }
    }
};

function mapDispatchToProps(dispatch) {
return {
    addLanguage: language => dispatch(addLanguage(language)),
    changeLanguage: language => dispatch(changeLanguage(language))
}
};

export default connect(mapStateToProps, mapDispatchToProps)(StudySetScreen);