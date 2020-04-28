import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Image, FlatList, Dimensions } from 'react-native';
import i18n from 'i18n-js';
import { setFirstOpen, setIsReadyToStart, addLanguage, changeLanguage } from '../redux/actions/databaseActions'
import { connect } from 'react-redux'
import { createGroup, changeActiveGroup } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'


function OnboardingSlidesScreen(props) {

   //// STATE

   // keeps track of current onboarding page number
   const [pageNumber, setPageNumber] = useState(0)

   // reference to change flatlist
   const [flatListRef, setFlatListRef] = useState()

   // translations
   i18n.translations = {
      en: {
         title0: 'Welcome!',
         body0: 'Here is how to use this app.',
         title1: 'Discover God’s truth the Holy Bible.',
         body1: 'Each story brings insight for your group to discover the love and purpose of God.',
         title2: 'Gather a small group.',
         body2: 'Lessons are audio based, so gather a small group of friends or family to listen to bible stories and to discuss them.',
         title3: 'Lets get everything set up!',
         body3: 'We’ve started downloading some necessary files for you. This process usually takes between 1 to 3 minutes.',
         prev: 'Previous',
         next: 'Next',
         finish: 'Finish',
      },
      te: {
         title0: 'sed!',
         body0: 'ultricies lacus sed turpis tincidunt.',
         title1: 'pulvinar neque laoreet suspendisse interdum.',
         body1: 'duis convallis convallis tellus id interdum velit laoreet id donec.',
         title2: 'turpis tincidunt id aliquet.',
         body2: 'in egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu.',
         title3: 'ac turpis egestas maecenas!',
         body3: 'varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor.',
         prev: 'nulla',
         next: 'interdum',
         finish: 'nunc',
      },
   };

   // stuff for flatlist
   const onViewRef = React.useRef(({ viewableItems }) => {
      if (viewableItems) {
         setPageNumber(viewableItems[0].index)
      }
   })
   const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

   //// CONSTRUCTOR

   useEffect(() => {
      props.setFirstOpen(false)
      var language = props.route.params.selectedLanguage
      props.addLanguage(language)
   }, [])

   //// FUNCTIONS

   // updates scroll when page number updates
   useEffect(() => {
      if (flatListRef) {
         flatListRef.scrollToIndex({ index: pageNumber })
      }
   }, [pageNumber])

   // decrements / increments page number
   function incrementPageNumber(direction) {
      if (direction === "next") {
         setPageNumber(oldPageNumber => oldPageNumber += 1)
      } else {
         setPageNumber(oldPageNumber => oldPageNumber -= 1)
      }
   }

   // tells redux that we're ready to go to loading screen once onboarding is finished
   function finishOnboarding() {
      props.setIsReadyToStart(true)
      props.navigation.navigate('Loading')
   }

   //// RENDER

   const onboardingData = [
      {
         key: '0',
         imageSource: require('../assets/onboarding/onboarding1.png'),
         title: i18n.t('title0'),
         body: i18n.t('body0'),
      },
      {
         key: '1',
         imageSource: require('../assets/onboarding/onboarding2.png'),
         title: i18n.t('title1'),
         body: i18n.t('body1'),
      },
      {
         key: '2',
         imageSource: require('../assets/onboarding/onboarding3.png'),
         title: i18n.t('title2'),
         body: i18n.t('body2'),
      },
      {
         key: '3',
         imageSource: require('../assets/onboarding/onboarding4.png'),
         title: i18n.t('title3'),
         body: i18n.t('body3'),
      }
   ]

   function renderOnboardingSlide(slideList) {
      return (
         <View style={styles.pageContainer}>
            <View style={styles.titleContainer}>
               <Text style={styles.title}>{slideList.item.title}</Text>
            </View>
            <View style={styles.bodyContainer}>
               <Text style={styles.body}>{slideList.item.body}</Text>
            </View>
            <View style={styles.imageContainer}>
               <Image source={slideList.item.imageSource} style={styles.image} />
            </View>
         </View>
      )
   }

   return (
      <View style={styles.screen}>
         <View style={styles.onboardingSequence}>
            <FlatList
               renderItem={renderOnboardingSlide}
               data={onboardingData}
               ref={(ref) => {setFlatListRef(ref)}}
               horizontal={true}
               pagingEnabled={true}
               snapToAlignment={"start"}
               snapToInterval={Dimensions.get('window').width}
               decelerationRate={"fast"}
               onViewableItemsChanged={onViewRef.current}
               viewabilityConfig={viewConfigRef.current}
               showsHorizontalScrollIndicator={false}
            />
            <View style={styles.buttonsContainer}>
               <View>
                  {pageNumber > 0 ? <Button title={i18n.t('prev')} onPress={() => incrementPageNumber("prev")} /> : null}
               </View>
               <View>
                  <Button title={pageNumber !== 3 ? i18n.t('next') : i18n.t('finish')} onPress={pageNumber !== 3 ? () => incrementPageNumber("next") : finishOnboarding} />
               </View>
            </View>
         </View>
      </View>
   )
}

//// STYLES

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#F7F7F7",
      flexDirection: "column",
      justifyContent: "space-between",
   },
   onboardingSequence: {
      flex: 1,
      padding: 10,
      marginHorizontal: 20,
      marginVertical: 50,
      backgroundColor: "#FFFFFF",
      borderRadius: 15,
      borderColor: "#1D1E20",
      borderWidth: 2,
      flexDirection: "column",
      justifyContent: "space-between",
   },
   pageContainer: {
      flexDirection: "column",
      justifyContent: "center",
      width: Dimensions.get("window").width - 64
   },
   imageContainer: {
      justifyContent: "center",
      alignItems: "center",
   },
   image: {
      resizeMode: "center",
      width: 321 * scaleMultiplier,
      height: 272 * scaleMultiplier, 
   },
   titleContainer: {
      width: "100%",
      padding: 20,
   },
   title: {
      textAlign: "center",
      fontSize: 24 * scaleMultiplier,
      flexWrap: "wrap",
      fontFamily: "medium"
   },
   bodyContainer: {
      width: "100%",
      padding: 20,
   },
   body: {
      textAlign: "center",
      fontSize: 18 * scaleMultiplier,
      flexWrap: "wrap",
      fontFamily: "light"
   },
   buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      padding: 20,
   }
})

////REDUX

function mapStateToProps(state) {
   return {
      isFetching: state.database.isFetching
   }
};

function mapDispatchToProps(dispatch) {
   return {
      setFirstOpen: toSet => dispatch(setFirstOpen(toSet)),
      addLanguage: language => dispatch(addLanguage(language)),
      changeLanguage: language => dispatch(changeLanguage(language)),
      setIsReadyToStart: toSet => dispatch(setIsReadyToStart(toSet)),
      createGroup: (groupName, language, imageSource) => dispatch(createGroup(groupName, language, imageSource)),
      changeActiveGroup: name => { dispatch(changeActiveGroup(name)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingSlidesScreen);