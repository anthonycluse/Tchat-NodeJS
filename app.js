/**
 * Created with JetBrains PhpStorm.
 * User: anthonycluse
 * Date: 12/11/12
 * Time: 9:38 PM
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var md5 = require('MD5');

httpServer = http.createServer( function(req, res){
    console.log('Un utilisateur à afficher la page !');
});

httpServer.listen(process.env.PORT || 1337);

var io = require('socket.io').listen(httpServer);
var users = {};
var messages = [];
var history = 2;

io.sockets.on('connection', function(socket){
    console.log('Nouvel utilisateur !');
    var me = false;

    for( var k in users ){
        socket.emit('newuser', users[k]);
    }

    for( var k in messages ){
        socket.emit('newmsg', messages[k]);
    }

    socket.on('login', function(user){
        me = user;
        me.id = user.email.replace('@', '-').replace('.', '-');
        me.avatar = 'https://gravatar.com/avatar/'+md5(user.email)+'?s=50';
        socket.emit('logged');
        users[me.id] = me;
        io.sockets.emit('newuser', me);
    });

    socket.on('disconnect', function(){
        if( !me ){
            return false;
        }
        delete users[me.id];
        io.sockets.emit('disuser', me);
    });

    socket.on('newmsg', function(message){
        message.user = me;
        date = new Date();
        message.h = date.getHours();
        message.m = date.getMinutes();
        messages.push(message);
        if( messages.length > history ){
            messages.shift();
        }
        io.sockets.emit('newmsg', message);
    });

});