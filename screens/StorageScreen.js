//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, FlatList, Image } from 'react-native';
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import { scaleMultiplier, headerImages } from '../constants'
import * as FileSystem from 'expo-file-system';
import FlatListSeparator from '../components/FlatListSeparator'

function StorageScreen(props) {


   //////////////////////////////////////////
   ////STATE, CONSTRUCTOR, AND NAVIGATION////
   //////////////////////////////////////////

   const [storageObject, setStorageObject] = useState({})
   const [totalStorage, setTotalStorage] = useState(0)
   //const [isLoading, setIsLoading] = useState(true)

   //set language based on user's language vs user's location?
   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
      getAllStorageUsed()
   }, [])

   function getNavOptions() {
      return {
         headerRight: props.isRTL ? () =>
            <BackButton
               isRTL={props.isRTL}
               onPress={() => props.navigation.goBack()}
            /> :
            () => <View></View>,
         headerLeft: props.isRTL ? () =>
            <View></View> :
            () =>
               <BackButton
                  isRTL={props.isRTL}
                  onPress={() => props.navigation.goBack()}
               />,
      }
   }

   // async function getStoragedUsedLoop(contents, storageUsed, language) {
   //    var storageUsed = 0

   //    return storageUsed
   // }

   async function getStorageUsedByLanguage(language) {
      var storageUsed = 0
      var regex = new RegExp('[a-z]{2}[0-9]{4}\..*');
      return await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
         .then(async contents => {
            for (const item of contents) {
               var hasMatch = regex.exec(item);
               if (hasMatch) {
                  if (item.slice(0, 2) === language) {
                     await FileSystem.getInfoAsync(FileSystem.documentDirectory + item, {})
                        .then(({ size }) => { storageUsed += Math.round(size / 1000000) })
                  }
               }
            }
         })
         .then(() => { return storageUsed })
      //console.log(storageUsed)
      //return storageUsed
   }

   function getAllStorageUsed() {
      setTotalStorage(0)
      setStorageObject({})
      var languages = getInstalledLanguageInstances()
      for (const language of languages) {
         getStorageUsedByLanguage(language.languageID)
            .then(storageUsed => {
               setTotalStorage(oldStorage => oldStorage + storageUsed)
               setStorageObject(oldObject => ({ ...oldObject, [language.languageID]: storageUsed }))
            })
      }

   }

   async function deleteDownloadedLessons(language) {
      await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
         .then(contents => {
            var regex = new RegExp('[a-z]{2}[0-9]{4}\..*');
            for (const item of contents) {
               var hasMatch = regex.exec(item);
               if (hasMatch) {
                  if (!language) {
                     FileSystem.deleteAsync(FileSystem.documentDirectory + item)
                  } else if (item.slice(0, 2) === language) {
                     FileSystem.deleteAsync(FileSystem.documentDirectory + item)
                  }
               }
            }
         })
         .then(() => {getAllStorageUsed()})
   }

   function getInstalledLanguageInstances() {
      var installedLanguageInstances = []
      for (key in props.database) {
         if (key.length === 2) {
            var languageObject = {};
            languageObject['languageName'] = props.database[key].displayName
            languageObject['languageID'] = key
            installedLanguageInstances.push(languageObject)
         }
      }
      return installedLanguageInstances
   }

   //console.log(getStorageUsed('en'))


   ///////////////////////
   ////OTHER FUNCTIONS////
   ///////////////////////


   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   function renderLanguageInstance(languageInstanceList) {
      return (
         <TouchableOpacity style={styles.storageContainerFlatList} onPress={
            () => Alert.alert(
               'Warning',
               "Are you sure you'd like to delete all downloaded lessons of this language?",
               [{
                  text: 'Cancel',
                  onPress: () => { }
               },
               {
                  text: 'OK',
                  onPress: () => deleteDownloadedLessons(languageInstanceList.item.languageID)
               }]
            )
         }>
            <Text style={styles.mbText}>{languageInstanceList.item.languageName}</Text>
            <Image style={styles.languageLogo} source={headerImages[languageInstanceList.item.languageID]} />
            <Text style={styles.mbText}>{storageObject[languageInstanceList.item.languageID]}MB</Text>
         </TouchableOpacity>
      )
   }

   return (
      <View style={styles.screen}>
         <View style={styles.storageList}>
            <FlatList
               data={getInstalledLanguageInstances()}
               renderItem={renderLanguageInstance}
               keyExtractor={item => item.languageID}
               ItemSeparatorComponent={FlatListSeparator}
               ListHeaderComponent={
                  <View style={styles.storageHeader}>
                     <View style={styles.headerItems}>
                     <View style={styles.headerItemContainer}>
                        <Text style={styles.storageUsedText}>Storage Used</Text>
                        <Text style={styles.mbText}>{totalStorage} MB</Text>
                     </View>
                     <TouchableOpacity
                        style={[styles.headerItemContainer, { borderTopWidth: 0 }]}
                        onPress={
                           () => Alert.alert(
                              'Warning',
                              "Are you sure you'd like to delete all downloaded lessons off your device?",
                              [{
                                 text: 'Cancel',
                                 onPress: () => { }
                              },
                              {
                                 text: 'OK',
                                 onPress: () => deleteDownloadedLessons()
                              }]
                           )
                        }>
                        <Text style={styles.deleteText}>Delete All Downloaded Lessons</Text>
                     </TouchableOpacity>
                     </View>
                     <Text style={styles.downloadedLessonsText}>Downloaded Lessons</Text>
                     <View style={{height: 2, flex: 1, backgroundColor: "#9FA5AD"}}/>
                  </View>
               }
               ListFooterComponent={<View style={{height: 2, flex: 1, backgroundColor: "#9FA5AD"}}/>}
            />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#FFFFFF",
   },
   storageList: {
      flex: 1,
      marginHorizontal: 15
   },
   storageHeader: {
      
   },
   headerItems: {
      marginBottom: 40
   },
   headerItemContainer: {
      height: 55 * scaleMultiplier,
      borderWidth: 2,
      borderColor: '#9FA5AD',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 5,
   },
   downloadedLessonsText: {
      color: '#9FA5AD',
      fontSize: 18 * scaleMultiplier,
      fontFamily: 'regular'
   },
   storageContainerFlatList: {
      height: 55 * scaleMultiplier,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: '#9FA5AD',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 5,
   },
   storageUsedText: {
      fontFamily: 'medium',
      fontSize: 18,
      color: '#3A3C3F'
   },
   mbText: {
      fontFamily: 'regular',
      fontSize: 18,
      color: '#82868D'
   },
   deleteText: {
      fontFamily: 'regular',
      fontSize: 18,
      color: '#E74D3D'
   },
   languageLogo: {
      resizeMode: "stretch",
      width: 96 * scaleMultiplier,
      height: 32 * scaleMultiplier,
      marginRight: 10
   }
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      groups: state.groups,
      colors: state.database[activeGroup.language].colors,
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroupName: activeGroup.name,
      activeGroupImageSource: activeGroup.imageSource,
      database: state.database
   }
};

function mapDispatchToProps(dispatch) {
   return {
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageScreen);