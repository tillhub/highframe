import events from 'events'

import { environment } from './environment'
import { HighframeMessage } from './message'
import HighframeChild from './child'
import { sanitizeMessage } from './helpers'

import Url from 'url-parse'

export function debug(...args: any[]) {
  if (Highframe.debug) console.log(...['Highframe: ', ...args])
}

export {
  HighframeChild
}

interface HighframeOptions {
  src: string
  title?: string
  childOrigin: string
  frameBorder: string,
  width?: string | number
  height?: string | number
  allowFullscreen?: boolean
  sandbox?: string
  allowPaymentRequest?: boolean
  name?: string
}

interface HighframeClientOptions extends HighframeOptions {
  eventInterceptor?: Function
}

// export const defaultOptions: HighframeClientOptions = {
//   properties: {
//     frameBorder: '0',
//     height: '100%',
//     width: '100%'
//   }
// }

interface EventMap {
  [domName: string]: EventMapItem
}

interface EventMapItem {
  name: string
}

const defaultEventMap: EventMap = {
  'onload': {
    name: 'loaded'
  }
}

interface BoundEventsItem {
  [domName: string]: {
    handler: Function
  }
}

export declare interface HighframeClient {
  // on(event: 'raw-error' | 'error', listener: (error: Error) => void): this
  on(event: string, listener: Function): this
}

export class HighframeClient extends events.EventEmitter {

  public options: HighframeClientOptions
  public static environment = environment
  public initialized = false
  public target: HTMLIFrameElement

  protected static EventMap: EventMap = defaultEventMap
  private boundEvents: BoundEventsItem[] = []

  private handler?: Function

  constructor(target: HTMLIFrameElement, options: HighframeClientOptions) {
    super()
    this.options = options
    this.target = target
    this.bindEvents()
    this.attach()
  }

  private _emit(type: string, ...args: any[]): boolean {
    if (this.options.eventInterceptor) {
      this.options.eventInterceptor(type, ...args)
    }

    this.emit(type, ...args)
    return true
  }

  public sendMessage(type: string, ...args: any[]) {
    if (!this.target.contentWindow) throw new Error('Content window was not initialized')

    const msg: HighframeMessage = new HighframeMessage(type, args)

    this.target.contentWindow.postMessage(msg.serialize(), this.options.childOrigin)
  }

  private bindEvents() {
    Object.entries(HighframeClient.EventMap).forEach(evt => {
      const eName = evt[0]
      const map: EventMapItem = evt[1]

      const handler = (e: Event) => {
        this._emit(map.name, e)
      }

      // dynamic HTMLElement props will be marked as readonly unfortunately
      (this.target as any)[eName as keyof HTMLElement] = handler

      this.boundEvents.push({ [map.name]: { handler } })
    })
  }

  private attach() {
    const handler = (e: MessageEvent) => {
      if (!sanitizeMessage(e, { allowedOrigin: this.options.childOrigin })) return
      this.handleMessage(e)
    }

    this.maybeRemoveHandler()

    this.handler = handler
    window.addEventListener('message', handler)
  }

  private handleMessage(e: MessageEvent) {
    const msg: HighframeMessage | undefined = HighframeMessage.deserialize(e.data, e)
    if (!msg) return
    this._emit(msg.event, ...msg.args)
  }

  private maybeRemoveHandler() {
    if (this.handler) {
      // REVIEW: review this cast
      window.removeEventListener('message', this.handler as EventListenerOrEventListenerObject)
    }
  }

  public destroy(): void {
    this.maybeRemoveHandler()
  }
}

export default class Highframe extends events {
  static debug: boolean = false
  public client: HighframeClient
  public holder: HTMLElement

  constructor(holder: HTMLElement, options: HighframeOptions) {
    super()
    this.holder = holder
    this.holder = Highframe.removeChildren(this.holder)

    const target = Highframe.createClientTarget(options.src, options)

    const opts = {
      ...options,
      eventInterceptor: (type: string, ...args: any[]) => {
        this.handleClientEvent(type, ...args)
      }
    } as HighframeClientOptions

    this.client = new HighframeClient(target, opts)

    Highframe.appendChild(holder, target)
  }

  private handleClientEvent(type: string, ...args: any[]): void {
    this.emit(type, ...(args || []))
  }

  public dispatch(type: string, ...args: any[]): boolean {
    this.client.sendMessage(type, ...args)
    return true
  }

  private static removeChildren(node: HTMLElement): HTMLElement {
    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }

    return node
  }

  private static appendChild(holder: HTMLElement, target: HTMLElement): void {
    holder.appendChild(target)
  }

  private static createClientTarget(src: string, options: HighframeClientOptions): HTMLIFrameElement {
    const elem: HTMLIFrameElement = document.createElement('iframe')
    elem.src = src
    if (options && options.title) elem.title = options.title
    if (options && options.name) elem.name = options.name

    elem.frameBorder = options ? options.frameBorder : '0' // tslint:disable-line deprecation
    // the following following are opinionated property and style normalisations
    // that one almost always wants. We allow the user to override them
    elem.width = options && (options.width || Number.isFinite(options.width as number)) ? String(options.width) : '100%'
    elem.height = options && (options.height || Number.isFinite(options.height as number)) ? String(options.height) : '100%'
    elem.allowFullscreen = options && options.allowFullscreen ? true : false
    elem.allowFullscreen = options && options.allowPaymentRequest ? true : false

    // since sandbox seems rather experimental, let us catch it
    if (options && options.sandbox) {
      try {
        if (elem.sandbox.add) {
          options.sandbox.split(' ').forEach(function (item) {
            elem.sandbox.add(item)
          })
        } else {
          (elem as any).sandbox = options.sandbox
        }
      } catch (err) {
        // no-op
      }
    }

    // margin: 0;
    // padding: 0;
    // border: 0;
    // font-size: 100%;
    // font: inherit;
    // vertical-align: baseline;
    elem.style.display = 'block'
    elem.style.margin = '0'
    elem.style.padding = '0'
    elem.style.border = '0'
    elem.style.fontSize = '100%'
    elem.style.font = 'inherit'
    elem.style.verticalAlign = 'baseline'

    return elem
  }

  public static create(target: HTMLElement, options: HighframeClientOptions): Highframe {
    const inst = new Highframe(target, options)

    return inst
  }

  public static parseOrigin(url: string): string {
    const _url = new Url(url)
    return `${_url.protocol}//${_url.hostname}`
  }

  public destroy(): void {
    this.client.destroy()
  }
}
