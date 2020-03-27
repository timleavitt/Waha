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
               color='white'
            />
         </TouchableOpacity>
   } else {
      secondButton = null
   }
   return (
      <View style={styles.headerButtonsContainer}>
         <TouchableOpacity
            style={styles.headerButton}
            onPress={props.onPress1}
         >
            <Ionicons
               name={props.name}
               size={30}
               color="white"
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
      alignItems: "center",
      marginHorizontal: 10
   }
})

export default HeaderButtons