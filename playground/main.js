window.Game = {};
var tdScript = require("raw-loader!./examples/_td.js"),
    flappyBirdScript = require("raw-loader!./examples/_flappy-bird.js"),
    starsScript = require("raw-loader!./examples/_stars.js"),
    scrollingScript = require("raw-loader!./examples/_scrolling.js"),
    touchTestScript = require("raw-loader!./examples/_touch-test.js"),
    pumpScript = require("raw-loader!./examples/_pump.js");

$("textarea#TD").val(tdScript);
$("textarea#flappy-bird").val(flappyBirdScript);
$("textarea#stars").val(starsScript);
$("textarea#scrolling").val(scrollingScript);
$("textarea#touch-test").val(touchTestScript);
$("textarea#pump").val(pumpScript);

var editor = CodeMirror.fromTextArea(document.getElementById("script-box"), {
    lineNumbers: true,
    mode:  "javascript",
    theme: "mbo",
    styleActiveLine: true,
    matchBrackets: true
});
$("#run-code-button").click(
    function(){
        if(Game.stop){Game.stop();}
        Game = Engine("stage",true)
        editor.save();
        eval.call(window,document.getElementById("script-box").value);
        arrangeLayout();
    }
)
$("#stop-code-button").click(
    function(){
        $(this).hide();
        $("#start-code-button").show()
        Game.stop();
    }
);
$("#start-code-button").click(
    function(){
        $(this).hide();
        $("#stop-code-button").show()
        Game.start();
    }
);
$("#demo-selector a").click(function(){
    setTimeout(function(){
        putDemoCode();
    },0);
});
$(window).resize(function(){
     arrangeLayout();
});
arrangeLayout();
putDemoCode();

function arrangeLayout(){
    editor.setSize("100%", 540);
    var rightPartWidth = $(".container-fluid").width() - $(".left-part").outerWidth();
    $(".right-part").width(rightPartWidth);
}

function putDemoCode(){
    var hash = window.location.hash;
    if(hash==""||hash=="#"){
        editor.getDoc().setValue("");
    } else {
        editor.getDoc().setValue( $("textarea"+hash).val() );
    }
    // $('ul'+hash+':first').show();
}