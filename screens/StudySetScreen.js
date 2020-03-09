//basic imports
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';

//data import
import { STUDYSETS } from '../data/dummy-data';
import { AsyncStorage } from 'react-native';
import db from '../config'

//other component imports
import StudySetItem from '../components/StudySetItem';

//redux
import { connect } from 'react-redux'
import { fetchData } from '../redux/actions/databaseActions'

function StudySetScreen(props) {

    // //Get stuff from database
    // db.collection("languages").doc("english").get().then(doc => {
    //     if (doc.exists) {
    //         //deal with colors and fonts
    //         //console.log("Document data:", doc.data());
    //     } else {
    //         // doc.data() will be undefined in this case
    //         //console.log("No such document!");
    //     }})

    // db.collection("languages").doc("english").collection("studySets").get().then(querySnapshot => {
    //     querySnapshot.forEach(doc => {
    //         //console.log(doc.data())
    //     })
    // }) 
    //console.log(db)

    //state to do stuff on first launch (use for onboarding)
    const [isFirstLaunch, setIsFirstLaunch] = useState(false);

    async function checkFirstLaunch() {
        //UNCOMMENT TO CLEAR ASYNC STORAGE
          const asyncStorageKeys = await AsyncStorage.getAllKeys();
        if (asyncStorageKeys.length > 0) {
            AsyncStorage.clear();
        }  
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
            <View>
                <Button title="fetch data" onPress={props.fetchData}/>
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
        database: state.database
    }
  };

  function mapDispatchToProps(dispatch) {
    return {
      fetchData: () => dispatch(fetchData())
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(StudySetScreen);