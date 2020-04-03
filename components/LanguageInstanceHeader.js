import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, FlatList } from 'react-native';
import { connect } from 'react-redux'
import GroupListItem from '../components/GroupListItem'
import {scaleMultiplier} from '../constants'

function LanguageInstanceHeader(props) {

   function renderGroupItem(groups) {
      return (
         <GroupListItem
            name={groups.item.name}
         />
      )
   }

   return (
      <View style={styles.languageHeaderContainer}>
         <Text style={styles.languageHeaderText}>{props.languageInstance}</Text>
         <FlatList
            data={props.groups.filter(group => group.language === props.languageInstance)}
            renderItem={renderGroupItem}
            keyExtractor={item => item.name}
         />
         <TouchableOpacity style={styles.addGroupContainer} onPress={props.goToAddNewGroupScreen}>
            <Text style={styles.addGroupText}>Add new group</Text>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   languageHeaderContainer: {
      width: "100%",
   },
   languageHeaderText: {
      fontSize: 18,
      fontFamily: "regular",
      color: "#9FA5AD",
      marginLeft: 30
   },
   addGroupContainer: {
      height: 72 * scaleMultiplier,
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      margin: 5
   },
   addGroupText: {
      color: "#2D9CDB",
      fontSize: 18,
      fontFamily: 'regular',
      marginLeft: 15
   }
})
function mapStateToProps(state) {
   return {
      colors: state.database[state.database.currentLanguage].colors,
      progress: state.appProgress,
      isRTL: state.database[state.database.currentLanguage].isRTL,
      groups: state.groups
   }
};

function mapDispatchToProps(dispatch) {
   return {
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageInstanceHeader);