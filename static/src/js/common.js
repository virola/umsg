var loading = {
    show: function (jdom) {
        var target = $(jdom);
        if (!target.size()) {
            return;
        }

        this.main = $('.loading');
        if (!this.main.size()) {
            this.main = $('<div>加载中...</div>').addClass('loading').insertAfter(target);
        }
        this.main.show();
    },
    hide: function () {
        $('.loading').hide();
    },

    error: function (jdom, clickhdl, msg) {
        $('.loading').hide();

        var target = $(jdom);
        if (!target.size()) {
            return;
        }

        if (!msg) {
            msg = '加载失败，请点击重试!';
        }

        clickhdl = clickhdl || function () {};

        this.mainErr = $('<div>' + msg +'</div>').addClass('loading-error').insertAfter(target);
        this.mainErr.on('click', clickhdl);
    },
    complete: function (msg) {
        $('.loading').text(msg || '加载完毕').show();
    }
};


$(function () {

    $('.btn-form-send').on('click', function () {
        $('form').submit();
    });

    $('.popup-close').on('click', function () {
        var popup = $(this).closest('.wrap-popup');
        popup.hide();
    });

    var firstLoad = $('.c-item:eq(0)');
    var firstTab = $('.tab-item:eq(0)');

    var popUser = $('#pop-userlist');
    $('#open-user-list').on('click', function () {
        popUser.children('div').css({
            minHeight: $(window).height()
        });
        popUser.show();

        firstLoad.load(firstTab.attr('data-url'), function () {
            // console.log('load finished');
        });
    });

    // bind tab
    $('.tab-menu').on('click', '.tab-item', function () {
        var me = $(this);
        var nav = me.closest('.tab-menu');
        var targets = nav.next('.tab-content');

        var target = $($(me).attr('href'));
        if (target.size()) {
            targets.children('.c-item').hide();
            target.show();

            nav.find('.current').removeClass('current');
            me.addClass('current');

            if (me.hasClass('select')) {

            }
            else {
                target.load(me.attr('data-url'));
            }
        }
        return false;
    });


    var groupTab = $('.tab-item:eq(1)');
    var groupC = $('.c-item:eq(1)');
    // bind select
    $('.select-list').on('change', function () {
        var me = $(this);
        var selected = me.next('.select-selected');
        var curVal = me.val();
        selected.text(me.find('option[value=' + curVal + ']').text());

        groupC.load(groupTab.attr('data-url'), function () {
            // 
        });
    });

    var userinput = $('#msg-username');

    // bind user select
    $('.user-wrap').on('click', '.list-item', function () {
        var username = $(this).find('dt').text();
        userinput.val(username);

        popUser.hide();
        userinput.focus();
    });

    /**
     * message list 页面逻辑处理
     */
    var replyForm = $('#chat-sendmsg-form');
    var replyText = $('#chat-sendmsg-box').find('textarea');
    var replyBtn = $('.sendmsg-go');

    replyText.on('focusin', function () {
        replyBtn.css({
            display: 'block'
        });
    });

    replyBtn.on('click', function () {
        var url = replyForm.attr('action');
        var content = $.trim(replyText.val());

        if (!content) {
            return false;
        }

        $.ajax({
            type: 'post',
            url: url,
            data: {
                content: content
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.status == 0) {
                    // console.log(data);
                    window.location.reload();
                }
            }
        });

        return false;
    });

    scroll.init();
});

/**
 * 消息列表scroll加载
 */
var scroll = (function () {

    var talkList = $('#talk-msg-list');
    var page = 1;
    var isAjax;
    var TALK_URL = talkList.attr('data-url');
    var isLoadend;

    function loadList(page) {
        if (isAjax) {
            return false;
        }
        var url = TALK_URL + '&page=' + page;
        isAjax = 1;
        loading.show(talkList);

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (json) {
                setTimeout(function () {

                    isAjax = 0;
                    
                    if (json.status == 0) {
                        renderList(json.data.list || []);
                        if (json.data.loadend) {
                            isLoadend = 1;
                            loading.complete('已全部加载完毕');
                        }
                    }
                }, 1000);
                
            },
            failure: function () {
                isAjax = 0;
            }
        })
    }

    function renderList(list) {
        var html = [];
        $.each(list, function (i, data) {
            var talkStyle = 'guest-talk';
            if (data.issend) {
                talkStyle = 'me-talk';
            }
            var str = ''
                + '<li class="clear">'
                +     '<time class="date-talk">' + data.dateline + '</time>'
                +     '<section class="' + talkStyle + '">'
                +         '<a class="avatar-talk" href="#">'
                +             '<img class="avator-round" src="' + data.avator + '">'
                +         '</a>'
                +         '<div class="content-talk">'
                +             '<p>' + data.content + '</p>'
                +         '</div>'
                +     '</section>'
                + '</li>';
            html[i] = str;
        });
        talkList.append(html.join(''));
    }

    var talkTimer;

    function bindScroll() {
        $(window).on('scroll', function () {
            var viewBottom = $(document.body).scrollTop() + $(window).height();
            var listBottom = talkList.offset().top + talkList.outerHeight();

            if (talkTimer) {
                clearTimeout(talkTimer);
            }

            if (isLoadend) {
                return false;
            }

            talkTimer = setTimeout(function () {
                if (viewBottom >= listBottom && !isAjax) {
                    page++;
                    loadList(page);
                }
            }, 200);
        });
    }

    

    return {
        init: function () {

            if (talkList.size()) {
                bindScroll();
            }
        }
    };
})();
function initScroll() {

}
