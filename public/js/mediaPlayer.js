var NOWPLAYING = null
const isMobile = /mobile/i.test(window.navigator.userAgent);
var originTitle = document.title;
const mediaPlayer = function(t, config) {
  const pageScroll = function(target, offset, complete) {
    // 计算滚动目标的顶部位置
    const targetTop = typeof target === 'number' ? target : 
                      (target ? target.getBoundingClientRect().top + window.pageYOffset - 15 : 0);
    // 考虑传入的offset
    const scrollToPosition = offset || targetTop;
  
    // 执行平滑滚动
    target.scrollIntoView({
        top: scrollToPosition,
        behavior: 'smooth'
    });
  
    if (complete) {
        setTimeout(complete, 500); // 假设滚动大约需要500毫秒完成
    }
  };
  
  const store = {
      get: function(item) {
          return localStorage.getItem(item);
      },
      set: function(item, str) {
          localStorage.setItem(item, str);
          return str;
      },
      del: function(item) {
          localStorage.removeItem(item);
      }
  }
  const $ = function(selector, element) {
    element = element || document;
    if(selector.indexOf('#') === 0) {
      return element.getElementById(selector.replace('#', ''))
    }
    return element.querySelector(selector)
  };
  
  $.all = function(selector, element) {
    element = element || document;
    return element.querySelectorAll(selector)
  };
  
  $.each = function(selector, callback, element) {
    return $.all(selector, element).forEach(callback)
  }
  const tabFormat = function() {
    // tab
    var first_tab
    $.each('div.tab', function(element, index) {
      if(element.attr('data-ready'))
        return
  
      var id = element.attr('data-id');
      var title = element.attr('data-title');
      var box = $('#' + id);
      if(!box) {
        box = document.createElement('div');
        box.className = 'tabs';
        box.id = id;
        box.innerHTML = '<div class="show-btn"></div>'
  
        var showBtn = box.child('.show-btn');
        showBtn.addEventListener('click', function(event) {
          pageScroll(box)
        });
  
        element.parentNode.insertBefore(box, element);
        first_tab = true;
      } else {
        first_tab = false;
      }
  
      var ul = box.child('.nav ul');
      if(!ul) {
        ul = box.createChild('div', {
          className: 'nav',
          innerHTML: '<ul></ul>'
        }).child('ul');
      }
  
      var li = ul.createChild('li', {
        innerHTML: title
      });
  
      if(first_tab) {
        li.addClass('active');
        element.addClass('active');
      }
  
      li.addEventListener('click', function(event) {
        var target = event.currentTarget;
        box.find('.active').forEach(function(el) {
          el.removeClass('active');
        })
        element.addClass('active');
        target.addClass('active');
      });
  
      box.appendChild(element);
      element.attr('data-ready', true)
    });
  }
  const showtip = function(msg) {
    if(!msg)
      return
    const BODY = document.getElementsByTagName('body')[0];
    var tipbox = BODY.createChild('div', {
      innerHTML: msg,
      className: 'tip'
    });
  
    setTimeout(function() {
      tipbox.addClass('hide')
      setTimeout(function() {
        BODY.removeChild(tipbox);
      }, 300);
    }, 3000);
  }
  Object.assign(HTMLElement.prototype, {
      createChild: function(tag, obj, positon) {
        var child = document.createElement(tag);
        Object.assign(child, obj)
        switch(positon) {
          case 'after':
            this.insertAfter(child)
            break;
          case 'replace':
            this.innerHTML = ""
          default:
            this.appendChild(child)
        }
        return child
      },
      wrap: function (obj) {
        var box = document.createElement('div');
        Object.assign(box, obj)
        this.parentNode.insertBefore(box, this);
        this.parentNode.removeChild(this);
        box.appendChild(this);
      },
      height: function(h) {
        if(h) {
          this.style.height = typeof h == 'number' ? h + 'rem' : h;
        }
        return this.getBoundingClientRect().height
      },
      width: function(w) {
        if(w) {
          this.style.width = typeof w == 'number' ? w + 'rem' : w;
        }
        return this.getBoundingClientRect().width
      },
      top: function() {
        return this.getBoundingClientRect().top
      },
      left:function() {
        return this.getBoundingClientRect().left
      },
      attr: function(type, value) {
        if(value === null) {
          return this.removeAttribute(type)
        }
    
        if(value) {
          this.setAttribute(type, value)
          return this
        } else {
          return this.getAttribute(type)
        }
      },
      insertAfter: function(element) {
        var parent = this.parentNode;
        if(parent.lastChild == this){
            parent.appendChild(element);
        }else{
            parent.insertBefore(element, this.nextSibling);
        }
      },
      display: function(d) {
        if(d == null) {
          return this.style.display
        } else {
          this.style.display = d;
          return this
        }
      },
      child: function(selector) {
        return $(selector, this)
      },
      find: function(selector) {
        return $.all(selector, this)
      },
      _class: function(type, className, display) {
        var classNames = className.indexOf(' ') ?  className.split(' ') : [className];
        var that = this;
        classNames.forEach(function(name) {
          if(type == 'toggle') {
            that.classList.toggle(name, display)
          } else {
            that.classList[type](name)
          }
        })
      },
      addClass: function(className) {
        this._class('add', className);
        return this;
      },
      removeClass: function(className) {
        this._class('remove', className);
        return this;
      },
      toggleClass: function(className, display) {
        this._class('toggle', className, display);
        return this;
      },
      hasClass: function(className) {
        return this.classList.contains(className)
      }
  });
  
  var option = {
    type: 'audio',
    mode: 'random',
    btns: ['play-pause', 'music'],
    controls: ['mode', 'backward', 'play-pause', 'forward', 'volume'],
    events: {
      "play-pause": function(event) {
          var playPauseButtons = document.querySelectorAll('.play-pause');
          if(source.paused) {
            t.player.play()
            playPauseButtons.forEach(function(btn) {
                  btn.className = 'iconfont icon-pause play-pause mbtn';
            })
          } else {
            t.player.pause()
            playPauseButtons.forEach(function(btn) {
              btn.className = 'iconfont icon-play play-pause mbtn';
            })
          }
      },
      "music": function(event) {
        if(info.el.hasClass('show')) {
          info.hide()
        } else {
          info.el.addClass('show');
          playlist.scroll().title()
        }
      }
    }
  }, utils = {
    random: function(len) {
      return Math.floor((Math.random()*len))
    },
    parse: function(link) {
      var result = [];
      [
        ['music.163.com.*song.*id=(\\d+)', 'netease', 'song'],
        ['music.163.com.*album.*id=(\\d+)', 'netease', 'album'],
        ['music.163.com.*artist.*id=(\\d+)', 'netease', 'artist'],
        ['music.163.com.*playlist.*id=(\\d+)', 'netease', 'playlist'],
        ['music.163.com.*discover/toplist.*id=(\\d+)', 'netease', 'playlist'],
        ['y.qq.com.*song/(\\w+).html', 'tencent', 'song'],
        ['y.qq.com.*album/(\\w+).html', 'tencent', 'album'],
        ['y.qq.com.*singer/(\\w+).html', 'tencent', 'artist'],
        ['y.qq.com.*playsquare/(\\w+).html', 'tencent', 'playlist'],
        ['y.qq.com.*playlist/(\\w+).html', 'tencent', 'playlist'],
        ['xiami.com.*song/(\\w+)', 'xiami', 'song'],
        ['xiami.com.*album/(\\w+)', 'xiami', 'album'],
        ['xiami.com.*artist/(\\w+)', 'xiami', 'artist'],
        ['xiami.com.*collect/(\\w+)', 'xiami', 'playlist'],
      ].forEach(function(rule) {
        var patt = new RegExp(rule[0])
        var res = patt.exec(link)
        if (res !== null) {
          result = [rule[1], rule[2], res[1]]
        }
      })
      return result
    },
    fetch: function(source) {
      var list = []

      return new Promise(function(resolve, reject) {
        source.forEach(function(raw) {
          var meta = utils.parse(raw)
          if(meta[0]) {
            var skey = JSON.stringify(meta)
            var playlist = store.get(skey)
            if(playlist) {
              list.push.apply(list, JSON.parse(playlist));
              resolve(list);
            } else {
              fetch('https://api.i-meto.com/meting/api?server='+meta[0]+'&type='+meta[1]+'&id='+meta[2]+'&r='+ Math.random())
                .then(function(response) {
                  return response.json()
                }).then(function(json) {
                  store.set(skey, JSON.stringify(json))
                  list.push.apply(list, json);
                  resolve(list);
                }).catch(function(ex) {console.error("Fetch error: ", ex);})
            }
          } else {
            list.push(raw);
            resolve(list);
          }
        })
      })
    },
    secondToTime: function(second) {
      var add0 = function(num) {
        return isNaN(num) ? '00' : (num < 10 ? '0' + num : '' + num)
      };
      var hour = Math.floor(second / 3600);
      var min = Math.floor((second - hour * 3600) / 60);
      var sec = Math.floor(second - hour * 3600 - min * 60);
      return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
    },
    nameMap: {
      dragStart: isMobile ? 'touchstart' : 'mousedown',
      dragMove: isMobile ? 'touchmove' : 'mousemove',
      dragEnd: isMobile ? 'touchend' : 'mouseup',
    }
  }, source = null;

  t.player = {
    _id: utils.random(999999),
    _isInitializing: false, // 新增属性，用于标记是否正在初始化
    group: true,
    // 加载播放列表
    load: function(newList) {
      var d = ""
      var that = this

      if(newList && newList.length > 0) {
        if(this.options.rawList !== newList) {
          this.options.rawList = newList;
          playlist.clear()
          // 获取新列表
          //this.fetch()
        }
      } else {
        // 没有列表时，隐藏按钮
        d = "none"
        this.pause()
      }
      for(var el in buttons.el) {
        buttons.el[el].display(d)
      }
      return this
    },
    fetch: function () {
      var that = this;
      return new Promise(function(resolve, reject) {
          if(playlist.data.length > 0) {
            resolve()
          } else {
            if(that.options.rawList) {
              var promises = [];

              that.options.rawList.forEach(function(raw, index) {
                promises.push(new Promise(function(resolve, reject) {
                  var group = index
                  var source
                  if(!raw.list) {
                    group = 0
                    that.group = false
                    source = [raw]
                  } else {
                    that.group = true
                    source = raw.list
                  }
                  utils.fetch(source).then(function(list) {
                    playlist.add(group, list)
                    resolve()
                  })
                }))
              })

              Promise.all(promises).then(function() {
                resolve(true)
              })
            }
          }
        }).then(function(c) {
          if(c) {
            playlist.create()
            controller.create()
            that.mode()
          }
        })
    },
    // 根据模式切换当前曲目index
    mode: function() {
      var total = playlist.data.length;

      if(!total || playlist.errnum == total)
        return;

      var step = controller.step == 'next' ? 1 : -1

      var next = function() {
        var index = playlist.index + step
        if(index > total || index < 0) {
          index = controller.step == 'next' ? 0 : total-1;
        }
        playlist.index = index;
      }

      var random = function() {
        var p = utils.random(total)
        if(playlist.index !== p) {
          playlist.index = p
        } else {
          next()
        }
      }

      switch (this.options.mode) {
        case 'random':
          random()
          break;
        case 'order':
          next()
          break;
        case 'loop':
          if(controller.step)
            next()

          if(playlist.index == -1)
            random()
          break;
      }

      this.init()
    },
    // 直接设置当前曲目index
    switch: function(index) {
      if(typeof index == 'number'
        && index != playlist.index
        && playlist.current()
        && !playlist.current().error) {
        playlist.index = index;
        this.init()
      }
    },
    // 更新source为当前曲目index
    init: function() {
      // 检查是否正在初始化，避免循环调用
      if (this._isInitializing) return;

      // 标记为正在初始化
      this._isInitializing = true;

      var item = playlist.current()

      if(!item || item['error']) {
        this.mode();
        return;
      }

      var playing = false;
      if(!source.paused) {
        playing = true
        this.stop()
      }

      source.attr('src', item.url);
      source.attr('title', item.name + ' - ' + item.artist);
      this.volume(store.get('_PlayerVolume') || '0.7')
      this.muted(store.get('_PlayerMuted'))

      progress.create()

      if(this.options.type == 'audio')
        preview.create()

      if(playing == true) {
        this.play()
      }

      // 初始化完成后重置初始化标记
      this._isInitializing = false;
    },
    play: function() {
      NOWPLAYING && NOWPLAYING.player.pause()

      if(playlist.current().error) {
        this.mode();
        return;
      }
      var that = this
      source.play().then(function() {
        playlist.scroll()
      }).catch(function(e) {});
    },
    pause: function() {
      source.pause()
      document.title = originTitle
    },
    stop: function() {
      source.pause();
      source.currentTime = 0;
      document.title = originTitle;
    },
    seek: function(time) {
      time = Math.max(time, 0)
      time = Math.min(time, source.duration)
      source.currentTime = time;
      progress.update(time / source.duration)
    },
    muted: function(status) {
      if(status == 'muted') {
        source.muted = status
        store.set('_PlayerMuted', status)
        controller.update(0)
      } else {
        store.del('_PlayerMuted')
        source.muted = false
        controller.update(source.volume)
      }
    },
    volume: function(percentage) {
      if (!isNaN(percentage)) {
        controller.update(percentage)
        store.set('_PlayerVolume', percentage)
        source.volume = percentage
      }
    },
    mini: function() {
      info.hide()
    }
  };

  var info = {
    el: null,
    create: function() {
      if(this.el)
        return;

      this.el = t.createChild('div', {
        className: 'player-info',
        innerHTML: (t.player.options.type == 'audio' ? '<div class="preview"></div>' : '') + '<div class="controller"></div><div class="playlist"></div>'
      }, 'after');

      preview.el = this.el.child(".preview");
      playlist.el = this.el.child(".playlist");
      controller.el = this.el.child(".controller");
    },
    hide: function() {
      var el = this.el
      el.addClass('hide');
      window.setTimeout(function() {
        el.removeClass('show hide')
      }, 300);
    }
  }

  var playlist = {
    el: null,
    data: [],
    index: -1,
    errnum: 0,
    add: function(group, list) {
      var that = this
      list.forEach(function(item, i) {
        item.group = group;
        item.name = item.name || item.title || 'Meida name';
        item.artist = item.artist || item.author || 'Anonymous';
        item.cover = item.cover || item.pic;
        item.type = item.type || 'normal';

        that.data.push(item);
      });
    },
    clear: function() {
      this.data = []
      this.el.innerHTML = ""

      if(this.index !== -1) {
        this.index = -1
        t.player.fetch()
      }
    },
    create: function() {
      var el = this.el

      this.data.map(function(item, index) {
        if(item.el)
          return

        var id = 'list-' + t.player._id + '-'+item.group
        var tab = $('#' + id)
        if(!tab) {
          tab = el.createChild('div', {
            id: id,
            className: t.player.group ?'tab':'',
            innerHTML: '<ol></ol>',
          })
          if(t.player.group) {
            tab.attr('data-title', t.player.options.rawList[item.group]['title'])
                .attr('data-id', t.player._id)
          }
        }

        item.el = tab.child('ol').createChild('li', {
          title: item.name + ' - ' + item.artist,
          innerHTML: '<span class="info"><span>'+item.name+'</span><span>'+item.artist+'</span></span>',
          onclick: function(event) {
            var current = event.currentTarget;
            if(playlist.index === index && progress.el) {
              if(source.paused) {
                t.player.play();
              } else {
                t.player.seek(source.duration * progress.percent(event, current))
              }
              return;
            }
            t.player.switch(index);
            t.player.play();
          }
        })

        return item
      })
      tabFormat()
    },
    current: function() {
      return this.data[this.index]
    },
    scroll: function() {
      var item = this.current()
      var li = this.el.child('li.active')
      li && li.removeClass('active')
      var tab = this.el.child('.tab.active')
      tab && tab.removeClass('active')
      li = this.el.find('.nav li')[item.group]
      li && li.addClass('active')
      tab = this.el.find('.tab')[item.group]
      tab && tab.addClass('active')

      pageScroll(item.el, item.el.offsetTop)

      return this
    },
    title: function() {
      if(source.paused)
        return

      var current = this.current()
      document.title = 'Now Playing...' + current['name'] + ' - ' + current['artist'] + ' | ' + originTitle;
    },
    error: function() {
      var current = this.current()
      current.el.removeClass('current').addClass('error')
      current.error = true
      this.errnum++
    }
  }

  var lyrics = {
    el: null,
    data: null,
    index: 0,
    create: function(box) {
      var current = playlist.index
      var that = this
      var raw = playlist.current().lrc

      var callback = function(body) {
        if(current !== playlist.index)
          return;

        that.data = that.parse(body)

        var lrc = ''
        that.data.forEach(function(line, index) {
          lrc += '<p'+(index===0?' class="current"':'')+'>'+line[1]+'</p>';
        })

        that.el = box.createChild('div', {
          className: 'inner',
          innerHTML: lrc
        }, 'replace')

        that.index = 0;
      }

      if(raw.startsWith('http'))
        this.fetch(raw, callback)
      else
        callback(raw)
    },
    update: function(currentTime) {
      if(!this.data)
        return

      if (this.index > this.data.length - 1 || currentTime < this.data[this.index][0] || (!this.data[this.index + 1] || currentTime >= this.data[this.index + 1][0])) {
        for (var i = 0; i < this.data.length; i++) {
          if (currentTime >= this.data[i][0] && (!this.data[i + 1] || currentTime < this.data[i + 1][0])) {
            this.index = i;
            var y = -(this.index-1);
            this.el.style.transform = 'translateY('+y+'rem)';
            this.el.style.webkitTransform = 'translateY('+y+'rem)';
            this.el.getElementsByClassName('current')[0].removeClass('current');
            this.el.getElementsByTagName('p')[i].addClass('current');
          }
        }
      }
    },
    parse: function(lrc_s) {
      if (lrc_s) {
          lrc_s = lrc_s.replace(/([^\]^\n])\[/g, function(match, p1){return p1 + '\n['});
          const lyric = lrc_s.split('\n');
          var lrc = [];
          const lyricLen = lyric.length;
          for (var i = 0; i < lyricLen; i++) {
              // match lrc time
              const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g);
              // match lrc text
              const lrcText = lyric[i]
                  .replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '')
                  .replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '')
                  .replace(/^\s+|\s+$/g, '');

              if (lrcTimes) {
                  // handle multiple time tag
                  const timeLen = lrcTimes.length;
                  for (var j = 0; j < timeLen; j++) {
                      const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j]);
                      const min2sec = oneTime[1] * 60;
                      const sec2sec = parseInt(oneTime[2]);
                      const msec2sec = oneTime[4] ? parseInt(oneTime[4]) / ((oneTime[4] + '').length === 2 ? 100 : 1000) : 0;
                      const lrcTime = min2sec + sec2sec + msec2sec;
                      lrc.push([lrcTime, lrcText]);
                  }
              }
          }
          // sort by time
          lrc = lrc.filter(function(item){return item[1]});
          lrc.sort(function(a, b){return a[0] - b[0]});
          return lrc;
      } else {
          return [];
      }
    },
    fetch: function(url, callback) {
      fetch(url)
          .then(function(response) {
            return response.text()
          }).then(function(body) {
            callback(body)
          }).catch(function(ex) {})
    }
  }

  var preview = {
    el: null,
    create: function () {
      var current = playlist.current()

      this.el.innerHTML = '<div class="cover"><div class="disc"><img src="'+(current.cover)+'" class="music-blur" /></div></div>'
      + '<div class="info"><h4 class="title">'+current.name+'</h4><span>'+current.artist+'</span>'
      + '<div class="lrc"></div></div>'

      this.el.child('.cover').addEventListener('click', t.player.options.events['play-pause'])

      lyrics.create(this.el.child('.lrc'))
    }
  }

  var progress = {
    el: null,
    bar: null,
    create: function() {
      var current = playlist.current().el

      if(current) {

        if(this.el) {
          this.el.parentNode.removeClass('current')
            .removeEventListener(utils.nameMap.dragStart, this.drag)
          this.el.remove()
        }

        this.el = current.createChild('div', {
          className: 'progress'
        })

        this.el.attr('data-dtime', utils.secondToTime(0))

        this.bar = this.el.createChild('div', {
          className: 'mbar',
        })

        current.addClass('current')

        current.addEventListener(utils.nameMap.dragStart, this.drag);

        playlist.scroll()
      }
    },
    update: function(percent) {
      this.bar.width(Math.floor(percent * 100) + '%')
      this.el.attr('data-ptime', utils.secondToTime(percent * source.duration))
    },
    seeking: function(type) {
      if(type)
        this.el.addClass('seeking')
      else
        this.el.removeClass('seeking')
    },
    percent: function(e, el) {
      var percentage = ((e.clientX || e.changedTouches[0].clientX) - el.left()) / el.width();
      percentage = Math.max(percentage, 0);
      return Math.min(percentage, 1)
    },
    drag: function(e) {
      e.preventDefault()

      var current = playlist.current().el

      var thumbMove = function(e) {
        e.preventDefault()
        var percentage = progress.percent(e, current)
        progress.update(percentage)
        lyrics.update(percentage * source.duration);
      };

      var thumbUp = function(e) {
        e.preventDefault()
        current.removeEventListener(utils.nameMap.dragEnd, thumbUp)
        current.removeEventListener(utils.nameMap.dragMove, thumbMove)
        var percentage = progress.percent(e, current)
        progress.update(percentage)
        t.player.seek(percentage * source.duration)
        source.disableTimeupdate = false
        progress.seeking(false)
      };

      source.disableTimeupdate = true
      progress.seeking(true)
      current.addEventListener(utils.nameMap.dragMove, thumbMove)
      current.addEventListener(utils.nameMap.dragEnd, thumbUp)
    }
  }

  var controller = {
    el: null,
    btns: {},
    step: 'next',
    create: function () {
      if(!t.player.options.controls)
        return

      var that = this
      t.player.options.controls.forEach(function(item) {
        if(that.btns[item])
          return;

        var opt = {
          onclick: function(event){
            that.events[item] ? that.events[item](event) : t.player.options.events[item](event)
          }
        }

        switch(item) {
          case 'volume':
            opt.className = 'iconfont icon-'+ item + (source.muted ? '-off' : '-on') + ' mbtn text-xl leading-loose'
            opt.innerHTML = '<div class="mbar"></div>'
            opt['on'+utils.nameMap.dragStart] = that.events['volume']
            opt.onclick = null
            break;
          case 'play-pause':
            opt.className = 'iconfont ' + (source.paused ? 'icon-play' : 'icon-pause') + ' ' + item + ' mbtn'
            break;
          case 'mode':
            opt.className = item + ' iconfont icon-' + t.player.options.mode + ' mbtn text-xl leading-loose'
            break;
          default:
            opt.className = 'iconfont icon-' + item + ' mbtn text-xl leading-loose'
            break;
        }

        that.btns[item] = that.el.createChild('div', opt)
      })

      that.btns['volume'].bar = that.btns['volume'].child('.mbar')
    },
    events: {
      mode: function(e) {
        switch(t.player.options.mode) {
          case 'loop':
            t.player.options.mode = 'random'
            break;
          case 'random':
            t.player.options.mode = 'order'
            break;
          default:
            t.player.options.mode = 'loop'
        }

        controller.btns['mode'].className = 'mode iconfont icon-' + t.player.options.mode + ' mbtn text-xl leading-loose'
        store.set('_PlayerMode', t.player.options.mode)
      },
      volume: function(e) {
        e.preventDefault()

        var current = e.currentTarget

        var drag = false

        var thumbMove = function(e) {
          e.preventDefault()
          t.player.volume(controller.percent(e, current))
          drag = true
        };

        var thumbUp = function(e) {
          e.preventDefault()
          current.removeEventListener(utils.nameMap.dragEnd, thumbUp)
          current.removeEventListener(utils.nameMap.dragMove, thumbMove)
          if(drag) {
            t.player.muted()
            t.player.volume(controller.percent(e, current))
          } else {
            if (source.muted) {
              t.player.muted()
              t.player.volume(source.volume)
            } else {
              t.player.muted('muted')
              controller.update(0)
            }
          }
        };

        current.addEventListener(utils.nameMap.dragMove, thumbMove)
        current.addEventListener(utils.nameMap.dragEnd, thumbUp)
      },
      backward: function(e) {
        controller.step = 'prev'
        t.player.mode()
      },
      forward: function(e) {
        controller.step = 'next'
        t.player.mode()
      },
    },
    update: function(percent) {
      controller.btns['volume'].className = 'iconfont icon-volume-'+ (source.muted ? 'off' :'on') +' mbtn text-xl leading-loose'
      controller.btns['volume'].bar.width(Math.floor(percent * 100) + '%')
    },
    percent: function(e, el) {
      var percentage = ((e.clientX || e.changedTouches[0].clientX) - el.left()) / el.width();
      percentage = Math.max(percentage, 0);
      return Math.min(percentage, 1);
    }
  }

  var events = {
    onerror: function() {
      playlist.error()
      t.player.mode()
    },
    ondurationchange: function() {
      if (source.duration !== 1) {
        progress.el.attr('data-dtime', utils.secondToTime(source.duration))
      }
    },
    onloadedmetadata: function() {
      t.player.seek(0)
      progress.el.attr('data-dtime', utils.secondToTime(source.duration))
    },
    onplay: function() {
      t.parentNode.addClass('playing')
      showtip(this.attr('title'))
      NOWPLAYING = t
    },
    onpause: function() {
      t.parentNode.removeClass('playing')
      NOWPLAYING = null
    },
    ontimeupdate: function() {
      if(!this.disableTimeupdate) {
        progress.update(this.currentTime / this.duration)
        lyrics.update(this.currentTime)
      }
    },
    onended: function(argument) {
      t.player.mode()
      t.player.play()
    }
  }

  var buttons = {
    el: {},
    create: function() {
      if(!t.player.options.btns)
        return

      var that = this
      t.player.options.btns.forEach(function(item) {
        if(that.el[item])
          return;

        that.el[item] = t.createChild('div', {
            className:'iconfont icon-' + (item === 'play-pause' ? 'play play-pause' : item) + ' mbtn',
            onclick: function(event){
              t.player.fetch().then(function() {
                t.player.options.events[item](event)
              })
            }
          });
      });
    }
  }

  var init = function(config) {
    if(t.player.created)
      return;


    t.player.options = Object.assign(option, config);
    t.player.options.mode = store.get('_PlayerMode') || t.player.options.mode

    // 初始化button、controls以及click事件
    buttons.create()

    // 初始化audio or video
    source = t.createChild(t.player.options.type, events);
    // 初始化播放列表、预览、控件按钮等
    info.create();

    t.parentNode.addClass(t.player.options.type)

    t.player.created = true;
  }

  init(config)

  return t;
}

window.mediaPlayer = mediaPlayer;
