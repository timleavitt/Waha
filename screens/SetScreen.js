import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import SetItem from '../components/SetItem';
import AvatarImage from '../components/AvatarImage'
import { connect } from 'react-redux'
import { headerImages } from '../constants'

function SetScreen(props) {
   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
   }, [props.isRTL])

   function getNavOptions() {
      return {
         headerTitle: () => <Image style={styles.headerImage} source={headerImages[props.activeGroupLanguage]} />,
         headerLeft: props.isRTL ?
            () => <View></View> :
            () =>
               <AvatarImage
                  source={props.activeGroupImageSource}
                  size={40}
                  onPress={() => props.navigation.toggleDrawer()}
                  isActive={true}
               />,
         headerRight: props.isRTL ?
            () =>
               <AvatarImage
                  source={props.activeGroupImageSource}
                  size={40}
                  onPress={() => props.navigation.toggleDrawer()}
                  isActive={true}
               /> :
            () => <View></View>
      }
   }


   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////


   //function to render the studyset items
   //includes onSelect which navigates to the appropriate lesson list screen
   function renderStudySetItem(setList) {
      return (
         <SetItem
            id={setList.item.id}
            title={setList.item.title}
            subtitle={setList.item.subtitle}
            color={setList.item.color}
            onSetSelect={
               () => props.navigation.navigate('LessonList', {
                  setID: setList.item.id,
                  title: setList.item.title,
                  subtitle: setList.item.subtitle,
                  color: setList.item.color,
                  isRTL: props.isRTL
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

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#EAEEF0"
   },
   headerImage: {
      resizeMode: "center",
      width: 120,
      height: 40,
      alignSelf: "center",
   }
})

/////////////
////REDUX////
/////////////

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      activeDatabase: state.database[activeGroup.language],
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroupImageSource: activeGroup.imageSource,
      activeGroupLanguage: activeGroup.language
   }
};

export default connect(mapStateToProps)(SetScreen);