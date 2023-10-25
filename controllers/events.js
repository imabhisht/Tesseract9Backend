import axios from 'axios';
import fs from 'fs';
import csvtojson from 'csvtojson';

let data=null;
export const saveEvents = async () => {
    try {
        console.log('Saving events...');
        const spreadsheetId = '1AJfUKMy8TEPKZbsvqUHjHreKWsqDaMymvu6Muyr7cMI';
    
        // Make a GET request to the Google Sheet URL
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv`;
        
        const response = await axios.get(sheetUrl);
        if(response.data===data){
            console.log('No new events');
            return;
        }
        else{
            data=response.data;
        }
        const csvString = response.data;
        const events = await csvtojson().fromString(csvString);
        fs.writeFileSync('../data/events.json', JSON.stringify(events, null, 2));
    } catch (error) {
        console.log(error);
    }

}

export const getEvents = async (req, res) => {
    try {
        const events = JSON.parse(fs.readFileSync('../data/events.json'));
        res.status(200).json(events);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
