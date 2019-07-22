import * as errors from './errors'
import { v4 as uuidv4 } from './uuid'

enum HighframeEventType {
  event = 1
}

function isString(test: any): test is string {
  return typeof test === 'string'
}

export class HighframeMessage {
  public args: any[]
  public event: string
  public type: HighframeEventType = HighframeEventType.event
  public isHighframe: boolean = true
  public id: string

  constructor(event: string, args: any[] = []) {
    this.event = event
    this.args = args
    this.id = uuidv4()
  }

  public serialize() {
    try {
      return JSON.stringify({
        event: this.event,
        args: this.args,
        id: this.id,
        isHighframe: this.isHighframe,
        type: this.type
      })
    } catch (originalError) {
      throw new errors.SerializationError(undefined, originalError)
    }
  }

  private static hasMessageSignature(msg: any) {
    const hasEventSig = msg && msg.event && isString(msg.event)
    const hasHighframeFlag = msg.isHighframe === true
    const hasEventType = Object.values(HighframeEventType).includes(msg.type)

    let hasCorrectArgSig: boolean
    if (!msg.args) {
      hasCorrectArgSig = true
    } else if (msg.args && Array.isArray(msg.args)) {
      hasCorrectArgSig = true
    } else {
      hasCorrectArgSig = false
    }

    return hasEventSig && hasEventType && hasHighframeFlag && hasCorrectArgSig
  }

  public static deserialize(rawMessage: string, e?: MessageEvent): HighframeMessage | undefined {
    let msg: any
    try {
      msg = JSON.parse(rawMessage)
    } catch (originalError) {
      throw new errors.SerializationError(undefined, originalError)
    }

    if (HighframeMessage.hasMessageSignature(msg)) {
      return new HighframeMessage(msg.event, msg.args || [])
    }

    // else implementers should no-op
    return undefined
  }
}
