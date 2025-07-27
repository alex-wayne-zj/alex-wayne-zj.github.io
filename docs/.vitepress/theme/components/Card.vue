<template>
  <a :href="blog.url" class="relative w-full rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all">
    <img
      class="w-full aspect-[2.35/1] object-cover"
      :src="blog.cover"
      :alt="blog.title"
    />
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
      <h2 class="text-lg font-semibold truncate">
        {{ blog.title }}
      </h2>
      <p class="text-xs text-white/80 mt-1">
        {{ blog.date.toISOString().split('T')[0] }}
      </p>
    </div>
  </a>
</template>

<script setup>
defineProps({
  blog: {
    type: Object,
    required: true
  }
})
</script>
