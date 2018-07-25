
let axios = require('axios')
let io = require('socket.io-client')

register();

let user1 = 28363761;

function register () {
    axios.get('http://localhost:3000/auth/register')
        .then(res => {
            let user = {
                token: res.data.token,
                _id: res.data.user._id,
                skyNumber: res.data.user.skyNumber
            }
            let options = {
                transports: ['websocket'],
                'force new connection': true,
                query: {token: user.token}
            }
            let client = io('http://localhost:3000', options)
            client.on('connect', () => {
                client.on('return-message', data => {
                    console.log(data);
                    
                })
                client.on('create-conversation', data => {
                    let message = {
                        conversationId: data.conversationId,
                        body: 'test send message user3 and user1',
                        recipient: {skyNumber: user1}
                    }
                    setInterval(() => {
                        client.emit('send-message', message)
                    }, 5000)
                })
                let create = {
                    recipient: {skyNumber: user1},
                    body: 'create conversation between 3 and 1'
                }
                client.emit('create-conversation', create);
            })
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports = register;
