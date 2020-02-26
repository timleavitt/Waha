//basic imports
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, AsyncStorage } from 'react-native';
import { useFocusEffect } from 'react-navigation-hooks';
import * as FileSystem from 'expo-file-system';

//data import
import { STUDYSETS } from '../data/dummy-data';

//component import
import LessonItem from '../components/LessonItem';


function LessonListScreen(props) {
  useFocusEffect(
    React.useCallback(() => {
      //console.log("useFocus has triggered, refreshing...")
      fetchCompleteStatuses();

      return () => { };
    }, [])
  );

  const [progress, setProgress] = useState({});

  const [refresh, setRefresh] = useState(false);

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
        downloadLesson={() => downloadLesson(LessonList.item)}
        deleteLesson={() => deleteLesson(LessonList.item)}
        isComplete={progress[LessonList.item.id]}
      />
    )
  }

  //PURPOSE: download a lesson .mp3 from a specified source
  function downloadLesson(item) {
    try {
    FileSystem.downloadAsync(
      item.source,
      FileSystem.documentDirectory + item.id + '.mp3'
    )
      .then(({ uri }) => {
        setRefresh(old => !old)
      })
      .catch(error => {
        console.error(error);
      });
    } catch (error) {
      console.log(error)
    }
  }

  //PURPOSE: delete a lesson .mp3 from a specific address
  function deleteLesson(item) {
    FileSystem.deleteAsync(FileSystem.documentDirectory + item.id + '.mp3')
    setRefresh(old => !old)
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={selectedLessonList}
        renderItem={renderLessonItem}
        extraData={refresh}
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