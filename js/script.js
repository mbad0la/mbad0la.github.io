$(function(){
    var stack = new Array();
    var stack_size = 0;
    var pointer = -1;
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

    $.ajax({
        url:'./term_data/cat.json',
        type:'get',
        dataType:'json',
        success:function(r){
            commands["cat"] = r;
            commands["clear"] = [];
        },
        error:function(r){
            console.log("Couldn't retrieve text files' data. Please reload the page.");
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
        if(e.which===9)
        {
            e.preventDefault();
            if(total==caretposition)
            {
                var currval = $('.active').text();
                var splitted = currval.split(' ');
                if(splitted.length==1)
                {
                    var matches = [];
                    var re = new RegExp("^"+splitted[0]);
                    for( var key in commands )
                    {
                        //console.log(key.match(re));
                        var regExResponse = re.exec(key);
                        if(regExResponse)
                        {
                            matches.push(regExResponse["input"]);
                        }
                    }
                    if(matches.length==1)
                    {
                        caretposition+=matches[0].length-currval.length+1;
                        total+=matches[0].length-currval.length+1;
                        $('.active').text(matches[0]+' ');
                    }
                    else if(matches.length>1)
                    {
                        var outputstr = '';
                        for(var itr=0;itr<matches.length;itr++)
                        {
                            outputstr+=matches[itr]+"    ";
                        }
                        $('.active').removeClass('active');
                        $('.prompt').removeClass('prompt');
                        $('#caret').css('display','none');
                        caretposition = currval.length;
                        total = currval.length;
                        carettop+=2;
                        $('body').append('<br><span>'+outputstr+'</span>');
                        $('body').append('<br><span id="prompt'+carettop+'">mbad0la@github:'+cdir+'$</span><span class="display active"></span>');
                        pw = $('#prompt'+carettop)[0].getBoundingClientRect().width;
                        $('#caret').css({'left':w*(caretposition+1)+pw+5,'top':carettop*h+5,'display':'block'});
                        $('.active').css('left',w);
                        $('.active').text(currval);
                    }
                }
                else if(splitted.length>1)
                {
                    if(splitted[0]=="cd"||splitted[0]=="ls")
                    {
                        var matches = [];
                        var re = new RegExp("^"+splitted[1]+"\..*_d$");
                        for( var index in commands["cd"][cdir] )
                        {
                            var regExResponse = re.exec(commands["cd"][cdir][index]);
                            if(regExResponse)
                            {
                                matches.push(regExResponse["input"]);
                            }
                        }
                        if(matches.length==1)
                        {
                            caretposition+=matches[0].length-2-splitted[1].length;
                            total+=matches[0].length-2-splitted[1].length;
                            $('.active').text(splitted[0]+' '+matches[0].substr(0,matches[0].length-2));
                        }
                        else if(matches.length>1)
                        {
                            var outputstr = '';
                            for(var itr=0;itr<matches.length;itr++)
                            {
                                outputstr+=matches[itr].substr(0,matches[itr].length-2)+"    ";
                            }
                            $('.active').removeClass('active');
                            $('.prompt').removeClass('prompt');
                            $('#caret').css('display','none');
                            caretposition = currval.length;
                            total = currval.length;
                            carettop+=2;
                            $('body').append('<br><span>'+outputstr+'</span>');
                            $('body').append('<br><span id="prompt'+carettop+'">mbad0la@github:'+cdir+'$</span><span class="display active"></span>');
                            pw = $('#prompt'+carettop)[0].getBoundingClientRect().width;
                            $('#caret').css({'left':w*(caretposition+1)+pw+5,'top':carettop*h+5,'display':'block'});
                            $('.active').css('left',w);
                            $('.active').text(currval);
                        }
                    }
                    else if(splitted[0]=="cat")
                    {
                        var matches = [];
                        var re = new RegExp("^"+splitted[1]+"\..*_f$");
                        for( var index in commands["cd"][cdir] )
                        {
                            var regExResponse = re.exec(commands["cd"][cdir][index]);
                            if(regExResponse)
                            {
                                matches.push(regExResponse["input"]);
                            }
                        }
                        if(matches.length==1)
                        {
                            caretposition+=matches[0].length-2-splitted[1].length;
                            total+=matches[0].length-2-splitted[1].length;
                            $('.active').text(splitted[0]+' '+matches[0].substr(0,matches[0].length-2));
                        }
                        else if(matches.length>1)
                        {
                            var outputstr = '';
                            for(var itr=0;itr<matches.length;itr++)
                            {
                                outputstr+=matches[itr].substr(0,matches[itr].length-2)+"    ";
                            }
                            $('.active').removeClass('active');
                            $('.prompt').removeClass('prompt');
                            $('#caret').css('display','none');
                            caretposition = currval.length;
                            total = currval.length;
                            carettop+=2;
                            $('body').append('<br><span>'+outputstr+'</span>');
                            $('body').append('<br><span id="prompt'+carettop+'">mbad0la@github:'+cdir+'$</span><span class="display active"></span>');
                            pw = $('#prompt'+carettop)[0].getBoundingClientRect().width;
                            $('#caret').css({'left':w*(caretposition+1)+pw+5,'top':carettop*h+5,'display':'block'});
                            $('.active').css('left',w);
                            $('.active').text(currval);
                        }
                    }
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
        if(e.which===38)
        {
            e.preventDefault();
            if(pointer < 0)
            {
              pointer = stack_size - 1;
            }
            if(pointer>=0)
            {
                $('.active').text(stack[pointer]);
                caretposition = stack[pointer].length;
                total =  stack[pointer].length;
                pointer--;
            }
        }
        if(e.which != 38)
        {
          pointer = stack_size - 1;
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

        if(str.length >= 1)
        {
          storeInStack(str);
        }

        var splitCommands = str.split(" ");
        var commandResponse = [];
        caretposition = 0;
        total = 0;

        if(commands[splitCommands[0]])
        {
            if(splitCommands.length==1)
            {
                if(splitCommands[0]=="help")
                {
                    commandResponse = commands[splitCommands[0]]["info"];
                    for(var i=0;i<commandResponse.length;i++)
                    {
                        ++carettop;
                        $('body').append('<br><span>'+commandResponse[i]+'</span>');
                    }
                }
                else if(splitCommands[0]=="ls")
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
                else if(splitCommands[0]=="cd")
                {
                    ++carettop;
                    $('body').append('<br>');
                    cdir = "~";
                }
                else if(splitCommands[0]=="clear")
                {
                    ++carettop;
                    $('body').append('<br>');
                }
            }
            else if(splitCommands.length==2)
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
                        if(splitCommands[1]=="..")
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
                        else if(splitCommands[1]==".")
                        {
                            ;
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
                    commandResponse = commands["cd"][cdir+"/"+splitCommands[1]];
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
                else if(splitCommands[0]=="cat")
                {
                    if(commands["cat"][cdir + '/' + splitCommands[1]])
                    {
                        commandResponse = commands["cat"][cdir + '/' + splitCommands[1]];
                        for(var i=0;i<commandResponse.length;i++)
                        {
                            ++carettop;
                            $('body').append('<br><span>'+commandResponse[i]+'</span>');
                        }
                    }
                    else
                    {
                        carettop+=2;
                        $('body').append('<br><span>cat: '+splitCommands[1]+': No such file</span><br>');
                    }
                    
                }
            }
            else
            {
                ++carettop;
                $('body').append('<br>');
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
        window.scrollTo(0, $('.active').offset().top);
    }

    function storeInStack(str)
    {
      if(str != stack[pointer])
      {
        stack.push(str);
        stack_size++;
        pointer = stack_size - 1;
      }
    }

});
