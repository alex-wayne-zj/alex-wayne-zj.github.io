<template>
  <div class="max-w-7xl mx-auto px-4 py-1">
    <!-- 标签分类-->
    <div class="flex items-center justify-center flex-wrap gap-4 mb-4">
      <button type="button" class="cursor-pointer font-semibold hover:underline select-none"
        :aria-expanded="showTags" aria-controls="blog-tags" @click="showTags = !showTags">
        标签 <span aria-hidden="true">{{ showTags ? '⏴' : '⏵' }}</span>
      </button>
      <div id="blog-tags" class="flex flex-wrap items-center gap-4 transition-all ease-in-out duration-800"
        :aria-hidden="!showTags" :inert="showTags ? null : ''"
        :class="showTags ? 'opacity-100 ml-4' : 'max-w-0 max-h-0 opacity-0 overflow-hidden'">
        <button type="button" v-for="tag in allTags" :key="tag.name"
          :aria-pressed="selectedTag === tag.name" @click="selectTag(tag.name)" :class="[
          'cursor-pointer text-sm transition',
          selectedTag === tag.name
            ? 'underline underline-offset-4 font-semibold'
            : 'text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'
        ]">
          {{ tag.name }} ({{ tag.count }})
        </button>
      </div>
    </div>

    <!-- 博客卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card v-for="blog in pagedblogs" :key="blog.cover" :blog="blog" />
    </div>

    <!-- 分页器 -->
    <nav aria-label="文章分页" class="mt-4 flex justify-center space-x-4 text-sm" v-if="totalPages > 1">
      <button type="button" v-for="page in totalPages" :key="page" :aria-label="`第 ${page} 页`"
        :aria-current="page === currentPage ? 'page' : null" @click="selectPage(page)" :class="[
        'cursor-pointer transition select-none',
        page === currentPage
          ? 'font-semibold underline underline-offset-4'
          : 'text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'
      ]">
        {{ page }}
      </button>
    </nav>

    <div class="flex items-center justify-center mt-4">
      <span class="text-sm">Stay Sharp. Stay Gentle.</span>
      <hr>
    </div>
  </div>
</template>

<script setup>
import Card from './Card.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vitepress'
import { blogs } from './data.js'

const router = useRouter()
const selectedTag = ref('最新')
const showTags = ref(false)

const filteredblogs = computed(() => {
  if (selectedTag.value === '最新') return blogs
  return blogs.filter(blog => blog.tags.includes(selectedTag.value))
})

const pageSize = 12
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.ceil(filteredblogs.value.length / pageSize)
)

const pagedblogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredblogs.value.slice(start, start + pageSize)
})

const allTags = computed(() => {
  const tagMap = new Map()
  blogs.forEach(blog => {
    (blog.tags || []).forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  const list = [{ name: '最新', count: blogs.length }]
  tagMap.forEach((count, name) => list.push({ name, count }))
  return list
})

let homePath = ''
let previousAfterNavigation

function syncAfterNavigation(href) {
  restoreFromUrl()
  return previousAfterNavigation?.(href)
}

function writeUrl(mode) {
  const url = new URL(window.location.href)
  if (selectedTag.value === '最新') url.searchParams.delete('tag')
  else url.searchParams.set('tag', selectedTag.value)
  if (currentPage.value === 1) url.searchParams.delete('page')
  else url.searchParams.set('page', String(currentPage.value))

  showTags.value = Boolean(url.searchParams.get('tag'))

  if (url.href === window.location.href) return

  const state = { ...window.history.state, scrollPosition: window.scrollY }
  if (mode === 'push') {
    window.history.replaceState(state, '')
    window.history.pushState(state, '', url)
  } else {
    window.history.replaceState(state, '', url)
  }
}

function restoreFromUrl() {
  // A popstate event can leave the homepage before this component unmounts.
  if (window.location.pathname !== homePath) return

  const params = new URLSearchParams(window.location.search)
  const tag = params.get('tag')
  selectedTag.value = allTags.value.some(item => item.name === tag) ? tag : '最新'

  const page = Number(params.get('page'))
  currentPage.value = Number.isSafeInteger(page) && page > 0
    ? Math.min(page, Math.max(1, totalPages.value))
    : 1
  writeUrl('replace')
}

function selectTag(tag) {
  selectedTag.value = tag
  currentPage.value = 1
  writeUrl('push')
}

function selectPage(page) {
  currentPage.value = page
  writeUrl('push')
}

onMounted(() => {
  homePath = window.location.pathname
  restoreFromUrl()
  previousAfterNavigation = router.onAfterRouteChanged
  router.onAfterRouteChanged = syncAfterNavigation
  window.addEventListener('popstate', restoreFromUrl)
})

onUnmounted(() => {
  window.removeEventListener('popstate', restoreFromUrl)
  if (router.onAfterRouteChanged === syncAfterNavigation) {
    router.onAfterRouteChanged = previousAfterNavigation
  }
})
</script>
