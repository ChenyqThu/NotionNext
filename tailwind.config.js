const BLOG = require('./blog.config')
const { fontFamilies } = require('./lib/font')

module.exports = {
  content: ['./pages/**/*.js', './components/**/*.js', './layouts/**/*.js', './themes/**/*.js'],
  darkMode: BLOG.APPEARANCE === 'class' ? 'media' : 'class', // or 'media' or 'class'
  theme: {
    fontFamily: fontFamilies,
    extend: {
      colors: {
        day: {
          DEFAULT: BLOG.BACKGROUND_LIGHT || '#ffffff'
        },
        night: {
          DEFAULT: BLOG.BACKGROUND_DARK || '#111827'
        },
        hexo: {
          'background-grey': '#f5f5f5',
          'background-black': '#21252b',
          'black-gray': '#101414',
          'light-gray': '#e5e5e5',
          'aqua':'var(--aqua)',
          'cyan-light': 'var(--color-cyan-light)', 
          'pink-light': 'var(--color-pink-light)',
          'grey': 'var(--grey)',
          'orange':'var(--color-orange)'
        },
      },
      backgroundImage: {
        'gradient': 'var(--nav-bg)',
        'tab': 'var(--tab-bg)'
      },
      maxWidth: {
        side: '14rem',
        '9/10': '90%',
        '75p': '75%', 
        'custom':'calc(100% - 18rem);'
      },
      width:{
        '50p':'50%',
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
