'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'
import { hero as fallbackHero, about as fallbackAbout, education as fallbackEducation, experience as fallbackExperience, skillCategories as fallbackSkills, contact as fallbackContact } from '@/data/content'
import { projects as fallbackProjects } from '@/data/projects'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function load() {
      const [hero, about, education, experience, skill_categories, projects, contact] = await Promise.all([
        fetchSingle('hero', fallbackHero),
        fetchSingle('about', fallbackAbout),
        fetchList('education', fallbackEducation),
        fetchList('experience', fallbackExperience),
        fetchList('skill_categories', fallbackSkills),
        fetchList('projects', fallbackProjects),
        fetchContact(),
      ])
      setData({ hero, about, education, experience, skill_categories, projects, contact })
    }
    load()
  }, [])

  return <ContentContext.Provider value={data}>{children}</ContentContext.Provider>
}

async function fetchSingle(table, fallback) {
  const res = await api.public.fetch(table)
  if (res && res.length > 0) return res[0]
  return fallback
}


async function fetchList(table, fallback) {
  const res = await api.public.fetch(table, '?order=order_index.asc')
  if (res && res.length > 0) return res
  return fallback
}

async function fetchContact() {
  const raw = await api.public.fetch("contact");
  const c = raw?.[0] || fallbackContact;

  return {
    whatsapp: c.whatsapp || "",
    email: c.email || "",
    github: c.github || c.social?.github || "",
    linkedin: c.linkedin || c.social?.linkedin || "",
    facebook: c.facebook || c.social?.facebook || "",
    instagram: c.instagram || c.social?.instagram || "",
  };
}

function useContent() {
  const ctx = useContext(ContentContext)
  return ctx || {}
}

export function useHero() {
  const ctx = useContext(ContentContext);
  return ctx?.hero || fallbackHero;
}

export function useAbout() { return useContent().about || fallbackAbout }
export function useEducation() { return useContent().education || fallbackEducation }
export function useExperience() { return useContent().experience || fallbackExperience }
export function useSkills() { return useContent().skill_categories || fallbackSkills }
export function useProjects() {
  const ctx = useContext(ContentContext)
  return ctx ? ctx.projects : null
}
export function useContact() { return useContent().contact || fallbackContact }
