
let axios = require('axios')
let io = require('socket.io-client')

let acc = [];
let number = 100;

register();

function register () {
    axios.get('http://localhost:3000/auth/register')
        .then(res => {
            let data = {
                token: res.data.token,
                _id: res.data.user._id,
                skyNumber: res.data.user.skyNumber
            }
            acc.push(data)
            if (acc.length < number) {
                register()
            }
            if (acc.length == number) {
                for(let i = 0; i < acc.length/2; i++){
                    // console.log(i)
                    let options = {
                        transports : ['websocket'],
                        'force new connection': true,
                        query: {token: acc[i].token}
                    }
                    // console.log(options);
                    
                    let client = io('http://localhost:3000', options)
                    
                    client.on('connect', () => {
                        client.on('create-conversation', data => {
                            let message = {
                                conversationId: data.conversationId,
                                body: 'test send message',
                                recipient: {skyNumber: acc[acc.length - 1 - i].skyNumber}
                            }
                            setInterval(() => {
                                client.emit('send-message', message)
                            }, 3000)
                        })
                        let data = {
                            recipient: {skyNumber: acc[acc.length - 1 - i].skyNumber},
                            body: 'test this'
                        }
                        client.emit('create-conversation', data)
                    })
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports = register;
