import events from 'events'
import { HighframeMessage } from './message'
import { sanitizeMessage } from './helpers'

interface HighframeChildOptions {
  parentOrigin: string
}

export default class HighframeChild extends events {
  public options: HighframeChildOptions
  private handler?: Function

  constructor(options: HighframeChildOptions) {
    super()
    this.options = options

    this.attach()
    this.ready()
  }

  private attach() {
    const handler = (e: MessageEvent) => {
      if (!sanitizeMessage(e, { allowedOrigin: this.options.parentOrigin })) return
      this.handleMessage(e)
    }

    if (this.handler) {
      // REVIEW: review this cast
      window.removeEventListener('message', this.handler as EventListenerOrEventListenerObject)
    }

    this.handler = handler
    window.addEventListener('message', handler)
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

    parent.postMessage(msg.serialize(), this.options.parentOrigin)
    return true
  }
}
