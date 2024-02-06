import { useGlobal } from '@/lib/global'
import { useImperativeHandle } from 'react'

/**
 * 深色模式按钮
 */
const DarkModeButton = (props) => {
  const { cRef, className } = props
  const { isDarkMode, toggleDarkMode } = useGlobal()

  /**
   * 对外暴露方法
   */
  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: () => {
        toggleDarkMode()
      }
    }
  })

  return (
    <div id='darkModeButton' onClick={toggleDarkMode} className={`${className || ''} cursor-pointer dark:text-white hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200 transition-all`}>
      <i className={`iconfont ${isDarkMode ? 'icon-moon' : 'icon-sun'}`} />
    </div>)
}
export default DarkModeButton
