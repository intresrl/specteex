package com.specteex.chatbot.config

import com.specteex.chatbot.handler.MessageHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.config.EnableWebFlux
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter

@Configuration
@EnableWebFlux
class WebSocketConfig(val messageHandler: MessageHandler) {

  @Bean
  fun webSocketHandlerAdapter() = WebSocketHandlerAdapter()

  @Bean
  fun handlerMapping(): HandlerMapping {
    val handlerMapping = SimpleUrlHandlerMapping()

    handlerMapping.urlMap = mapOf(
      "/ws/chat" to messageHandler
    )

    handlerMapping.order = 1
    return handlerMapping
  }
}
