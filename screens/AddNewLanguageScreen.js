import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert, Image } from 'react-native';
import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'
import { connect } from 'react-redux'
import { addLanguage } from '../redux/actions/databaseActions'

function AddNewLanguageScreen(props) {

   //// CONSTRUCTOR

   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
   }, [])

   //// NAV OPTIONS

   function getNavOptions() {
      return {
         headerRight: props.isRTL ?
            () => <BackButton onPress={() => props.navigation.goBack()} /> :
            () => <View></View>,
         headerLeft: props.isRTL ?
            () => <View></View> :
            () => <BackButton onPress={() => props.navigation.goBack()} />,
      }
   }

   // manually updated list of all available languages to cross check with downloaded languages
   var languageInstanceList = [
      {
         id: 'en',
         displayName: 'English'
      },
      {
         id: 'te',
         displayName: 'Test Language'
      },
   ]

   // set list of installed languages
   var installedLanguageInstances = []
   for (key in props.database) {
      if (key.length === 2) {
         installedLanguageInstances.push(key)
      }
   }

   //// RENDER

   function renderLanguageInstanceItem(languageInstanceList) {
      return (
         <TouchableOpacity
            style={[styles.languageInstanceItem, { flexDirection: props.isRTL ? 'row-reverse' : 'row' }]}
            onPress={() => Alert.alert(
               props.translations.alerts.addNewLanguage.header,
               props.translations.alerts.addNewLanguage.body,
               [{
                  text: props.translations.alerts.options.cancel,
                  onPress: () => { }
               }, {
                  text: props.translations.alerts.options.ok,
                  onPress: () => props.addLanguage(languageInstanceList.item.id)
               }]
            )}
         >
            <Text style={styles.languageInstanceText}>{languageInstanceList.item.displayName}</Text>
            {/* <Image style={styles.languageLogo} source={{ uri: FileSystem.documentDirectory + languageInstanceList.item.id + 'header.png' }} /> */}
         </TouchableOpacity>
      )
   }

   var languageListComponent = (languageInstanceList.filter(item => !installedLanguageInstances.includes(item.id)).length != 0) ?
      <FlatList
         data={languageInstanceList.filter(item => !installedLanguageInstances.includes(item.id))}
         renderItem={renderLanguageInstanceItem}
      /> :
      <Text style={styles.noMoreLanguagesText}>{props.translations.labels.noMoreLanguages}</Text>
      
   return (
      <View style={styles.screen}>
         {languageListComponent}
      </View>
   )
}

//// STYLES

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#F7F7F7"
   },
   languageInstanceItem: {
      flexDirection: "row",
      justifyContent: 'space-between',
      alignItems: "center",
      height: 60,
      margin: 5,
      borderWidth: 2,
      borderColor: "#9FA5AD"
   },
   languageInstanceText: {
      color: '#82868D',
      paddingHorizontal: 10,
      fontSize: 18,
      fontFamily: 'regular'
   },
   languageLogo: {
      resizeMode: "stretch",
      width: 96 * scaleMultiplier,
      height: 32 * scaleMultiplier,
      marginHorizontal: 10
   },
   noMoreLanguagesText: {
      color: '#82868D',
      paddingLeft: 10,
      fontSize: 18,
      fontFamily: 'regular',
      textAlign: 'center',
      marginTop: 20
   }
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      isRTL: state.database[activeGroup.language].isRTL,
      database: state.database,
      translations: state.database[activeGroup.language].translations,
      activeGroup: activeGroup
   }
};

function mapDispatchToProps(dispatch) {
   return {
      addLanguage: language => dispatch(addLanguage(language)),
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewLanguageScreen);