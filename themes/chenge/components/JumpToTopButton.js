import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = ({ showPercent = true, percent }) => {
  const { locale } = useGlobal()

  if (!siteConfig('HEXO_WIDGET_TO_TOP', null, CONFIG)) {
    return <></>
  }
  return (<div className='items-center justify-center opacity-80 transform hover:opacity-100 duration-200 w-8 h-7 text-center' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} >
        <div title={locale.POST.TOP} ><i className='fas fa-arrow-up text-md' /></div>
        {showPercent && (<div className='text-xs hidden lg:block'>{percent}</div>)}
    </div>)
}

export default JumpToTopButton
