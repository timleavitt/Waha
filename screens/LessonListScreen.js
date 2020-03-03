//basic imports
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, AsyncStorage, Alert, Text } from 'react-native';
import { useFocusEffect, useIsFocused } from 'react-navigation-hooks';
import * as FileSystem from 'expo-file-system';
import AwesomeAlert from 'react-native-awesome-alerts';

//data import
import { STUDYSETS } from '../data/dummy-data';

//component import
import LessonItem from '../components/LessonItem';

//redux
import { connect } from 'react-redux'

function LessonListScreen(props) {
  useFocusEffect(
    React.useCallback(() => {
      //console.log("useFocus has triggered, refreshing...")
      fetchCompleteStatuses();

      return () => { };
    }, [])
  );

  const isMounted = useRef(true);

  //don't update download progress if we leave the screen
  //(but still finish the download)
  useEffect(() => {
    return function cleanup() {
      isMounted.current = false;
      console.log('unloading')
    }
  }, [])

  const [isFocused, setIsFocused] = useState(true);

  const [progress, setProgress] = useState({});

  const [refresh, setRefresh] = useState(false);

  const [downloadProgress, setDownloadProgress] = useState(0);

  const [showAlert, setShowAlert] = useState(false);
  
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
        downloadProgress={downloadProgress}
      />
    )
  }

  //PURPOSE: download a lesson .mp3 from a specified source
  function callback(downloadProgressParam) {
    const progress = downloadProgressParam.totalBytesWritten / downloadProgressParam.totalBytesExpectedToWrite;
    if (isMounted.current) {
      setDownloadProgress(progress)
    }
  }


  async function downloadLesson(item) {
    //create our download object
    const downloadResumable = FileSystem.createDownloadResumable(
      item.source,
      FileSystem.documentDirectory + item.id + '.mp3',
      {},
      callback
    )

      //pop up the alert to show download progress
      setShowAlert(true);
      props.navigation.setOptions({headerLeft: null})
      try {
        const { uri } = await downloadResumable.downloadAsync();
        console.log('Finished downloading to ', uri);
        setDownloadProgress(0);
        setRefresh(old => !old)
        setShowAlert(false);
      } catch (error) {
        console.error(error);
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
      <AwesomeAlert
        show={showAlert}
        showProgress={true}
        title="Downloading lesson..."
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={false}
        confirmButtonColor="#DD6B55"
        customView={<Text>{Math.ceil(downloadProgress * 100).toString() + '%'}</Text>}
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

export default connect()(LessonListScreen);