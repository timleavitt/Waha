//data for each individual lesson
class Lesson {
    constructor(id, title, subtitle, studySetID, source) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.studySetID = studySetID;
        this.source = source;
        //more props to come
            //isDownloaded?
            //isMarkedAsComplete?
    }
}

export default Lesson;