$(document).ready(function() {

    $('.treemenu a').click(function() {
    });

    var links = [];
    var lis = $('.treemenu li');
    lis.each(function() {
        var link = $(this);
        var targetId = link.children('a').attr('href');
        if($(targetId).length > 0) {
            link.data('scroll-top', $(targetId).position().top);
            links.push(link);
        }
        
    });

    links.sort(function(a, b) {
        return a.data('scroll-top') - b.data('scroll-top');
    });

    window.links = links;

    $(document).scroll(function() {
        var distance = $(document).scrollTop();
        for(var i=0; i<links.length; i++) {
            if(links[i].data('scroll-top') > distance) {
                console.log(links[i].data('scroll-top'))
                focus(links[i]);
                break;
            }
        }
    })

    function focus(ele) {
        $('.treemenu li').removeClass('focus');
        $(ele).addClass('focus');
        $($(ele).find('li')[0]).addClass('focus');
        $(ele).parent().parent().addClass('focus');
    }

    $('#editor-toggle,.js-popup').click(function() {
        $('.popup').toggleClass('active');
    });

    $('.popup-content').click(function(event) {
        event.stopPropagation();
    });

    var editor = CodeMirror.fromTextArea(document.getElementById("editor-textarea"), {
        lineNumbers: true,
        mode:  "javascript",
        theme: "mbo",
        styleActiveLine: true,
        matchBrackets: true
    });

    $('.js-start').click(function() {
        var code = editor.getValue();
        var sandbox = document.getElementById('sandbox');
        sandbox.contentWindow.location.reload();
        sandbox.onload = function() {
            sandbox.contentWindow.postMessage({fn: 'exec', code: code}, "*");
            sandbox.contentWindow.document.getElementsByTagName('canvas')[0].focus();
        };
    });

    $('.js-stop').click(function() {
        sandbox.contentWindow.postMessage({fn: 'stop'}, "*");
    });

    $('.js-example-code').click(function() {
        editor.setValue('');
        $('.popup').toggleClass('active');
        var path = $(this).attr('code-path');
        $.ajax({
            url: path,
            dataType: "text",
            success: function (data) {
                editor.setValue(data);
            }
        });
    });

});