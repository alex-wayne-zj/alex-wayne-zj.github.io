<script setup>
import { useData } from 'vitepress'
const { frontmatter } = useData()
</script>

<template>
  <div class="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all">
    <img
      class="w-full aspect-[2.35/1] object-cover"
      :src="frontmatter.cover"
      :alt="frontmatter.title"
    />
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
      <h2 class="text-xl font-semibold truncate">
        {{ frontmatter.title }}
      </h2>
      <p class="text-sm text-white/80 mt-1">
        {{ frontmatter.date.split('T')[0] }}
      </p>
    </div>
  </div>
</template>