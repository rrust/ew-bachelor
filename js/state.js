// Centralized state management

// Constants
const BADGE_THRESHOLDS = {
  GOLD: 90,
  SILVER: 70,
  BRONZE: 50
};

const AppState = {
  // Study-Level State (NEW)
  currentStudyId: null,
  studies: [],
  // Existing State
  content: {},
  modules: [],
  currentModuleId: null,
  currentLectureId: null,
  currentLectureItems: [],
  currentItemIndex: 0,
  quizData: null,
  currentQuestionIndex: 0,
  userScore: 0
};

// State getters
const getState = () => AppState;
const getStudies = () => AppState.studies;
const getCurrentStudy = () => AppState.currentStudyId;
const getContent = () => AppState.content;
const getModules = () => AppState.modules;
const getCurrentModule = () => AppState.currentModuleId;
const getCurrentLecture = () => AppState.currentLectureId;
const getCurrentLectureItems = () => AppState.currentLectureItems;
const getCurrentItemIndex = () => AppState.currentItemIndex;
const getQuizData = () => AppState.quizData;
const getCurrentQuestionIndex = () => AppState.currentQuestionIndex;
const getUserScore = () => AppState.userScore;

// State setters
const setStudies = (studies) => (AppState.studies = studies);
const setCurrentStudy = (id) => (AppState.currentStudyId = id);
const setContent = (content) => (AppState.content = content);
const setModules = (modules) => (AppState.modules = modules);
const setCurrentModule = (id) => (AppState.currentModuleId = id);
const setCurrentLecture = (id) => (AppState.currentLectureId = id);
const setCurrentLectureItems = (items) =>
  (AppState.currentLectureItems = items);
const setCurrentItemIndex = (index) => (AppState.currentItemIndex = index);
const setQuizData = (data) => (AppState.quizData = data);
const setCurrentQuestionIndex = (index) =>
  (AppState.currentQuestionIndex = index);
const setUserScore = (score) => (AppState.userScore = score);
const incrementUserScore = (points) => (AppState.userScore += points);
const resetQuizState = () => {
  AppState.quizData = null;
  AppState.currentQuestionIndex = 0;
  AppState.userScore = 0;
};

// Expose to global scope
window.BADGE_THRESHOLDS = BADGE_THRESHOLDS;
window.AppState = AppState;
window.getState = getState;
window.getStudies = getStudies;
window.getCurrentStudy = getCurrentStudy;
window.getContent = getContent;
window.getModules = getModules;
window.getCurrentModule = getCurrentModule;
window.getCurrentLecture = getCurrentLecture;
window.getCurrentLectureItems = getCurrentLectureItems;
window.getCurrentItemIndex = getCurrentItemIndex;
window.getQuizData = getQuizData;
window.getCurrentQuestionIndex = getCurrentQuestionIndex;
window.getUserScore = getUserScore;
window.setStudies = setStudies;
window.setCurrentStudy = setCurrentStudy;
window.setContent = setContent;
window.setModules = setModules;
window.setCurrentModule = setCurrentModule;
window.setCurrentLecture = setCurrentLecture;
window.setCurrentLectureItems = setCurrentLectureItems;
window.setCurrentItemIndex = setCurrentItemIndex;
window.setQuizData = setQuizData;
window.setCurrentQuestionIndex = setCurrentQuestionIndex;
window.setUserScore = setUserScore;
window.incrementUserScore = incrementUserScore;
window.resetQuizState = resetQuizState;
