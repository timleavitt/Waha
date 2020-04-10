import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { scaleMultiplier } from '../constants';

function BackButton(props) {
   return (
         <TouchableOpacity
            style={[styles.backButtonContainer, {justifyContent: props.isRTL ? 'flex-end' : 'flex-start'}]}
            onPress={props.onPress}
         >
            <Icon
               name={props.isRTL ? 'arrow-right' : 'arrow-left'}
               size={45 * scaleMultiplier}
               color="#828282"
            />
         </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   backButtonContainer: {
      flexDirection: "row",
      width: 100,
   }
})

export default BackButton