import StudySet from '../models/studyset';
import Lesson from '../models/lesson';

export const STUDYSETS = [
    //Study set 1
    new StudySet('1', 'Study Set 1', [
        new Lesson(
            '1.1', 
            'Lesson 1.1', 
            'Study set 1 cool subtitle', 
            '1', 
            "https://dl.airtable.com/.attachments/153694f4bc874577dda5bb4ccfe70187/aeb2055d/Acolyte.mp3"
        ),
        new Lesson(
            '1.2', 
            'Lesson 1.2', 
            'Perfect subtitle', 
            '1',
            "https://dl.airtable.com/.attachments/a6d08d0ba2f0b82f5b9c7f82dfcd1a17/62b7244b/alt-J-WarmFoothillsOfficialAudio.mp3"
        ),
        new Lesson(
            '1.3', 
            'Lesson 1.3', 
            'Terrific subtitle', 
            '1',
            "https://dl.airtable.com/.attachments/ca56de05f0a380edee22cd0c53d972a9/379f130c/BonIver-715-CRKS-OfficialLyricVideo.mp3"
        ),
        new Lesson(
            '1.4', 
            'Lesson 1.4', 
            'Super okay subtitle', 
            '1',
            "https://dl.airtable.com/.attachments/37e6ad049d03ad99cf538a9b9ca24670/e73931a4/Ceilings.mp3"

        ),
        new Lesson(
            '1.5', 
            'Lesson 1.5', 
            'Meh subtitle', 
            '1',
            "https://dl.airtable.com/.attachments/b565ef12ea1e70fdcd7fc3b265d8afdb/4e70b94a/DoYouFeelLoved.mp3"
        )
    ]),

    //Study set 2
    new StudySet('2', 'Study Set 2', [
        new Lesson(
            '2.1', 
            'Lesson 2.1', 
            'Cool subtitle', 
            '2',
            
        ),
        new Lesson(
            '2.2', 
            'Lesson 2.2', 
            'Neat subtitle', 
            '2',
            "https://dl.airtable.com/.attachments/9cf175d38503cd3b39fb0650495d0343/762c9803/luna.m4a"
        ),
        new Lesson(
            '2.3', 
            'Lesson 2.3', 
            'Really cool subtitle', 
            '2',
            "https://dl.airtable.com/.attachments/9488247029b9c4f91dae71db195f1e4d/3f9c7337/Rivers-TheTallestManOnEarth.mp3"

        ),
        new Lesson(
            '2.4', 
            'Lesson 2.4', 
            'Super rad subtitle', 
            '2',
            "https://dl.airtable.com/.attachments/ed6475461a94411ec1404a134b5c210a/fa5055f9/RogueWave-LetmyLoveOpentheDoorPeteTownsend.mp3"
        ),
        new Lesson(
            '2.5', 
            'Lesson 2.5', 
            'Excellent subtitle', 
            '2',
            "https://dl.airtable.com/.attachments/32929bc6c1309dae0ee14fd4e3fa987e/7d05391b/ThePaperKites-NothingMoreThanThat.mp3"

        )
    ])
];