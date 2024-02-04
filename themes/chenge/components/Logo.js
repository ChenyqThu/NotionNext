import { siteConfig } from '@/lib/config'
import Link from 'next/link'

const Logo = props => {
  return (
    <Link href='/' passHref legacyBehavior>
      {/* <div className='flex flex-col justify-center items-center cursor-pointer space-y-3'> */}
        <div className='font-medium text-lg rounded dark:border-white dark:text-white cursor-pointer transform duration-200 pb-1'> {siteConfig('TITLE') }</div>
      {/* </div> */}
    </Link>
  )
}
export default Logo
