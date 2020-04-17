import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'

function DrawerItem(props) {

   //// RENDER

   return (
      <TouchableOpacity style={[styles.settingsItem, { flexDirection: props.isRTL ? "row-reverse" : "row" }]} onPress={props.onPress}>
         <View style={styles.iconContainer}>
            <Icon
               name={props.name}
               size={50 * scaleMultiplier}
               color="#3A3C3F"
            />
         </View>
         <Text style={[styles.title, {textAlign: props.isRTL ? 'right' : 'left'}]}>{props.text}</Text>
      </TouchableOpacity>
   )
}

//// STYLES

const styles = StyleSheet.create({
   settingsItem: {
      height: 52 * scaleMultiplier,
      paddingLeft: 5,
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      margin: 5
   },
   iconContainer: {
      justifyContent: "center",
      alignItems: "center",
      width: 50 * scaleMultiplier
   },
   title: {
      color: '#3A3C3F',
      fontSize: 18 * scaleMultiplier,
      textAlignVertical: "center",
      paddingHorizontal: 10,
      fontFamily: 'medium',
      textAlign: "center"
   },
})

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0];
   return {
      isRTL: state.database[activeGroup.language].isRTL,
   }
};

export default connect(mapStateToProps)(DrawerItem);