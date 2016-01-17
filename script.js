$(function(){
    var w = $('#getsize')[0].getBoundingClientRect().width;
    var h = $('#getsize')[0].getBoundingClientRect().height;
    var pw = $('#prompt')[0].getBoundingClientRect().width;

    $('#caret').css({'width':w,'height':h,'left':pw+w+5});
    $('.active').css('left',w);

    var caretposition = 0;
    var carettop = 0;
    var total = 0;
    var commands = {};
    
    $.ajax({
        url:'./commands.json',
        type:'get',
        dataType:'json',
        success:function(r){
            commands = r;
            console.log(r);
        },
        error:function(r){
            console.log("Couldn't retrieve the commands list. Please reload the page.");
        }
    });

    $(document).keydown(function(e){
        if(e.which===8)
        {
            e.preventDefault();
            var txt = $('.active').text();
            if(txt.length!=0)
            {
                if(caretposition>0)
                {
                    --caretposition;
                    --total;
                    var leftTxt = txt.substring(0,caretposition);
                    var rightTxt = txt.substring(caretposition+1,txt.length);
                    $('.active').text(leftTxt+rightTxt);
                }
            }
        }
        if(e.which===13)
        {
            e.preventDefault();
            var txt = $('.active').text();
            $('.active').removeClass('active');
            $('#caret').css('display','none');
            executeCommand(txt);
        }
        if(e.which===37)
        {
            e.preventDefault();
            var txt = $('.active').text();
            if(txt.length!=0)
            {
                if(caretposition)
                    --caretposition;
            }
        }
        if(e.which===39)
        {
            e.preventDefault();
            var txt = $('.active').text();
            if(txt.length!=0)
            {
                if(caretposition<total)
                    ++caretposition;
            }
        }
        $('#caret').css('left',w*(caretposition+1)+pw+5);
    });
    
    $(document).keypress(function(e){
        setTimeout(function(){
            ++caretposition;
            ++total;
            if(total==caretposition)
            {
                if (e.which!=37||e.which!=39)
                {
                    $('.active').append(String.fromCharCode(e.which));
                }
            }
            else
            {
                var to_split = $('.active').text();
                var left = to_split.substring(0,caretposition-1);
                left+=String.fromCharCode(e.which);
                var right = to_split.substring(caretposition-1,to_split.length);
                $('.active').text(left+right);
            }
            $('#caret').css('left',w*(caretposition+1)+pw+5);
        },30);
    });
    
    function executeCommand(str)
    {
        var splitCommands = str.split(" ");
        var commandResponse = [];
        caretposition = 0;
        total = 0;
        
        if(commands[splitCommands[0]])
        {
            if(splitCommands.length==1)
            {
                commandResponse = commands[splitCommands[0]]["info"];
                for(var i=0;i<commandResponse.length;i++)
                {
                    ++carettop;
                    $('body').append('<br><span>'+commandResponse[i]+'</span>');
                }
            }
            else
            {
                if(splitCommands[0]=="help")
                {
                    if(commands[splitCommands[1]])
                        commandResponse = commands[splitCommands[1]]["help"];
                    else
                    {
                        var rsstr = "bash: help: no help topics match `"+splitCommands[1]+"'.";
                        commandResponse = [rsstr,""];
                    }
                    
                    for(var i=0;i<commandResponse.length;i++)
                    {
                        ++carettop;
                        $('body').append('<br><span>'+commandResponse[i]+'</span>');
                    }
                }
            }
            $('body').append('<span id="prompt">mbad0la@github:~$</span><span class="display active"></span>');
            $('#caret').css({'left':w*(caretposition+1)+pw+5,'top':carettop*h+5,'display':'block'});
            $('.active').css('left',w);
        }
        else
        {
            carettop+=2;
            $('body').append("<br><span>"+splitCommands[0]+": command not found. Type `help' to see a list of available commands</span>");
            $('body').append('<br><span id="prompt">mbad0la@github:~$</span><span class="display active"></span>');
            $('#caret').css({'left':w*(caretposition+1)+pw+5,'top':carettop*h+5,'display':'block'});
            $('.active').css('left',w);
        }
    }
});

