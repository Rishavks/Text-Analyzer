const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const File = require('./models/file');

//console.log(mongoose.model('FileModel'));

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://RishavKS:rishu106@cluster0.fdmnt.gcp.mongodb.net/text-analyzer?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then( () => console.log("Connection Successful!"))
.catch((err) => console.log(err));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render('index', { success:'' });
});

app.post("/uploadFile", upload.single("myFile"), (req, res, next) => { // File Upload 
    const file = req.file; // We get the file in req.file
    const name = req.file.originalname;

    if (!file) { // in case we do not get a file we return
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }
    const multerText = Buffer.from(file.buffer).toString("utf-8"); // this reads and converts the contents of the text file into string

    const result = { // Object which will hold the content of the file
        fileText: multerText,
    };

    let str = result.fileText;

    // for single word occurence

    var wordCounts = { };
    var words = str.split(" ");

    for(var i = 0; i < words.length; i++){
        wordCounts[words[i].toLowerCase()] = (wordCounts[words[i].toLowerCase()] || 0) + 1;
    }

    
    //console.log(wordCounts);

    var sortWords = [];
    for (var vehicle in wordCounts) {
        sortWords.push([vehicle, wordCounts[vehicle]]);
    }

    sortWords.sort(function(a, b) {
        return b[1] - a[1];
    });

    //console.log(sortWords);

    //console.log("\nTop 5 Words : ", sortWords[0][0], sortWords[1][0], sortWords[2][0], sortWords[3][0], sortWords[4][0]);

    let oneWords = []
    oneWords[0] = sortWords[0][0];
    oneWords[1] = sortWords[1][0];
    oneWords[2] = sortWords[2][0];
    oneWords[3] = sortWords[3][0];
    oneWords[4] = sortWords[4][0];

    // for two adjacent words

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

    
    //console.log(list)

    var sortWords = list.sort((a, b) => b.count-a.count);
    //console.log(sortWords);

    //console.log("\nTop 5 Co-Occurring Words : ", sortWords[0].phrase, sortWords[1].phrase, sortWords[2].phrase, sortWords[3].phrase, sortWords[4].phrase);

    let twoWords = []
    twoWords[0] = sortWords[0].phrase;
    twoWords[1] = sortWords[1].phrase;
    twoWords[2] = sortWords[2].phrase;
    twoWords[3] = sortWords[3].phrase;
    twoWords[4] = sortWords[4].phrase;

    
    // console.log(oneWords);
    
    // console.log(twoWords);

    const createFile = async () => {
        try{
            const newFile = new File ({
                fileName: name,
                oneWords: oneWords,
                twoWords: twoWords
            });
        
            const result = await newFile.save();
            console.log(result);

        }catch(err){
            console.log(err);
        }
        
    }
    
    createFile();

    res.render('index', { success: 'Record Inserted Succesfully!'}); //display success msg
});

app.get("/cards", (req, res) => {

    File.find({}, function (err, result) {
        if(err) {
            console.log(err);
        } else {
            res.render("cards", {cardArr: result});
        }
    });
           
});

app.post("/cardfilter", (req, res) => {

    var filter = String(req.body.filter);
    File.find({fileName : filter}, function (err, result) {
        if(err) {
            console.log(err);
        } else {
            res.render("cards", {cardArr: result});
        }
    });

});

app.listen(port, () => console.log(`App listening on port ${port}!`));