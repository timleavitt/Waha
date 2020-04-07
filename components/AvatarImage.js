import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { scaleMultiplier } from '../constants'

function AvatarImage(props) {

   var avatarImage = (props.source === '') ?
      <MaterialIcons name='group' size={props.size / 2 * scaleMultiplier} /> :
      <Image style={{...styles.avatarContainer, 
         ...{
            width: props.size * scaleMultiplier, 
            height: props.size * scaleMultiplier, 
            borderRadius: props.size * scaleMultiplier / 2
         }}} source={{ uri: props.source }} />

   return (
      <View style={{
         borderColor: props.isActive ? '#2D9CDB' : null,
         borderWidth: props.isActive ? 5 : null,
         width: props.size * scaleMultiplier + 5, 
         height: props.size * scaleMultiplier + 5,
         borderRadius: props.size * scaleMultiplier / 2 + 5,
         alignItems: "center",
         justifyContent: "center",
         marginHorizontal: 10,
         }}
      >
      <TouchableOpacity style={{...styles.avatarContainer, 
         ...{
            width: props.size * scaleMultiplier, 
            height: props.size * scaleMultiplier, 
            borderRadius: props.size * scaleMultiplier / 2,
            
         }}} source={{ uri: props.source }} onPress={props.onPress}>
         {avatarImage}
      </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   avatarContainer: {
      backgroundColor: '#a5a8ad',
      justifyContent: "center",
      alignItems: "center",
   }, 
})

export default AvatarImage