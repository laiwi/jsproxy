//动态添加JS脚本
if (typeof importScripts === 'function') {
    importScripts('https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js');
}else{
    let script = document.createElement("script");
    script.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}

const PAGE_CONF_SET = 110
const PAGE_CONF_GET = 111

const SW_CONF_RETURN = 112
const SW_CONF_CHANGE = 113

const PAGE_READY_CHECK = 200
const SW_READY = 201

const sw = navigator.serviceWorker


sw.addEventListener('message', onSwMsg)
sendMsgToSw(PAGE_READY_CHECK)

btnGo.onclick = function() {
    const text = txtURL.value.trim()
    if (text) {
        const url = './-----' + text
        open(url, '_blank', 'noopener,noreferrer')
    }
}
txtURL.onkeypress = function(e) {
    if (e.keyCode === 13) {
        btnGo.onclick()
    }
}
txtURL.setSelectionRange(0, txtURL.value.length)


function onSwMsg(e) {
    const [cmd, msg] = e.data

    switch (cmd) {
        case SW_CONF_RETURN:
            conf = msg
            showConf()
            break

        case SW_CONF_CHANGE:
            conf = msg
            updateSelected()
            break

        case SW_READY:
            console.log('sw ready')
            sendMsgToSw(PAGE_CONF_GET)
            break
    }
}

function onSwFail(err) {
    txtURL.value = err
}

function sendMsgToSw(cmd, val) {
    const ctl = sw.controller
    if (!ctl) {
        console.log('ctl is null')
        return
    }
    ctl.postMessage(...(self.__set_srcWin?__set_srcWin():[]), [cmd, val])
}

function updateSelected() {
    const id = conf.node_default
    const item = document.getElementById('--' + id)
    if (item) {
        item.selected = true
    } else {
        console.warn('unknown node:', id)
    }
}

function showConf() {
    updateSelected()
}

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
