
let axios = require('axios')
let io = require('socket.io-client')

let acc = [];
let number = 2;

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
                console.log(acc);                
                for(let i = 0; i < acc.length/2; i++){
                    let options = {
                        transports : ['websocket'],
                        'force new connection': true,
                        query: {token: acc[i].token}
                    }
                    let client = io('http://localhost:3000', options)
                    
                    client.on('connect', () => {
                        client.on('create-conversation', data => {
			                console.log(data);
                            let message = {
                                conversationId: data.conversationId,
                                body: 'test send message user1 and user 2',
                                recipient: {skyNumber: acc[acc.length - 1 - i].skyNumber}
                            }
                            setInterval(() => {
                                client.emit('send-message', message)
                            }, 10000)
                        })
                        let data = {
                            recipient: {skyNumber: acc[acc.length - 1 - i].skyNumber},
                            body: 'test this'
                        }
                        setTimeout(() => {
                            client.emit('create-conversation', data)
                        }, 15000);
                    })
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports = register;
