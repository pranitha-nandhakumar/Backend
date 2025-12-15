const express = require('express');
const app = express();
const port = 8001;
app.get('/', (req, res) => {
    res.send(' Backend server started successfully');
});
app.get('/json', (req, res) => {
    res.json({ "College":"Sece","Dept":"CYS" });
});
app.get('/static', (req, res) => {
    res.sendFile('C:\\Users\\pranitha\\OneDrive\\Desktop\\SECE_MERN_dec\\seceBackend2025Dec\\index.html' );
}
);


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});