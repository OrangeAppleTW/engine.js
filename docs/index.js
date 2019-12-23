function Runner (containerId) {
    this.editor = CodeMirror.fromTextArea(document.getElementById("editor-textarea"), {
        lineNumbers: true,
        mode:  "javascript",
        theme: "mbo",
        styleActiveLine: true,
        matchBrackets: true
    });
    this.sandbox = document.getElementById('sandbox');
    this.container = document.getElementById(containerId);
}

Runner.prototype = {
    setCode: function (code) {
        this.editor.setValue(code);
    },
    clearCode: function () {
        this.editor.setValue('');
    },
    run: function () {
        var code = this.editor.getValue();
        this.sandbox.contentWindow.location.reload();
        this.sandbox.onload = function() {
            sandbox.contentWindow.postMessage({fn: 'exec', code: code}, "*");
            sandbox.contentWindow.document.getElementsByTagName('canvas')[0].focus();
        };
    },
    stop: function () {
        this.sandbox.contentWindow.postMessage({fn: 'stop'}, "*");
    },
}

$(document).ready(function() {

    var runner = new Runner('editor');

    $('.js-example-code').click(function() {
        runner.clearCode();
        $('.js-popup').addClass('active');
        var path = $(this).attr('code-path');
        $.ajax({
            url: path,
            dataType: "text",
            success: function (data) {
                runner.setCode(data);
            }
        }).done(runner.run.bind(runner));
    });
    $('.js-popup').click(function(event) {
        event.stopPropagation();
        $(this).removeClass('active');
        runner.stop();
    });
    $('.popup-content').click(function(event) {
        event.stopPropagation();
    });
    $('.js-run').click(runner.run.bind(runner));

    var links = [];

    $('.navbar.js-navbar a').each(function () {
        var link = $(this);
        var targetId = link.attr('href');
        if(targetId.startsWith('#') && $(targetId).length > 0) {
            link.data('scroll-top', $(targetId).position().top);
            links.push(link);
        }
    });

    links.sort(function(a, b) {
        return a.data('scroll-top') - b.data('scroll-top');
    });
    
    $(document).scroll(function() {
        var distance = $(document).scrollTop();
        for(var i=0; i<links.length; i++) {
            if(links[i].data('scroll-top') > distance) {
                focus(links[i]);
                break;
            }
        }
    })

    function focus(ele) {
        $('.navbar > *').removeClass('focus');
        $(ele).addClass('focus');
    }
});