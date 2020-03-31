import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

function HeaderButtons(props) {
   var secondButton;
   if (props.hasCompleteButton) {
      secondButton =
         <TouchableOpacity
            style={styles.headerButton}
            onPress={props.completeOnPress}
         >
            <Ionicons
               name={props.completeCondition ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"}
               size={30}
               color='#828282'
            />
         </TouchableOpacity>
   } else {
      secondButton = null
   }
   return (
      <View style={{...styles.headerButtonsContainer, ...{justifyContent: props.name === 'ios-arrow-back' ? "flex-start" : "flex-end"}}}>
         <TouchableOpacity
            style={{...styles.headerButton, ...{width: props.name === 'ios-arrow-back' ? 120 : null}}}
            onPress={props.onPress1}
         >
            <Ionicons
               name={props.name}
               size={30}
               color="#828282"
            />
         </TouchableOpacity>
         {secondButton}
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
      marginHorizontal: 10,
   }
})

export default HeaderButtons