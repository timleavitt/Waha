import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

function BackButton(props) {
   return (
         <TouchableOpacity
            style={[styles.backButtonContainer, {justifyContent: props.isRTL ? 'flex-end' : 'flex-start'}]}
            onPress={props.onPress}
         >
            <Ionicons
               name={props.isRTL ? 'ios-arrow-forward' : 'ios-arrow-back'}
               size={30}
               color="#828282"
            />
         </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   backButtonContainer: {
      flexDirection: "row",
      marginHorizontal: 10,
      width: 100,
   }
})

export default BackButton