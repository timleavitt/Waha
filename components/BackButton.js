import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { scaleMultiplier } from '../constants';
import { connect } from 'react-redux'

function BackButton(props) {

   //// RENDER

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

//// STYLES

const styles = StyleSheet.create({
   backButtonContainer: {
      flexDirection: "row",
      width: 100,
   }
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      isRTL: state.database[activeGroup.language].isRTL,
   }
};

export default connect(mapStateToProps)(BackButton);