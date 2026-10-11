import { createHash } from 'node:crypto'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import type { Plugin } from 'vite'

// One size for cards: approximately 320 CSS pixels on a 2x display.
const width = 640
const quality = 80

export default function coverThumbnails(): Plugin {
  let cacheDir: string
  const pending = new Map<string, Promise<string>>()

  return {
    name: 'blog-cover-thumbnails',
    enforce: 'pre',
    configResolved(config) {
      cacheDir = path.resolve(config.cacheDir, 'cover-thumbnails')
    },
    async load(id) {
      const [sourcePath, query] = id.split('?')
      if (!new URLSearchParams(query).has('blog-thumbnail')) return
      this.addWatchFile(sourcePath)
      const source = await readFile(sourcePath)
      const hash = createHash('sha256')
        .update(source)
        .update(`webp:${width}:${quality}:${sharp.versions.sharp}`)
        .digest('hex').slice(0, 16)

      if (!pending.has(hash)) {
        pending.set(hash, (async () => {
          const output = path.join(cacheDir, `thumbnail-${hash}.webp`)
          try {
            await access(output)
          } catch {
            const thumbnail = await sharp(source)
              .rotate()
              .resize({ width, withoutEnlargement: true })
              .webp({ quality })
              .toBuffer()
            await mkdir(cacheDir, { recursive: true })
            await writeFile(output, thumbnail)
          }
          return output
        })())
      }

      // Let Vite handle development URLs, production hashes, and the site base.
      const output = await pending.get(hash)
      return `export { default } from ${JSON.stringify(output!.split(path.sep).join('/') + '?url')}`
    }
  }
}
