const express = require('express');
const StreamArray = require( 'stream-json/streamers/StreamArray');
const {Writable} = require('stream');
const fs = require('fs');


const app = express();
const PORT=process.env.PORT||3000;

app.set('view engine','ejs');

app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
})

app.get('/bmicalc',(req,res) => {
    const fileStream = fs.createReadStream('wt_ht_input.json');
    const jsonStream = StreamArray.withParser();
    const result = [];
    var index = 1;

    const processingStream = new Writable({
        write({value}, encoding, callback) {
            setTimeout(() => {
                var ht = value.HeightCm/100;
                var wt = value.WeightKg;
                var calculatedBMI = (wt)/(ht * ht);

                if (calculatedBMI <= 18.4) {
                    result.push({index:String(index),calculatedBMI:String(calculatedBMI),bmi_category:'Underweight',health_risk:'Malnutrition risk'});
                } else if(calculatedBMI >= 18.5 && calculatedBMI <= 24.9){
                    result.push({index:String(index),calculatedBMI:String(calculatedBMI),bmi_category:'Normal weight',health_risk:'Low risk'});
                } else if(calculatedBMI >= 25 && calculatedBMI <= 29.9){
                    result.push({index:String(index),calculatedBMI:String(calculatedBMI),bmi_category:'Overweight',health_risk:'Enhanced risk'});
                } else if(calculatedBMI >= 30 && calculatedBMI <= 34.9){
                    result.push({index:String(index),calculatedBMI:String(calculatedBMI),bmi_category:'UnderModerately obeseweight',health_risk:'Medium risk'});
                } else if(calculatedBMI >= 35 && calculatedBMI <= 39.9){
                    result.push({index:index,calculatedBMI:String(calculatedBMI),bmi_category:'Severely obese',health_risk:'High risk'});
                } else if(calculatedBMI >= 40){
                    result.push({index:String(index),calculatedBMI:String(calculatedBMI),bmi_category:'Very severely obese',health_risk:'Very high risk'});
                } 
                index = index + 1;
                callback();
            }, 10);
        },
        objectMode: true
    });
    fileStream.pipe(jsonStream.input);
    jsonStream.pipe(processingStream);
    processingStream.on('finish', () => {
        console.log("BMI Calculation Done");
        res.render('index',{result:result});
    });
    
})