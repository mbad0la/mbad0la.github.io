$(function(){
    var caretposition = 0;
    var carettop = 0;
    var total = 0;
    var prevdir = "~";
    var cdir = "~";
    var commands = {};
    var w = $('#getsize')[0].getBoundingClientRect().width;
    var h = $('#getsize')[0].getBoundingClientRect().height;
    var pw = $('#prompt'+carettop)[0].getBoundingClientRect().width;

    $('#caret').css({'width':w,'height':h,'left':pw+w+5});
    $('.active').css('left',w);

    $.ajax({
        url:'./term_data/help.json',
        type:'get',
        dataType:'json',
        success:function(r){
            commands["help"] = r;
        },
        error:function(r){
            console.log("Couldn't retrieve the commands list. Please reload the page.");
        }
    });
    
    $.ajax({
        url:'./term_data/fs.json',
        type:'get',
        dataType:'json',
        success:function(r){
            commands["cd"] = r;
            commands["ls"] = [];
        },
        error:function(r){
            console.log("Couldn't retrieve the filesystem. Please reload the page.");
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
            $('.prompt').removeClass('prompt');
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
        /*if(e.which===191)
        {
            e.stopPropagation();
        }*/
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
                    e.preventDefault();
                    $('.active').append(String.fromCharCode(e.which));
                }
            }
            else
            {
                e.preventDefault();
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
                if(splitCommands[0]!="ls")
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
                    var inline = 0;
                    commandResponse = commands["cd"][cdir];
                    for(var i=0;i<commandResponse.length;i++)
                    {
                        ++carettop;
                        inline = 0;
                        var line = "";
                        while(inline<8&&i<commandResponse.length)
                        {
                            var splitentity = commandResponse[i].split("_");
                            if(splitentity[1]=="d")
                                line+='<span class="dir">'+splitentity[0]+'</span>  ';
                            else
                                line+='<span>'+splitentity[0]+'</span>  ';
                            ++i;
                            ++inline;
                        }
                        ++carettop;
                        $('body').append('<br><span>'+line+'</span>');
                    }
                    $('body').append('<br><span></span>');
                }
                
                if(splitCommands[0]=="cd")
                {
                    cdir = "~";
                }
            }
            else
            {
                if(splitCommands[0]=="help")
                {
                    if(commands["help"][splitCommands[1]])
                        commandResponse = commands["help"][splitCommands[1]];
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
                else if(splitCommands[0]=="cd")
                {
                    if(splitCommands[1][0]!='/'&&splitCommands[1]!=".."&&splitCommands[1]!="."&&splitCommands[1][0]!="~"&&splitCommands[1]!="-")
                    {
                        splitCommands[1]=cdir+'/'+splitCommands[1];
                    }
                    if(commands["cd"][splitCommands[1]])
                    {
                        ++carettop;
                        if(splitCommands[1]==".")
                        ;
                        else if(splitCommands[1]=="..")
                        {
                            var dirsplit = cdir.split('/');
                            var newcdir = "";
                            for(var j=0;j<dirsplit.length-1;j++)
                                newcdir+=dirsplit[j]+"/";
                            if(newcdir!="")
                            {
                                newcdir = newcdir.substring(0,newcdir.length-1);
                                prevdir = cdir;
                                cdir = newcdir;
                            }
                        }
                        else
                        {
                            if(splitCommands[1]=="-")
                            {
                                var tempdir = cdir;
                                cdir = prevdir;
                                prevdir = tempdir;
                            }
                            else
                            {
                                prevdir = cdir;
                                cdir = splitCommands[1];
                            }
                        }
                        
                        $('body').append('<br><span></span>');
                    }
                    else
                    {
                        var rsstr = "bash: cd: "+splitCommands[1]+": No such directory";
                        commandResponse = [rsstr,""];
                        for(var i=0;i<commandResponse.length;i++)
                        {
                            ++carettop;
                            $('body').append('<br><span>'+commandResponse[i]+'</span>');
                        }
                    }
                    
                }
                else if(splitCommands[0]=="ls")
                {
                    var inline = 0;
                    commandResponse = commands["cd"][splitCommands[1]];
                    for(var i=0;i<commandResponse.length;i++)
                    {
                        ++carettop;
                        inline = 0;
                        var line = "";
                        while(inline<8&&i<commandResponse.length)
                        {
                            var splitentity = commandResponse[i].split("_");
                            if(splitentity[1]=="d")
                                line+='<span class="dir">'+splitentity[0]+'</span>  ';
                            else
                                line+='<span>'+splitentity[0]+'</span>  ';
                            ++i;
                            ++inline;
                        }
                        ++carettop;
                        $('body').append('<br><span>'+line+'</span>');
                    }
                    $('body').append('<br><span></span>');
                }
            }
            $('body').append('<span id="prompt'+carettop+'">mbad0la@github:'+cdir+'$</span><span class="display active"></span>');
            pw = $('#prompt'+carettop)[0].getBoundingClientRect().width;
            $('#caret').css({'left':w*(caretposition+1)+pw+5,'top':carettop*h+5,'display':'block'});
            $('.active').css('left',w);
        }
        else
        {
            if(splitCommands[0]=="")
                ++carettop;
            else
            {
                carettop+=2;
                $('body').append("<br><span>"+splitCommands[0]+": command not found. Type `help' to see a list of available commands</span>");
            }
            $('body').append('<br><span id="prompt'+carettop+'">mbad0la@github:'+cdir+'$</span><span class="display active"></span>');
            pw = $('#prompt'+carettop)[0].getBoundingClientRect().width;
            $('#caret').css({'left':w*(caretposition+1)+pw+5,'top':carettop*h+5,'display':'block'});
            $('.active').css('left',w);
        }
    }
});

