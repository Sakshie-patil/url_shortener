const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortURL');
const app = express();

//connecting backend with database
mongoose.connect('mongodb://localhost/urlShortener' , {
    useNewUrlParser : true ,
    useUnifiedTopology: true
})

// to see the html return in index.ejs we are setting view engine
app.set('view engine' , 'ejs')

app.use(express.urlencoded({ extended : false}))


//rendering index file
app.get('/' , async (req,res) => {
     const shortUrls = await shortUrl.find()
    res.render('index' , {shortUrls : shortUrls})
})

// posting on frontend => we are accesing req.body.fullUrl that we have defined the name field inside input field in the html form    
app.post('/shortUrls' , async (req,res) => {
    // we want to wait this to finish creating till we move on(wait till urs are shorten)
    await shortUrl.create({full : req.body.fullUrl})

    // redirect user to home page back
    res.redirect('/')
})

// making route for redirecting to the short url
app.get('/:shorturl' , async (req , res) => {
    const shortUrlEntry = await shortUrl.findOne({ short : req.params.shorturl});

    if(!shortUrlEntry) return res.sendStatus(404);

    shortUrlEntry.clicks++;
    await shortUrlEntry.save()

    // redirect to original new URL
    res.redirect(shortUrlEntry.full)
});


app.listen(process.env.PORT || 8000);