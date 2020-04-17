import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'

function SmallDrawerItem(props) {

   //// RENDER

   return (
      <TouchableOpacity style={[styles.smallDrawerItemContainer, {flexDirection: props.isRTL ? "row-reverse" : "row"}]} onPress={props.onPress}>
         <Text style={[styles.smallDrawerItemText, {textAlign: props.isRTL ? 'right' : 'left'}]}>{props.label}</Text>
      </TouchableOpacity>
   )
}

//// STYLES

const styles = StyleSheet.create({
   smallDrawerItemContainer: {
      margin: 5,
      padding: 5,
   },
   smallDrawerItemText: {
      fontFamily: 'medium',
      fontSize: 18 * scaleMultiplier,
      color: '#82868D',
   }
})

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0];
   return {
      isRTL: state.database[activeGroup.language].isRTL,
   }
};

export default connect(mapStateToProps)(SmallDrawerItem);