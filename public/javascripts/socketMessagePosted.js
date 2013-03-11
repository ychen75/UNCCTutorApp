function setupSocket(msgID, userID) {
  console.log('Running startup');
  var socket = io.connect('http://localhost');  
  var room = 'msg-' + msgID;
  socket.on('connect', function() {
    socket.emit('join', room);
    console.log('Attempting to join ' + room);
  });
  
  socket.on('joined', function(data) {
    console.log('Joined ' + data);
  });
  
  socket.on('message', function(data) {
    var newDiv = "<div class='post hidden'>";
    newDiv += "<ul class='msgInfo'>";
    newDiv += "<li class='poster'><a href='/" + data.posterUsername +"'>" + data.poster + "</a></li>";
    newDiv += "<li class='postTime'>" + data.postTime + "</li>";
    newDiv += "<li class='postText'>" + data.postText + "</li>";
    newDiv += "</ul></div>";
    $('#messageWrapper').append(newDiv);
    $('#messageWrapper').children('div:last').slideDown();
  });
      
  $('#sendBtn').click(function() {
    var data = {
      room: room,
      messageID: msgID,
      userID: userID,
      postText: $('#postText').val()
    };
    socket.emit('newMsg', data);
    $('#postText').val('');
  });
  
  $('#postText').keypress(function(e) {
    if(e.which==13) 
      $('#sendBtn').click();
  });
}