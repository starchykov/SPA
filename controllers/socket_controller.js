const path = require('path');

class  SocketController {
    async connect(request, response) {
        console.log(path.resolve('./static/index.html'))
        response.sendFile(path.resolve('./static/index.html'));
    }
}

module.exports = new SocketController();