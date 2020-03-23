import React from 'react';
import { View, Modal } from 'react-native';

function WahaModal(props) {
    return (
        <Modal
            visible={props.isVisible}
            animationType="slide"
            presentationStyle="overFullScreen"
            transparent={true}
        >
            <View style={{flex: 1, flexDirection: "column", justifyContent: "flex-end"}}>
                <View style={{backgroundColor: "white", paddingBottom: 20, paddingTop: 5}}>
                    {props.children}
                </View>
            </View>
        </Modal>
    )
}

export default WahaModal