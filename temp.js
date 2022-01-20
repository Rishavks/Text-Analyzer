let str = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."


// for one word

var wordCounts = { };
var words = str.split(" ");

for(var i = 0; i < words.length; i++){
    wordCounts[words[i].toLowerCase()] = (wordCounts[words[i].toLowerCase()] || 0) + 1;
}

console.log("ONE WORD OBJECT\n")
//console.log(wordCounts);

var sortWords = [];
for (var vehicle in wordCounts) {
    sortWords.push([vehicle, wordCounts[vehicle]]);
}

sortWords.sort(function(a, b) {
    return b[1] - a[1];
});

//console.log(sortWords);

console.log("Top 5 Words : ", sortWords[0][0], sortWords[1][0], sortWords[2][0], sortWords[3][0], sortWords[4][0]);

// for (word in wordCounts){
//     console.log("Word: " + word + ", Count: " + wordCounts[word]);
// }

// for two words

let arr = str.split(" ");
let list = Object.entries(arr.reduce((acc, a, index) => {
  if (index != 0) acc.push(arr[index - 1] + " " + arr[index])
  return acc;
}, []).reduce((acc, a) => {
  if (Object.keys(acc).indexOf(a) !== -1) acc[a]++;
  else acc[a] = 1;
  return acc;
}, {})).map(el => ({
  phrase: el[0],
  count: el[1]
}));

console.log("\nTWO WORD ARRAY OF OBJECT\n")
//console.log(list)

var sortWords = list.sort((a, b) => b.count-a.count);
console.log(sortWords);

console.log("Top 5 Co-Occurring Words : ", sortWords[0].phrase, sortWords[1].phrase, sortWords[2].phrase, sortWords[3].phrase, sortWords[4].phrase);

// for (var i=0; i< list.length; i++){
//     console.log("Word: " + list[i].phrase + ", Count: " + list[i].count);
// }


