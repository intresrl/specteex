import server from './controller/web-server-express.controller';

const port = process.env.PORT || 3000;

server.listen(port, (err: any) => {
    if (err) {
        return console.log(err);
    }

    return console.log(`server is listening on ${port}`);
});
