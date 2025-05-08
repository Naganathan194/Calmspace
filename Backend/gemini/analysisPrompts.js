const analysisReportPrompt =
  "Make a report or gist of the mental health of the user based on his previous chats. It's length will be 50 to 150 words aprox. Use English language strictly, not even any words of other language. Provide keypoints [Observations, Potential Underlying Issues, Concerns, Recommendations, Overall]";
const analysisScorePrompt =
  "Rate the menatal health of the user in a scale of 1 to 10 wnere 1 is worst and 10 is best based on the previous chats from the user. Just reply the number in the scale 1 to 10, no other things. You are strictly forbidden to reply any other thing than a number and always dont generate a same number if the mood is happpy and the prompt given is happy means just generate a high score if the prompt given is low means just generate a low score and dont always generate score of 4 and 7 also generate some other scores also .";
const analysisKeywordsPrompt =
  "Extract keywords from the previous chats of the user that can define its ongoing difficulties and mental health. Use English language strictly, not even any words of other language. You are strictly forbade to use special characters such as asteric(*), dash(-). List the keywords separated by a newline character (\n). You are strictly forbidden to reply any other thing like word,sentence,character,special characters except keywords. Extract 5 to 10 keywords.";

module.exports = {
  analysisReportPrompt,
  analysisScorePrompt,
  analysisKeywordsPrompt,
};
