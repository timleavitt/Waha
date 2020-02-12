//basic imports
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, AsyncStorage } from 'react-native';

//data import
import { STUDYSETS } from '../data/dummy-data';

//component import
import LessonItem from '../components/LessonItem';
import { Audio } from 'expo-av';

function LessonListScreen(props) {

  //idea: could I have all the progress tracking logic on this screen instead of in the play screen?
  //send over array of all the progress for that study set and filter on play screen
  //update it using a function prop passed to play screen that changes the state on 

  const [progressArray, setProgressArray] = useState([]);

  //find our specified study set with data taken from the last screen
  selectedStudySetArray = STUDYSETS.filter(studyset => studyset.id === props.navigation.getParam("studySetID"));

  //make our data only the array of lessons
  selectedLessonList = selectedStudySetArray[0].lessonList;

  useEffect(() => {
    getLessonMarks(selectedLessonList)
  }, [])

  useEffect(() => {
    console.log("progressArrayChanging");
  }, [progressArray])

  //function to navigate to the play screen
  //props.navigation.navigate takes us to the play screen
  //params is the information we want to pass to play screen
  function navigateToPlay(item) {
    props.navigation.navigate({
      routeName: "Play",
      params: {
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        source: item.source
      }
    })
  }

  async function getLessonMarks(selectedLessonList) {
    for (i = 0; i < selectedLessonList.length; i++) {
      try {
        await AsyncStorage
          .getItem(selectedLessonList[i].id)
          .then(value => {
            setProgressArray(currentArray => currentArray.concat([value]));
          })
      } catch (error) {
        console.log(error);
      }
    }
  }

  function renderLessonItem(LessonList) {

    return (
      <LessonItem
        id={LessonList.item.id}
        title={LessonList.item.title}
        subtitle={LessonList.item.subtitle}
        onLessonSelect={() => navigateToPlay(LessonList.item)}
        progressArray={progressArray}
      />
    )
  }





  return (
    <View style={styles.screen}>
      <FlatList
        data={selectedLessonList}
        renderItem={renderLessonItem}
        extraData={progressArray}
      />
    </View>
  )
}

LessonListScreen.navigationOptions = navigationData => {
  return {
    headerTitle: navigationData.navigation.getParam("title")
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
})

export default LessonListScreen;