import SmartLink from '@/components/SmartLink'
import { useState } from 'react'

/**
 * 支持下拉二级的菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemDrop = ({ link, variant = 'default' }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0
  const isInline = variant === 'inline'

  const itemShell = isInline
    ? 'relative flex-shrink-0'
    : 'cursor-pointer'

  const linkBox = isInline
    ? 'rounded-md px-2 py-1.5 tl-nav-link no-underline flex items-center gap-1.5 whitespace-nowrap'
    : 'rounded px-2 md:pl-0 md:mr-3 my-4 md:pr-3 text-gray-700 dark:text-gray-200 no-underline md:border-r border-gray-light'

  return (
    <li
      className={itemShell}
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}>
      {!hasSubMenu && (
        <div className={linkBox}>
          <SmartLink href={link?.href} target={link?.target}>
            {link?.icon && <i className={link?.icon} />} {link?.name}
            {hasSubMenu && <i className='px-2 fa fa-angle-down'></i>}
          </SmartLink>
        </div>
      )}

      {hasSubMenu && (
        <div className={linkBox}>
          {link?.icon && <i className={link?.icon} />} {link?.name}
          <i
            className={`px-2 fas fa-chevron-down duration-500 transition-all ${show ? ' rotate-180' : ''}`}></i>
        </div>
      )}

      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          className={`${
            show ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'
          } absolute z-30 transition-all duration-200 ${
            isInline
              ? 'tl-card left-0 top-full mt-1 min-w-[10rem] py-1 shadow-lg'
              : 'left-0 top-12 block border border-gray-100 bg-white drop-shadow-lg dark:border-gray-800 dark:bg-black'
          }`}>
          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                className={`not:last-child:border-b-0 border-b text-gray-700 dark:text-gray-200  hover:bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200  dark:border-gray-800 py-3 pr-6 pl-3 ${
                  isInline ? 'border-0 hover:bg-[var(--tl-accent-soft)]' : ''
                }`}>
                <SmartLink href={sLink.href} target={link?.target}>
                  <span className='text-sm text-nowrap font-extralight'>
                    {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                    {sLink.title}
                  </span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
