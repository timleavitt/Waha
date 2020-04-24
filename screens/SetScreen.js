import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import SetItem from '../components/SetItem';
import AvatarImage from '../components/AvatarImage'
import { connect } from 'react-redux'

function SetScreen(props) {

   // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => { console.log(contents) })

   //// CONSTRUCTOR

   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
   }, [props.isRTL])

   //// NAV OPTIONS

   function getNavOptions() {
      return {
         headerTitle: () => <Image style={styles.headerImage} source={{ uri: FileSystem.documentDirectory + props.activeGroup.language + 'header.png' }} />,
         headerLeft: props.isRTL ?
            () => <View></View> :
            () =>
               <AvatarImage
                  source={props.activeGroup.imageSource}
                  size={40}
                  onPress={() => props.navigation.toggleDrawer()}
                  isActive={true}
               />,
         headerRight: props.isRTL ?
            () =>
               <AvatarImage
                  source={props.activeGroup.imageSource}
                  size={40}
                  onPress={() => props.navigation.toggleDrawer()}
                  isActive={true}
               /> :
            () => <View></View>
      }
   }

   //// RENDER

   function renderStudySetItem(setList) {
      return (
         <SetItem
            id={setList.item.id}
            index={setList.item.index}
            title={setList.item.title}
            subtitle={setList.item.subtitle}
            color={setList.item.color}
            onSetSelect={
               () => props.navigation.navigate('LessonList', {
                  setID: setList.item.id,
                  index: setList.item.index,
                  title: setList.item.title,
                  subtitle: setList.item.subtitle,
                  color: setList.item.color,
               })
            }
            isSmall={false}
         />
      )
   }

   return (
      <View style={styles.screen}>
         <FlatList
            data={props.activeDatabase.sets}
            renderItem={renderStudySetItem}
         />
      </View>
   )
}

//// STYLES

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#EAEEF0"
   },
   headerImage: {
      resizeMode: "contain",
      width: 120,
      height: 40,
      alignSelf: "center",
   }
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      activeDatabase: state.database[activeGroup.language],
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroup: activeGroup,
   }
};

export default connect(mapStateToProps)(SetScreen);