let io = require('socket.io-client')

let token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjU4NDNkMWFjY2VjZDAwNDhjODhjOWIiLCJuYW1lIjp7fSwibmFtZUthdGEiOnt9LCJza3lOdW1iZXIiOjI4OTM0ODA3LCJpYXQiOjE1MzI1MTExODUsImV4cCI6NjcyMDAwMDAwMDAxNTMyNDAwMDAwfQ.fyIUysPAgayfIVO9oBMAyy9IgakEMM3O7SF3qim1tXY'

let options = {
    transports: ['websocket'],
    'force new connection': true,
    query: {token: token2}
}

listen()

function listen () {
    let client = io('http://localhost:3000', options)
    client.on('connect', () => {
        console.log(111)
        client.on('return-message', (data) => {
            console.log(222)
            console.log(data);
            let seen = {
                conversationId: data.conversationId,
                time: data.sentAt,
                participantsSkyNumber: data.authorSkyNumber
            }
            client.emit('confirm-seen', seen)
        })
    })
}
