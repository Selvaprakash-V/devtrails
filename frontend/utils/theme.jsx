import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ theme: 'light', toggle: ()=>{} })

export function ThemeProvider({ children }){
  const [theme, setTheme] = useState('light')
  useEffect(()=>{
    const stored = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(stored)
    document.documentElement.classList.toggle('dark', stored==='dark')
  },[])
  useEffect(()=>{ localStorage.setItem('theme', theme); document.documentElement.classList.toggle('dark', theme==='dark') },[theme])
  const toggle = ()=> setTheme(t=> t==='dark' ? 'light' : 'dark')
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme(){ return useContext(ThemeContext) }
export function useThemeSync(){ return useContext(ThemeContext) }

export function ThemeConsumer(){ return null }

export const ThemeProviderExport = ThemeProvider

export default ThemeContext
