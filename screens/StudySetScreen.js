//basic imports
import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

//data import
import { STUDYSETS } from '../data/dummy-data';

//other component imports
import StudySetItem from '../components/StudySetItem';

function StudySetScreen(props) {
    
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
      headerTitle: 'Study Sets',
    };
  };

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})

export default StudySetScreen;