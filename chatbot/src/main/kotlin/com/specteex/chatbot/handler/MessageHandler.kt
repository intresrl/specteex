package com.specteex.chatbot.handler

import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Mono
import reactor.core.publisher.TopicProcessor

data class Event(val sender: Int, val value: Int)

@Component
class MessageHandler: WebSocketHandler {
  private val processor = TopicProcessor.share<Event>("shared", 1024)

  override fun handle(session: WebSocketSession): Mono<Void> {
    return session.send(
      processor
        .map { ev -> session.textMessage("${ev.sender}:${ev.value}") }
    ).and(
      session.receive()
        .map { ev ->
          println(ev.payloadAsText);
          Event(sender = 1, value = 1)
        }
        .log()
        .doOnNext { ev -> processor.onNext(ev) }
    )
  }

}
