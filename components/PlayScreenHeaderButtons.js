import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { scaleMultiplier } from '../constants'

function HeaderButtons(props) {
   return (
      <View style={styles.headerButtonsContainer}>
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
   headerButton: {
      alignItems: "flex-start",
      marginHorizontal: 5,
   }
})

export default HeaderButtons