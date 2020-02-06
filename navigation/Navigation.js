//basic imports
import react from 'react';

//navigation imports
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

//screen imports
import StudySetScreen from '../screens/StudySetScreen';
import LessonListScreen from '../screens/LessonListScreen';
import PlayScreen from '../screens/PlayScreen'


const DefaultWahaNavigatorOptions = {
    headerStyle: {
        backgroundColor: "white"
    }
}

const WahaNavigator = createStackNavigator(
    {
        StudySet: {
            screen: StudySetScreen
        },
        LessonList: {
            screen: LessonListScreen
        },
        Play: {
            screen: PlayScreen
        }
    },
    {
        defaultNavigationOptions: DefaultWahaNavigatorOptions
    }
)

export default createAppContainer(WahaNavigator);