import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

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
      height: 60,
      justifyContent: "center"
    },
    text: {
        textAlign: "center",
        fontFamily: 'open-sans-regular',
        fontSize: 21
    }
  })

export default ModalButton