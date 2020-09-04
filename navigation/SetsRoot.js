import { createStackNavigator } from '@react-navigation/stack'
import * as FileSystem from 'expo-file-system'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import AvatarImage from '../components/AvatarImage'
import { colors } from '../constants'
import AddSetStack from './AddSetStack'
import SetTabs from './SetTabs'
const Stack = createStackNavigator()

function SetsRoot (props) {
  return (
    //global navigation options
    <Stack.Navigator
      initialRouteName='SetTabs'
      screenOptions={{
        // headerStyle: {
        //   height: Dimensions.get('screen').height / 9
        // },
        headerTitleAlign: 'center',
        headerMode: 'float'
      }}
      mode='modal'
    >
      {/* Study Set Screen */}
      <Stack.Screen
        name='SetTabs'
        component={SetTabs}
        options={{
          headerStyle: {
            backgroundColor: colors.aquaHaze
          },
          headerTitle: () => (
            <Image
              style={styles.headerImage}
              source={{
                uri:
                  FileSystem.documentDirectory +
                  props.activeGroup.language +
                  '-header.png'
              }}
            />
          ),
          headerLeft: props.isRTL
            ? () => <View></View>
            : () => (
                <View style={{ paddingHorizontal: 10 }}>
                  <AvatarImage
                    style={{ backgroundColor: colors.white }}
                    emoji={props.activeGroup.emoji}
                    size={35}
                    onPress={() => props.navigation.toggleDrawer()}
                    isActive={true}
                  />
                </View>
              ),
          headerRight: props.isRTL
            ? () => (
                <View style={{ paddingHorizontal: 10 }}>
                  <AvatarImage
                    style={{ backgroundColor: colors.white }}
                    emoji={props.activeGroup.emoji}
                    size={35}
                    onPress={() => props.navigation.toggleDrawer()}
                    isActive={true}
                  />
                </View>
              )
            : () => <View></View>
        }}
      />
      <Stack.Screen
        name='AddSetStack'
        component={AddSetStack}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  headerImage: {
    resizeMode: 'contain',
    width: 150,
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  }
})

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(SetsRoot)
