$(function(){
    var w = $('#getsize')[0].getBoundingClientRect().width;
    var h = $('#getsize')[0].getBoundingClientRect().height;
    var pw = $('#prompt')[0].getBoundingClientRect().width;

    $('#caret').css({'width':w,'height':h,'left':pw+w+5});
    $('.active').css('left',w);

    var caretposition = 0;
    var carettop = 0;
    var total = 0;

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
        var commandResponse;
        caretposition = 0;
        total = 0;
        if(splitCommands[0]==="help")
        {
            var myResponse = ["A Terminal based theme created by Mayank Badola.","These shell-like commands are user-defined.  Type `help' to see this list.","Type `help name' to find out more about the function `name'."," "];
            for(var i=0;i<myResponse.length;i++)
            {
                ++carettop;
                $('body').append('<br><span>'+myResponse[i]+'</span>');
            }
            $('body').append('<span id="prompt">mbad0la@github:~$</span><span class="display active"></span>');
            $('#caret').css({'left':w*(caretposition+1)+pw+5,'top':carettop*h+5,'display':'block'});
            $('.active').css('left',w);
        }
        else
        {
            carettop+=2;
            $('body').append('<br><span>'+splitCommands[0]+': command not found</span>');
            $('body').append('<br><span id="prompt">mbad0la@github:~$</span><span class="display active"></span>');
            $('#caret').css({'left':w*(caretposition+1)+pw+5,'top':carettop*h+5,'display':'block'});
            $('.active').css('left',w);
        }
    }
    
});

