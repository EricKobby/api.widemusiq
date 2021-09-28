const router = require('express').Router();
const sqlClient = require('../SqlClient');

router.get('/', (req, res) => {
    sqlClient.query('SELECT * FROM tracks', (err, rows) => {
        if (err) res.status(500)
            .json(ErrorMessage(err));
        res.status(200).json({
            error: false,
            tracks: rows
        });
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    sqlClient.query('SELECT * FROM tracks WHERE Id = ?', [id], (err, result) => {
        if (err) res.status(500).json(ErrorMessage(err));
        res.status(200).json({
            error: false,
            track: result
        });
    })
});

router.post('/add', async (req, res) => {
    if (!req.files) {
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    }
    else {

        let { songfile, thumbnail } = req.files;
        let { songname,artistname } = req.body;
        songfile.mv('../widemusiq/public/songs/' + songfile.name);
        thumbnail.mv('../widemusiq/public/thumbnails/' + thumbnail.name);
        //saving details to database
        const data =[
            songname,
            thumbnail.name,
            songfile.name,
            artistname
        ];
        sqlClient.query('INSERT INTO tracks (`song_name`,`thumbnail`,`file_name`,`artist_name`) VALUES (?,?,?,?)',data,(err,result)=>{
            if(err) res.status(500).json(ErrorMessage(err));
            res.send({
                status: true,
                message: 'File is uploaded',
                request: req.body,
                data: [
                    {
                        name: songfile.name,
                        mimetype: songfile.mimetype,
                        size: songfile.size
                    },
                    {
                        name: thumbnail.name,
                        mimetype: thumbnail.mimetype,
                        size: thumbnail.size
                    }
                ]
            });
        });
    }
});

const ErrorMessage = err => ({
    error: true,
    message: err.message
});
module.exports = router;
