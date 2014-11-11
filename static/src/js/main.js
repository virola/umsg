var loading = {
    show: function (msg, jdom) {
        
        this.main = $('.loading');
        if (!this.main.size()) {
            var target = $(jdom);
            if (!target.size()) {
                return;
            }
            this.main = $('<div>加载中...</div>').addClass('loading').insertAfter(target);
        }
        if (msg) {
            this.main.text(msg);
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

var util = (function () {

    var exports = {};

    exports.parseJSON = function (data) {
        data = data || '{}';
        try {
            return (new Function('return (' + data + ')'))();
        }
        catch (e) {
            return {};
        }
    };

    return exports;

})();


var pageParams = window.pageParams || {};

/**
 * 消息列表scroll加载
 */
var scrollModule = (function () {
    var pageCont = $('#page-chat');

    var talkList = $('#talk-msg-list');
    var page = 1;
    var isAjax;
    var TALK_URL = talkList.attr('data-url');
    var isLoadend = parseInt(talkList.attr('data-loadend'), 10) || 0;

    function loadList(page) {
        if (isAjax) {
            return false;
        }
        var url = TALK_URL + '&page=' + page;
        isAjax = 1;
        loading.show('加载中...', talkList);

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (json) {
                isAjax = 0;

                if (json && json.list && (json.list instanceof Array)) {
                    var list = json.list;

                    renderList(list || []);

                    loading.hide();
                }
                else {
                    loading.error(talkList);
                }
                if (json['page_total'] === false) {
                    isLoadend = 1;
                    loading.complete('已全部显示');
                }
            },
            failure: function () {
                isAjax = 0;
            }
        });
    }

    function renderList(list) {
        var html = [];
        $.each(list, function (i, data) {
            if (!data['message_id']) {
                html[i] = '';
                return;
            }

            var talkStyle = 'guest-talk';
            if (data.isOwner) {
                talkStyle = 'me-talk';
            }
            var avatar = 'http://my.' + pageParams.siteDomain 
                + '/?app=user&func=getAvatar&pro=uv&user_id=' + data['insert_id'] + '&type=small';

            var profile = 'http://xiaozu.' + pageParams.siteDomain 
                + '/home.php?mod=space&uid=' + data['insert_id'] + '&do=profile';

            var str = ''
                + '<li class="clear">'
                +     '<time class="date-talk">' + data['insert_time'] + '</time>'
                +     '<section class="' + talkStyle + '">'
                +         '<a class="avatar-talk" href="' + profile + '">'
                +             '<img class="avator-round" src="' + avatar + '">'
                +         '</a>'
                +         '<div class="content-talk">'
                +             '<p>' + data.content + '</p>'
                +         '</div>'
                +         '<span class="username">' + data['insert_name'] + '</span>'
                +     '</section>'
                + '</li>';

            html[i] = str;
        });

        talkList.append(html.join(''));
    }


    var talkTimer;

    function bindScroll() {
        var viewHeight = $(window).height();
        var docHeight = $(document.body).height();

        var listHeight = talkList.outerHeight();

        $(pageCont).on('scroll', function () {

            if (talkTimer) {
                clearTimeout(talkTimer);
            }

            if (isLoadend || isAjax) {
                return false;
            }

            loading.show('上拉加载历史消息');

            talkTimer = setTimeout(function () {
                var st = pageCont.scrollTop();
                if (st + viewHeight >= listHeight - 60) {
                    page++;
                    loadList(page);
                }
            }, 500);
        });
    }

    /**
     * 新消息的追加
     */
    function addNewMsg(list) {
        var html = [];

        $.each(list, function (i, data) {
            if (!data['message_id']) {
                html[i] = '';
                return;
            }

            var talkStyle = 'guest-talk';
            if (data.isOwner) {
                talkStyle = 'me-talk';
            }
            var avatar = 'http://my.' + pageParams.siteDomain 
                + '/?app=user&func=getAvatar&pro=uv&user_id=' + data['insert_id'] + '&type=small';

            var profile = 'http://xiaozu.' + pageParams.siteDomain 
                + '/home.php?mod=space&uid=' + data['insert_id'] + '&do=profile';

            var str = ''
                + '<li class="clear">'
                +     '<time class="date-talk">' + data['insert_time'] + '</time>'
                +     '<section class="' + talkStyle + '">'
                +         '<a class="avatar-talk" href="' + profile + '">'
                +             '<img class="avator-round" src="' + avatar + '">'
                +         '</a>'
                +         '<div class="content-talk">'
                +             '<p>' + data.content + '</p>'
                +         '</div>'
                +         '<span class="username">' + data['insert_name'] + '</span>'
                +     '</section>'
                + '</li>';

            html[i] = str;
        });

        talkList.addClass('talk-list-add');
        $(html.join('')).insertBefore(talkList.children('li:first'));
        talkList.removeClass('talk-list-add');
    }


    var REQ_DELAY = 10000;

    // 即时会话效果，每n秒请求一次
    function initCurTalk() {
        var isGetting;

        setInterval(function () {
            if (isGetting) {
                return false;
            }
            isGetting = 1;

            $.ajax({
                url: pageParams.ajaxUrl.getNewMsg,
                dataType: 'json'
            }).done(function (json) {
                if (json && json.list && (json.list instanceof Array)) {
                    addNewMsg(json.list || []);
                }
            }).complete(function () {
                isGetting = 0;
            });
        }, REQ_DELAY);
    }

    return {
        init: function () {
            if (talkList.size()) {
                // initScroller();
                bindScroll();

                if (isLoadend) {
                    loading.complete('已全部显示');
                }

                initCurTalk();
            }
        },

        addNewMsg: addNewMsg
    };
})();

/**
 * 首页列表scroll加载
 */
var indexList = (function () {

    var exports = {};

    var loadingText = {
        loadend: '没有更多消息',
        loading: '<i class="fa-li fa fa-spinner fa-spin"></i><span>加载中…</span>',
        toload: '下拉加载更多消息'
    };
    var loadDom = $('#loading-area');
    var isLoadend;

    var mainList = $('#index-msg-list');
    var isAjax;

    // cur page
    var page = 1;

    function bindScroll() {
        var docHeight = $(document.body).height();
        var viewHeight = $(window).height();

        var timerScroll;

        var scrollEvent = function () {
            var st = $(document.body).scrollTop();
            if (st + viewHeight >= docHeight - 60 && !isLoadend && !isAjax) {
                loadList(++page);
            }
        };

        $(window).on('scroll', function () {

            if (timerScroll) {
                clearTimeout(timerScroll);
            }

            timerScroll = setTimeout(function () {
                scrollEvent();
            }, 500);
        });

        if (docHeight <= viewHeight) {
            scrollEvent();
        }
    }

    // 获取首页未读消息
    var unreadMsg = 0;

    var url = 'http://m.zhitiao.' + pageParams.siteDomain + '/index.php?app=message&func=messageTotal';

    function getMsgCnt() {
        $.ajax({
            url: url,
            cache: false,
            dataType: 'jsonp'
        }).done(function (resp) {
            var respTxt = resp.data;
            var cnt = parseInt(respTxt, 10);
            cnt = isNaN(cnt) ? 0 : cnt;

            // 自动刷新首页页面
            if (cnt != unreadMsg) {
                unreadMsg = cnt;
                
                page = 1;
                isLoadend = 0;
                loadList(page);
            }
        });
    }

    function initGetNewMsg() {
        var delay = 10000;
        // 定时请求消息数量
        setInterval(function () {
            getMsgCnt();
        }, delay);
    }

    
    exports.init = function () {
        if (mainList.size() > 0) {
            bindScroll();
            initGetNewMsg();
        }
    };



    function loadList(page) {
        if (isAjax) {
            return false;
        }
        var MSG_URL = pageParams.ajaxUrl.getMsgList;
        var url = MSG_URL + (MSG_URL.indexOf('?') > -1 ? '&' : '&') + 'page=' + page;
        isAjax = 1;
        loadDom.html(loadingText.loading);

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (json) {
                isAjax = 0;

                if (json && json.list && (json.list instanceof Array)) {
                    var list = json.list;

                    if (page == 1) {
                        mainList.find('li:not([class])').remove();
                    }

                    renderList(list || []);

                    loadDom.html(loadingText.toload);
                }
                else {
                    loadDom.html(loadingText.toload);
                }
                if (json['page_total'] === false) {
                    isLoadend = 1;
                    loadDom.html(loadingText.loadend);
                }
            },
            failure: function () {
                isAjax = 0;
                page--;
            }
        });
    }

    function renderList(list) {
        var html = [];
        $.each(list, function (i, data) {
            if (!data['talk_id']) {
                html[i] = '';
                return;
            }

            var avatar = 'http://my.' + pageParams.siteDomain 
                + '/?app=user&func=getAvatar&pro=uv&user_id=' + data['insert_id'] + '&type=small';

            var profile = 'http://xiaozu.' + pageParams.siteDomain 
                + '/home.php?mod=space&uid=' + data['insert_id'] + '&do=profile';

            var str = ''
                + '<li>'
                +     '<a href="index.php?func=userTalkList&amp;t=' + data['talk_id'] + '" class="clear">'
                +         '<div class="user-avator fl">'
                ;

            if (data['userNum'] > 0) {
                str += '<img class="avator-round" src="http://s1.' + pageParams.siteDomain + '/images/user/qun.jpg">';
            }
            else {
                str += '<img class="avator-round" src="http://my.' + pageParams.siteDomain 
                    + '/?app=user&func=getAvatar&pro=uv&user_id=' + data['userId'] + '&type=small">';
            }

            str += ''
                + '</div>'
                + '<dl class="user-info">'
                +     '<dt>' + data['user_name'] + '</dt>'
                +     '<dd>' 
                + (data['noMessage'] ? '' : data['last_message']) + '</dd>'
                + '</dl>'
                + '<span class="plus">'
                +     '<span class="dateline">' 
                + (!data['noMessage'] && data['last_time'] ? data['last_time'] : '') 
                + '</span>'
                ;

            if (data['unread'] > 0) {
                str += '<i class="bubble bubble-dot-red">' + data['unread'] + '</i>';
            }

            str += ''
                +         '</span>'
                +     '</a>'
                + '</li>';

            html[i] = str;
        });

        mainList.append(html.join(''));
    }

    return exports;
})();



$(function () {

    // 写纸条的消息发送框交互
    $('.btn-form-send').on('click', function () {
        $('form').submit();
    });

    $('.msg-form').on('submit', function () {
        var form = $(this);
        var userInput = form.find('.msg-t');
        var contInput = form.find('.msg-c');

        if ( !$.trim(userInput.val()) || !$.trim(contInput.val())) {
            return false;
        }
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

    var userinput = $('#msg-username');

    // bind user select
    $('.user-wrap').on('click', '.list-item', function () {
        var username = $(this).find('dt').text();
        userinput.val(username);

        popUser.hide();
        userinput.focus();
    });


    // ************************************
    /**
     * message list 页面逻辑处理
     */
    var replyForm = $('#chat-sendmsg-form');
    var replyText = $('#chat-sendmsg-box').find('.txt');
    var replyBtn = $('.sendmsg-go');

    var isPosting;

    replyForm.on('submit', function () {
        var url = replyForm.attr('action');
        var content = $.trim(replyText.val());

        if (!content || isPosting) {
            return false;
        }
        isPosting = 1;

        $.ajax({
            type: 'post',
            url: url,
            data: {
                content: content
            },
            success: function (resp) {
                if (parseInt(resp, 10) == 1) {
                    window.location.reload();
                }
                isPosting = 0;
            },
            error: function (resp) {
                isPosting = 0;
            }
        });

        return false;
    });

    scrollModule.init();

    $('.show-menu').on('click', function () {
        var target = $($(this).attr('data-menu'));
        if (target.size()) {
            target.show();
        }
        return false;
    });

    $('.menu-wrap').on('click', function () {
        var wrap = $(this);
        wrap.hide();
    });

    // 屏蔽纸条
    var unblockTpl = '<p>你已屏蔽此人。<a href="javascript:;" class="unblock-user">点击这里</a>解除屏蔽</p>';
    $('.menu-wrap .block-user').on('click', function () {
        var result = window.confirm('确认屏蔽？屏蔽后将收不到对方发来的纸条。');
        if (result) {
            var dataStr = $(this).attr('data-val');
            var val = util.parseJSON(dataStr);
            var url = pageParams.ajaxUrl.banUser;
            $.post(url, val).done(function (resp) {
                if (parseInt(resp, 10) == 1) {
                    $('.info-msg').html(unblockTpl).show();
                    $('.info-msg').find('a').attr('data-val', dataStr);
                }
            });
        }
    });

    $('.menu-wrap .clear-talk').on('click', function () {
        var result = window.confirm('确认清空？这个对话内容将被全部删除。');
        if (result) {
            var dataStr = $(this).attr('data-val');
            var val = util.parseJSON(dataStr);
            var url = pageParams.ajaxUrl.delTalk;

            $.post(url, val).done(function (resp) {
                if (parseInt(resp, 10) == 1) {
                    window.location.reload();
                }
            });
        }
    });

    $(document.body).on('click', 'a[data-command]', function () {
        var target = $(this);
        var command = target.attr('data-command');
        var dataStr = $(this).attr('data-val');
        var val = util.parseJSON(dataStr);

        var url;

        if (command == 'unblockuser') {
            url = pageParams.ajaxUrl.unblockUser;

            $.post(url, val).done(function (resp) {
                if (parseInt(resp, 10) == 1) {
                    $('.info-msg').html('').hide();
                }
            });
        }

        if (command == 'refresh') {
            window.location.reload();
        }
    });

    indexList.init();

    // END
});