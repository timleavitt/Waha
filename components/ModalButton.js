import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { scaleMultiplier } from '../constants'

function ModalButton(props) {
    return (
        <TouchableOpacity 
            style={styles.modalButtonStyle}
            onPress={props.onPress}
        >
            <Text style={{...styles.text, ...props.style}}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    modalButtonStyle: {
      width: "100%",
      height: 60 * scaleMultiplier,
      justifyContent: "center"
    },
    text: {
        textAlign: "center",
        fontFamily: 'medium',
        fontSize: 21 * scaleMultiplier
    }
  })

export default ModalButton