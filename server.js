const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const userList = [
    {
        id: "ECHO_BOT",
        name: "Echo Bot",
        description: "Fusce dapibus, tellus ac cursus commodo, tort",
        logo: "http://gubkabob.xaaa.ru/img/squidward-g.jpg"
    },
    {
        id: "REVERSE_BOT",
        name: "Reverse Bot",
        description: "Fusce dapibus, tellus ac cursus commodo, tort",
        logo: "http://img0.liveinternet.ru/images/attach/c/4/80/12/80012570_tumblr_l6nen9vfsr1qaqps8o1_500.jpg"
    },
    {
        id: "SPAM_BOT",
        name: "Spam Bot",
        description: "Fusce dapibus, tellus ac cursus commodo, tort",
        logo: "http://www.gamer.ru/system/attached_images/images/000/506/239/original/crabs-g.jpg"
    },
    {
        id: "IGNORE_BOT",
        name: "Ignore Bot",
        description: "Fusce dapibus, tellus ac cursus commodo, tort",
        logo: "http://images.trikky.ru/1/2013/03/sandy-g.jpg"
    }
];

// TODO: check user creation, clean server.js

io.on('connect', (socket) => {
    const user = {
        id: socket.id,
        name: `Anonymous ${socket.id[0]}`,
        logo: 'https://dic.academic.ru/pictures/wiki/files/83/Sheldon_plankton.jpg',
        description: ""
    }

    userList.push(user);
    socket.emit('updateUserInfo', user);
    io.emit("updateUserList", userList);

    socket.on('message', (message) => {
        socket.emit('message', message);
        if (message.to.id === "ECHO_BOT") {
            const { to, from } = message;
            message.from = to;
            message.to = from;
            socket.emit('message', message);
        } else if (message.to.id === "REVERSE_BOT") {
            const { to, from } = message;
            message.from = to;
            message.to = from;
            message.content = message.content.split('').reverse().join('');
            setTimeout(() => socket.emit('message', message), 3000);
        } else if (message.to.id === "IGNORE_BOT") {
            return;
        } else {
            io.to(message.to.id).emit('message', message);
        }
    });

    socket.on('disconnect', () => {
        const user = userList.find(user => user.id === socket.id);
        const index = userList.indexOf(user);
        userList.splice(index, 1);
        io.emit("updateUserList", userList);
        clearTimeout(runChatBot);
    });

    const runChatBot = setInterval(() => {
        socket.emit('message', {
            to: user,
            content: "Hello, I'm spam bot",
            from: userList[2]
        });
    }, 15000);
});

server.listen({ port: 3000 }, () =>
    console.log(`🚀 Server ready at http://localhost:3000`),
);
