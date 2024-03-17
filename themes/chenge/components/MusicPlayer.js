import React, { useEffect, useRef, useState } from 'react';
import CONFIG from '../config';
import { siteConfig } from '@/lib/config';
import { loadExternalResource } from '@/lib/utils';

const MusicPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [shouldRenderPlayer, setShouldRenderPlayer] = useState(true);
  const ref = useRef(null);
  const order = siteConfig('MUSIC_PLAYER_ORDER');
  const audioConfig = siteConfig('MUSIC_PLAYER_AUDIO_LIST');
  let audio;

  useEffect(() => {
    if (!siteConfig('MUSIC_PLAYER', null, CONFIG)) {
      setShouldRenderPlayer(false);
      return;
    }

    try {
      audio = typeof audioConfig === 'string' ? JSON.parse(audioConfig) : audioConfig;
    } catch (error) {
      console.error('解析音乐播放列表出错:', error);
      audio = [];
    }

    const initMusicPlayer = async () => {
      if (window.mediaPlayer) {
        try {
          const config = {
            type: 'audio',
            mode: order,
          };
          const t = window.mediaPlayer(ref.current, config);
          if(t && t.player && typeof t.player.load === 'function') {
            t.player.load(audio);
          } else {
            console.error('播放器加载函数不存在');
          }
        } catch (error) {
          console.error('音乐播放器加载异常', error);
        }
      }
    };
    
    const loadResourcesAndInitPlayer = async () => {
      if (!document.querySelector('link[href="/css/player.css"]')) {
        loadExternalResource('/css/player.css', 'css');
      }
      if (!document.querySelector('script[src="/js/mediaPlayer.js"]')) {
        await loadExternalResource('/js/mediaPlayer.js', 'js');
      }
      initMusicPlayer();
    };

    loadResourcesAndInitPlayer();

    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, [audioConfig, order]); // 如果这些值会变，它们应该作为依赖项

  if (!shouldRenderPlayer) {
    return null; // 直接返回 null 来避免渲染任何东西
  }

  return (
    <div ref={ref} className="item player">
      {/* 播放器容器，mediaPlayer将在这个元素内进行初始化 */}
    </div>
  );
};

export default MusicPlayer;
