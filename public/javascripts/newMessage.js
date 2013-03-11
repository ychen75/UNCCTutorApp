function newMessageSetup(members, labels, values) {
  var source = [];
  for (var i = 0; i < labels.length; i++) {
    var user = { label: labels[i], value: values[i] };
    source.push(user);
  }
  
  $('form').submit(function() {
    var memberIDs = members[0];
    for (var i = 1; i < members.length; i++)
      memberIDs += ',' + members[i];
    $('#members').val(memberIDs);
  });
  
  $('#autocomplete').autocomplete({
    minLength: 2,
    source: function(req, res) {
      var matcher = new RegExp( "(\\b)" + $.ui.autocomplete.escapeRegex( req.term ), "i" );
      res( $.grep( source, function( item ){
        return matcher.test( item.label );
      }));
    },
    focus: function(event, ui) {
      return false;  
    },
    select: function(event, ui) {
      if (ui.item.value != members[0]) {
        if (members.indexOf(ui.item.value) == -1) {
          var memberList = $('#conversationMembers');
          members.push(ui.item.value);
          memberList.append("<li>" + ui.item.label + "<a id='member" + members.length + "' class='removeMember'></a></li>");
          memberList.children("li:last").children().click(function() {
            var index = $(this).attr('id').substring(6);
            members.splice(index, 1);
            $(this).parent().remove();
            memberList.children('li').children().attr("id", function(index) {
              return 'member' + index + 1; 
            });
          });
          $(this).val('');
        }
        else
          $('#warning').text('User already added.').show().fadeOut(3000);
      }
      else
        $('#warning').text('If you want to talk to yourself, just start a conversation with nobody selected.').show().fadeOut(5000);
      return false;
    }
  });
}