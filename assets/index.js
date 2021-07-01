    $('#txtURL').keyup(searchKeywords)
    $("#txtURL").focus(searchKeywords);
    $("#txtURL").blur(searchKeywords);

    function searchKeywords(){
        if(!$(this).val()){
            $('.list-group').hide(500);
        }else{
            var sugurl = "https://suggestion.baidu.com/su?wd=#content#&cb=window.baidu.sug";
            sugurl = sugurl.replace("#content#", $(this).val());
            //定义回调函数
            window.baidu = {
                sug: function(json) {
                    var html="";
                    $('.list-group').html(html);
                    $.each(json.s,function(index,value){
                        html+='<li class="list-group-item list-group-item-action">'+value+'</li>';
                    });
                    $('.list-group').html(html);
                    $('.list-group').show(500);

                    $("li").click(function(){
                        $('.list-group').hide(500);
                        $('#txtURL').val($(this).text());
                        $('#btnGo').click();
                    })
                }
            }
            //动态添加JS脚本
            let script = document.createElement("script");
            script.src = sugurl;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    }
