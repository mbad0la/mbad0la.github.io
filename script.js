$(function(){
    var w = $('#getsize')[0].getBoundingClientRect().width;
    var h = $('#getsize')[0].getBoundingClientRect().height;
    var pw = $('#prompt')[0].getBoundingClientRect().width;

    $('#caret').css({'width':w,'height':h,'left':pw+w+5});
    $('#display').css('left',w);

    var caretposition = 0;
    var total = 0;

    $(document).keydown(function(e){
        if(e.which===8)
        {
            e.preventDefault();
            var txt = $('#display').text();
            if(txt.length!=0)
            {
                if(caretposition===total)
                    --total;
                --caretposition;
                txt = txt.substring(0,txt.length-1);
                $('#display').text(txt);
            }
        }
        if(e.which===37)
        {
            var txt = $('#display').text();
            if(txt.length!=0)
            {
                if(caretposition)
                    --caretposition;
            }
        }
        if(e.which===39)
        {
            var txt = $('#display').text();
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
                $('#display').append(String.fromCharCode(e.which));
            else
            {
                var to_split = $('#display').text();
                var left = to_split.substring(0,caretposition-1);
                left+=String.fromCharCode(e.which);
                var right = to_split.substring(caretposition-1,to_split.length);
                $('#display').text(left+right);
            }
            $('#caret').css('left',w*(caretposition+1)+pw+5);
        },30);
    });
});