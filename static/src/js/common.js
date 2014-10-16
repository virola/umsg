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


    // ************************************
    /**
     * message list 页面逻辑处理
     */
    var replyForm = $('#chat-sendmsg-form');
    var replyText = $('#chat-sendmsg-box').find('.txt');
    var replyBtn = $('.sendmsg-go');

    replyText.on('keydown', function (e) {
        // todo
    }).on('focusin', function () {
        // replyBtn.css('display', 'block');
    });

    replyForm.on('submit', function () {
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
                if (data && data.status === 0) {
                    window.location.reload();
                }
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

    // reload
    $('.menu-wrap .ic-refresh').on('click', function () {
        window.location.reload();
    });
    $('.menu-wrap .block-user').on('click', function () {
        var result = window.confirm('确认屏蔽？屏蔽后将收不到对方发来的纸条。');
        if (result) {
            // todo
            console.log('ban user~~');
        }
    });
    $('.menu-wrap .clear-talk').on('click', function () {
        var result = window.confirm('确认清空？这个对话内容将被全部删除。');
        if (result) {
            // todo
            console.log('clear talk~~');
        }
    });
    // END
});

/**
 * 消息列表scroll加载
 */
var scrollModule = (function () {

    var talkList = $('#talk-msg-list');
    var page = 1;
    var isAjax;
    var TALK_URL = talkList.attr('data-url');
    var isLoadend;

    var uiScroll;

    // pull down loading
    function initScroller() {
        uiScroll = new IScroll('#page-chat', { 
            probeType: 2, 
            mouseWheel: true,
            scrollbars: true,
            fadeScrollbars: true,
            momentum: true,        // 允许有惯性滑动
            shrinkScrollbars: 'scale',
            click: true
        });

        var timer;
        uiScroll.on('scroll', function () {
            var _me = this;
            if (isLoadend || isAjax) {
                return false;
            }

            // console.log(_me.x, _me.y);

            if (_me.y > 0) {
                // loading.show('下拉加载历史消息');
            }

            if (_me.y < _me.maxScrollY) {
                loading.show('上拉加载历史消息');
            }

            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(function () {
                // if (_me.y >= 5 && !isAjax) {
                if ((_me.y <= _me.maxScrollY + 5) && !isAjax) {
                    page++;
                    loadList(page);
                }
            }, 200);
        });

        uiScroll.on('scrollEnd', function () {
            if (isLoadend || isAjax) {
                return false;
            }

            var y = this.y;
            if (y < 5) {
                loading.hide();
            }
        });
    }


    // for pull up loading
    var talkTimer;

    // pull up loading
    function bindPullUpScroll() {
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
                setTimeout(function () {

                    isAjax = 0;
                    
                    if (json.status === 0) {
                        renderList(json.data.list || []);

                        setTimeout(function () {
                            uiScroll.refresh();
                        }, 0);

                        loading.hide();

                        if (json.data.loadend) {
                            isLoadend = 1;
                            loading.complete('已全部显示');
                        }
                    }
                }, 1000);
                
            },
            failure: function () {
                isAjax = 0;
            }
        });
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
        // $(html.join('')).insertBefore(talkList.children('li:first'));
    }


    return {
        init: function () {

            if (talkList.size()) {
                initScroller();
                // bindPullUpScroll();
            }
        }
    };
})();
