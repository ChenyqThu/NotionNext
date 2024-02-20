import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 音乐播放器
 * @returns
 */
const Player = () => {
  const [player, setPlayer] = useState()
  const ref = useRef(null)
  const lrcType = JSON.parse(siteConfig('MUSIC_PLAYER_LRC_TYPE'))
  const playerVisible = JSON.parse(siteConfig('MUSIC_PLAYER_VISIBLE'))
  const autoPlay = JSON.parse(siteConfig('MUSIC_PLAYER_AUTO_PLAY'))
  const meting = JSON.parse(siteConfig('MUSIC_PLAYER_METING'))
  const order = siteConfig('MUSIC_PLAYER_ORDER')
  const audio = siteConfig('MUSIC_PLAYER_AUDIO_LIST')

  const musicPlayerEnable = siteConfig('MUSIC_PLAYER')
  const musicPlayerCDN = siteConfig('MUSIC_PLAYER_CDN_URL')
  const musicMetingEnable = siteConfig('MUSIC_PLAYER_METING')
  const musicMetingCDNUrl = siteConfig('MUSIC_PLAYER_METING_CDN_URL', 'https://cdnjs.cloudflare.com/ajax/libs/meting/2.0.1/Meting.min.js')

  // 初始化音乐播放器
  const initMusicPlayer = async () => {
    if (!musicPlayerEnable) {
      return
    }
    try {
      // 动态加载mediaPlayer.js
      await loadExternalResource('/js/mediaPlayer.js','js')
      await loadExternalResource('https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js','js')
      
      // 检查全局变量是否存在，这假设mediaPlayer.js定义了一个全局变量或函数来初始化播放器
      if (mediaPlayer) {
        const config = {
          type: 'audio', 
          mode: order,
          btns: ['play-pause', 'music'], // 显示的按钮
          controls: ['mode', 'backward', 'play-pause', 'forward', 'volume'], // 显示的控件
        }
        // 初始化播放器，并将其保存到状态中
        const playerInstance = mediaPlayer(ref.current, config)
        setPlayer(playerInstance)
        //加载播放列表
        const audio = ['https://music.163.com/playlist?id=37432514']
        playerInstance.player.load(audio);
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
    <div id="tool" class="audio affix bottom-[15rem] left-1 fixed justify-end z-20  text-white bg-tab dark:bg-hexo-black-gray rounded-sm">
      <div id="playerContainer" ref={ref} className={`visible item player`}>
      {/* 播放器容器，mediaPlayer将在这个元素内进行初始化 */}
      </div>
    </div>
  )


  // const initMusicPlayer = async () => {
  //   if (!musicPlayerEnable) {
  //     return
  //   }
  //   try {
  //     await loadExternalResource(musicPlayerCDN, 'js')
  //   } catch (error) {
  //     console.error('音乐组件异常', error)
  //   }

  //   if (musicMetingEnable) {
  //     await loadExternalResource(musicMetingCDNUrl, 'js')
  //   }

  //   if (!meting && window.APlayer) {
  //     setPlayer(new window.APlayer({
  //       container: ref.current,
  //       fixed: true,
  //       lrcType: lrcType,
  //       autoplay: autoPlay,
  //       order: order,
  //       audio: audio
  //     }))
  //   }
  // }

  // useEffect(() => {
  //   initMusicPlayer()
  //   return () => {
  //     setPlayer(undefined)
  //   }
  // }, [])

  // return (
  //   <div className={`{playerVisible ? 'visible' : 'invisible'}`}>
  //     <link
  //       rel="stylesheet"
  //       type="text/css"
  //       href="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.css"
  //     />
  //     {meting
  //       ? <meting-js
  //           fixed="true"
  //           type="playlist"
  //           preload="auto"
  //           lrc-type={siteConfig('MUSIC_PLAYER_METING_LRC_TYPE')}
  //           autoplay={autoPlay}
  //           order={siteConfig('MUSIC_PLAYER_ORDER')}
  //           server={siteConfig('MUSIC_PLAYER_METING_SERVER')}
  //           id={siteConfig('MUSIC_PLAYER_METING_ID')}
  //         />
  //       : <div ref={ref} data-player={player} />
  //     }
  //   </div>
  // )
}

export default Player
