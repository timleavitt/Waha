import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { scaleMultiplier } from '../constants'
import { connect } from 'react-redux'

function PlayScreenHeaderButtons(props) {
   return (
      <View style={[styles.headerButtonsContainer, {flexDirection: props.isRTL ? 'row-reverse' : 'row', marginHorizonal: 5}]}>
         <TouchableOpacity
            onPress={props.shareOnPress}
         >
            <Icon
               name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'}
               size={32 * scaleMultiplier}
               color="#828282"
            />
         </TouchableOpacity>
         <TouchableOpacity
            style={{marginHorizontal: 5}}
            onPress={props.completeOnPress}
         >
            <Icon
               name={props.completeCondition ? "check-filled" : "check-unfilled"}
               size={35 * scaleMultiplier}
               color='#828282'
            />
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   headerButtonsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
   },
})

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      isRTL: state.database[activeGroup.language].isRTL
   }
};

export default connect(mapStateToProps)(PlayScreenHeaderButtons);