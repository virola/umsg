/**
 * @file 消息数量请求通用js
 */

(function ($) {
    var domain = '94uv.com';
    if (window.location.href.indexOf('94uv.dev') > -1) {
        domain = '94uv.dev';
    }
    if (window.location.href.indexOf('94uv.test') > -1) {
        domain = '94uv.test';
    }
    var url = 'http://m.zhitiao.' + domain + '/index.php?app=message&func=messageTotal';

    function getMsgCnt() {
        $.ajax({
            url: url,
            cache: false,
            dataType: 'jsonp'
        }).done(function (resp) {
            var respTxt = resp.data;
            var cnt = parseInt(respTxt, 10);
            cnt = isNaN(cnt) ? 0 : cnt;

            var msgCount = cnt > 99 ? '99+' : cnt; 
            var msgWrap = $('.footer>ul>li:eq(3)>a');
            var msgInfo = msgWrap.find('i');
            if (!msgInfo.size()) {
                msgInfo = $('<i>').appendTo(msgWrap);
            }
            msgInfo.text(msgCount);
            if (cnt <= 0) {
                msgInfo.remove();
            }
        });
    }

    // 定时请求消息数量
    setInterval(function () {
        getMsgCnt();
    }, 30000);
    
    getMsgCnt();
})(jQuery);