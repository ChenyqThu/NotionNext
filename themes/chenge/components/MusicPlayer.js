import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 音乐播放器
 * @returns
 */
const MusicPlayer = () => {
  const [player, setPlayer] = useState()
  const ref = useRef(null)
  const order = siteConfig('MUSIC_PLAYER_ORDER')
  // const autoPlay = siteConfig('MUSIC_PLAYER_AUTOPLAY', false, CONFIG)
  const audioConfig = siteConfig('MUSIC_PLAYER_AUDIO_LIST')
  let audio;
  try {
    if (typeof audioConfig === 'string') {
      // 如果是字符串，则使用JSON.parse解析
      audio = JSON.parse(audioConfig);
    } else {
      // 如果不是字符串（即已经是对象），则直接使用
      audio = audioConfig;
    }
  } catch (error) {
    console.error('解析音乐播放列表出错:', error);
    audio = [];
  }

  // 没有开启音乐播放器，直接返回空
  if (!siteConfig('MUSIC_PLAYER', null, CONFIG)) {
    return <></>
  }
  // 开启音乐播放器
  const initMusicPlayer = async () => {
    try {
      // 动态加载mediaPlayer.js
      await loadExternalResource('/js/mediaPlayer.js', 'js')
      // 检查全局变量是否存在，这假设mediaPlayer.js定义了一个全局变量或函数来初始化播放器
      if (mediaPlayer) {
        const config = {
          type: 'audio',
          mode: order
        }
        // 初始化播放器，并将其保存到状态中
        const playerInstance = mediaPlayer(ref.current, config)
        setPlayer(playerInstance)
        // 加载播放列表
        playerInstance.player.load(audio);
        // 自动播放音乐
        // if (autoPlay) {
        //   playerInstance.player.play();
        // }
      }
    } catch (error) {
      console.error('音乐播放器加载异常', error)
    }
  }

  // 组件挂载时初始化播放器，组件卸载时进行清理
  useEffect(() => {
    initMusicPlayer()
    return () => {
      // 清理播放器资源，例如停止播放、解绑事件等
      if (player && player.destroy) {
        player.destroy()
      }
    }
  }, [])

  return (
      <div ref={ref} className='item player'>
      {/* 播放器容器，mediaPlayer将在这个元素内进行初始化 */}
      </div>
  )
}

export default MusicPlayer
