//basic imports
import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';

//data import
import { STUDYSETS } from '../data/dummy-data';

//other component imports
import StudySetItem from '../components/StudySetItem';

function StudySetScreen(props) {
    
    //i want to push this becuase it's working


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

    //another change

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
        <View>
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

export default StudySetScreen;