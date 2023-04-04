import express from 'express';

const app = express();
app.get('/api', (req, res, next) => {
    console.log(req.query);
    res.send("Hello from server2")
});

const port = +(process.env.PORT || 8443);
app.listen(port, () => {
    console.log(`Express Server started on port ${port}`)
})