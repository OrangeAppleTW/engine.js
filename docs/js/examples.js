$('li').click(function(){
    var select = $(this).text();
    if(select != "All"){
        $('h1').text("Examples (Sort By \"" + select + "\")");
        $('.example').each(function(){
            $(this).hide();
            tag = $(this).attr('tag');
            if(tag !=undefined){
                tags = tag.split(' ');
                for(var i = 0; i < tags.length; i++)
                    if(select == tags[i])
                        $(this).show();
            }
        });
    }else{
        $('h1').text("Examples");
        $('.example').show();
    }
});