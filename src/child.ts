import events from 'events'
import { HighframeMessage } from './message'
import { sanitizeMessage } from './helpers'

interface HighframeChildOptions {
  parentOrigin?: string,
  parentOrigins?: string[]
}

export default class HighframeChild extends events {
  public options: HighframeChildOptions
  private handlers: Function[] = []
  private origins: string[] = []

  constructor(options: HighframeChildOptions) {
    super()
    this.options = options

    this.attach()
    this.ready()
  }

  private attach() {
    let origins = []
    if (this.options.parentOrigin) {
      origins.push(this.options.parentOrigin)
    }

    if (this.options.parentOrigins && Array.isArray(this.options.parentOrigins)) {
      origins = [
        ...origins,
        ...this.options.parentOrigins
      ]
    }

    this.origins = origins

    const _removeHandler = (handler: Function) => {
      window.removeEventListener('message', handler as EventListenerOrEventListenerObject)
    }

    if (this.handlers.length) {
      this.handlers.forEach((handler: Function) => [
        _removeHandler(handler)
      ])
    }

    const _attachHandler = (origin: string) => {
      const handler = (e: MessageEvent) => {
        if (!sanitizeMessage(e, { allowedOrigin: origin })) return
        this.handleMessage(e)
      }

      this.handlers.push(handler)
      window.addEventListener('message', handler)
    }

    origins.forEach((origin: string) => {
      _attachHandler(origin)
    })
  }

  private handleMessage(e: MessageEvent) {
    const msg: HighframeMessage | undefined = HighframeMessage.deserialize(e.data, e)
    if (!msg) return
    this.emit(msg.event, ...msg.args)
  }

  public ready() {
    this._emit('ready')
  }

  private _emit(type: string, ...args: any[]): boolean {
    if (!parent) throw new Error('Parent frame is not available')

    const msg: HighframeMessage = new HighframeMessage(type, args)

    this.origins.forEach(function (origin: string) {
      parent.postMessage(msg.serialize(), origin)
    })

    return true
  }
}
