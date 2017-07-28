$('.example-tags, ul, li').click(function(){
    var select = this.text();
    $('.example').each(function(){
        this.hide();
        tag = this.prop('tag');
        tags = tag.splice(' ');
        for(var i = 0; i < tags.length; i++)
            if(select == tags[i])
                this.show();
    });
});