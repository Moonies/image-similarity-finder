declare module 'tiff.js' {
  class Tiff {
    constructor(options?: { buffer?: ArrayBuffer })
    toCanvas(): HTMLCanvasElement
    toDataURL(): string
    close(): void
  }

  export default Tiff
}
