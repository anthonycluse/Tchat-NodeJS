/**
 * Created with JetBrains PhpStorm.
 * User: anthonycluse
 * Date: 12/11/12
 * Time: 9:39 PM
 * To change this template use File | Settings | File Templates.
 */
( function($){

    var socket = io.connect('http://localhost:1337');

    $('#formConnexion').submit( function(event){
        event.preventDefault();
        socket.emit('login', {
            username: $('input[name=username]').val(),
            email: $('input[name=email]').val()
        });
    });

    socket.on('logged', function(){
        $('#formConnexion').slideDown( function(){
            $('#lightFormConnexion').fadeOut();
        });
        $('input[name=message]').focus();
    });

    socket.on('newuser', function(user){
        $('#users').append('<img src="'+user.avatar+'" id="'+user.id+'"/>');
    });

    socket.on('disuser', function(user){
        $('#'+user.id).remove();
    });

    $('#formMessage').submit( function(event){
        event.preventDefault();
        socket.emit('newmsg', {
            message: $('input[name=message]').val()
        });
        $('input[name=message]').val('');
        $('input[name=message]').focus();
    });

    socket.on('newmsg', function(message){
        $('#messages').append('<div id="message"><i>'+message.h+':'+message.m+'</i><p>'+message.message+'</p></div>');
        /*$('#messages').animate({
            scrollTo: $('#messages').prop('scrollHeight')
        }, 50);*/
    });

})(jQuery);