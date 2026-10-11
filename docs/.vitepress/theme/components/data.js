import { data as posts } from './posts.data.mjs'

const imageMap = import.meta.glob('../../../**/cover.{png,jpeg,jpg,webp}', { query: '?url', import: 'default', eager: true })
const thumbnailMap = import.meta.glob('../../../**/cover.{png,jpeg,jpg,webp}', { query: '?blog-thumbnail', import: 'default', eager: true })

export const blogs = posts.map(post => {
  const coverKey = '../../..' + post.cover
  return {
    ...post,
    date: new Date(post.date),
    cover: imageMap[coverKey],
    thumbnail: thumbnailMap[coverKey],
  }
})
