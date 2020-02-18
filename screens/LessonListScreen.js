//basic imports
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, AsyncStorage } from 'react-native';
import { useIsFocused, useFocusEffect } from 'react-navigation-hooks';

//data import
import { STUDYSETS } from '../data/dummy-data';

//component import
import LessonItem from '../components/LessonItem';
import { Audio } from 'expo-av';

function LessonListScreen(props) {

  //idea: could I have all the progress tracking logic on this screen instead of in the play screen?
  //send over array of all the progress for that study set and filter on play screen
  //update it using a function prop passed to play screen that changes the state on 

   useFocusEffect(
    React.useCallback(() => {
      console.log("useFocus has triggered, refreshing...")
      fetchCompleteStatuses();
      return () => {};
    }, [])
  ); 

  const [progress, setProgress] = useState({});

  const [refresh, setRefresh] = useState(false);

/*   function refreshments() {
    console.log('refresh firing')
    fetchCompleteStatuses();
  }
 */


  //find our specified study set with data taken from the last screen
  selectedStudySetArray = STUDYSETS.filter(studyset => studyset.id === props.navigation.getParam("studySetID"));

  //make our data only the array of lessons
  selectedLessonList = selectedStudySetArray[0].lessonList;

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
        source: item.source,
        //refresh: refreshments
        //updateProgress: updateProgressArray
      }
    })
  }

  //PURPOSE: get the progress object from async
  async function fetchCompleteStatuses() {
    await AsyncStorage
          .getItem("progress")
          .then(value => {
            setProgress(JSON.parse(value))
          })
  }

  //PURPOSE: function to render each individual lesson item in the flatlist
  function renderLessonItem(LessonList) {
    return (
      <LessonItem
        id={LessonList.item.id}
        title={LessonList.item.title}
        subtitle={LessonList.item.subtitle}
        onLessonSelect={() => navigateToPlay(LessonList.item)}
        isComplete={progress[LessonList.item.id]}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={selectedLessonList}
        renderItem={renderLessonItem}
        //extraData={progress}
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